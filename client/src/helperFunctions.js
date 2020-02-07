import axios from "axios";
import { RRule } from "rrule";
import moment from "moment";

var JapaneseHolidays = require("japanese-holidays");

const getRecurrences = event => {
  const now = new Date();
  // Create start and end dates for the current month to calc
  // teaching minutes
  const month_start = new Date(now.getFullYear(), now.getMonth(), 1);
  const month_end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  // Create an array of DateTimes for the recurrence of events.
  const rrule = new RRule({
    freq: RRule.WEEKLY,
    count: 26,
    interval: 1,
    dtstart: new Date(event.start)
  });
  const twoMonthsRecurrences = rrule.between(month_start, month_end);
  twoMonthsRecurrences.shift();
  return twoMonthsRecurrences;
};

const calcDutyHours = (dutyHours, start) => {
  if (moment(start) < dutyHours.startTime) {
    dutyHours.startTime = moment(start);
  }

  // Add 9 hours to the DH start time to ensure a minimum of 9 DH
  if (dutyHours.endTime.diff(dutyHours.startTime, "hours") < 9) {
    dutyHours.endTime = moment(dutyHours.startTime).add(9, "hours");
  }
  return dutyHours;
};

const calcOutsideDutyMins = (
  eventStart,
  eventEnd,
  duration,
  dutyHoursStart,
  dutyHoursEnd
) => {
  // Calculate difference in hours between the duty hours start time and the lesson start time
  const startDiff = dutyHoursStart.diff(eventStart, "minutes");
  const endDiff = dutyHoursStart.diff(eventEnd, "minutes");

  // Calculate difference in hours between the duty hours end time and the lesson end time
  const afterDhEndDiff = -dutyHoursEnd.diff(eventEnd, "minutes");
  const afterDhStartDiff = -dutyHoursEnd.diff(eventStart, "minutes");

  let outsideDutyMins;
  if (startDiff <= 0 && afterDhEndDiff <= 0) {
    outsideDutyMins = 0;
    return {
      teachingMins: duration,
      outsideDutyMins: outsideDutyMins
    };
  } else if (
    (startDiff > 0 && endDiff > 0) ||
    (afterDhEndDiff > 0 && afterDhStartDiff > 0)
  ) {
    return {
      teachingMins: 0,
      outsideDutyMins: duration
    };
  } else if (startDiff > 0) {
    const regularTeachingMins = duration - startDiff;
    return {
      teachingMins: regularTeachingMins,
      outsideDutyMins: startDiff
    };
  } else {
    const regularTeachingMins = duration - afterDhEndDiff;
    return {
      teachingMins: regularTeachingMins,
      outsideDutyMins: afterDhEndDiff
    };
  }
};

const createPayPeriodData = (events, teacher, monthStart, monthEnd) => {
  // Creates an object of dates containing minutes worked, by work type
  const datesData = {};
  teacher.teachingMins = 0;
  teacher.outsideDutyMins = 0;
  teacher.holidayMins = 0;
  teacher.overThresholdOneMins = 0;
  teacher.overThresholdTwoMins = 0;

  const monthEvents = events.filter(e => {
    return (
      moment(e.start).isBetween(monthStart, monthEnd, null, "[]") &&
      e.resourceId === teacher.resourceId
    );
  });

  const dutyHoursByDate = {};

  monthEvents.forEach(e => {
    const date = e.start.getDate();
    // Set the base duty hours to noon to ensure at least 9 duty hours
    if (!dutyHoursByDate[date]) {
      const baseDutyHours = {
        startTime: moment(e.start)
          .set("hour", 12)
          .set("minutes", 0),
        endTime: moment(e.start)
          .set("hour", 12)
          .set("minutes", 0)
      };
      // Set the duty hours for the event's date
      dutyHoursByDate[date] = calcDutyHours(baseDutyHours, e.start, e.end);
    } else {
      // Set the duty hours for the event's date
      dutyHoursByDate[date] = calcDutyHours(
        dutyHoursByDate[date],
        e.start,
        e.end
      );
    }
  });

  monthEvents.forEach(e => {
    if (moment(e.start).isBetween(monthStart, monthEnd, null, "[]")) {
      if (e.resourceId === teacher.resourceId) {
        const date = e.start.getDate();
        const day = e.start.getDay();
        // Calculate number of minutes to add to first threshold to calc second threshold. (10 hours * 60 mins)
        const secondThreshold = 10 * 60;
        let teachingMins = 0;
        let outsideDutyMins = 0;
        let holidayMins = 0;

        // If event falls on a national holiday, add the class duration to holiday minutes,
        // otherwise, add to total teaching minutes
        if (
          JapaneseHolidays.isHoliday(e.start) ||
          e.start.getDay() === (0 || 1)
        ) {
          holidayMins = parseInt(e.duration);
          teacher.holidayMins += holidayMins;
        } else {
          console.log(dutyHoursByDate[date]);
          const totalTeachingMins = calcOutsideDutyMins(
            e.start,
            e.end,
            e.duration,
            dutyHoursByDate[date].startTime,
            dutyHoursByDate[date].endTime
          );

          // Add total teaching minutes and outside duty minutes to teacher object
          teachingMins = totalTeachingMins.teachingMins;
          teacher.teachingMins += teachingMins;
          outsideDutyMins = totalTeachingMins.outsideDutyMins;
          teacher.outsideDutyMins += outsideDutyMins;
        }
        // Calculate hours worked over monthly thresholds one and two
        if (teacher.teachingMins >= teacher.otThreshold + secondThreshold) {
          teacher.overThresholdTwoMins +=
            teacher.teachingMins - (teacher.otThreshold + secondThreshold);
          teacher.overThresholdOneMins += secondThreshold;
        } else if (teacher.teachingMins >= teacher.otThreshold) {
          teacher.overThresholdOneMins +=
            teacher.teachingMins - teacher.otThreshold;
        }
        // Teaching minutes object to be added to hash table
        const dateData = {
          resourceId: teacher,
          date: date,
          day: day,
          teachingMins: teachingMins,
          outsideDutyMins: outsideDutyMins,
          overThresholdOneMins: teacher.overThresholdOneMins,
          overThresholdTwoMins: teacher.overThresholdTwoMins,
          holidayMins: holidayMins,
          travelAllowance: 0,
          travelExpenses: 0
        };
        // If date already in hash table, add teaching minutes to existing keys, otherwise create
        // a new date object
        if (datesData[date]) {
          datesData[date].teachingMins += dateData.teachingMins;
          datesData[date].outsideDutyMins += dateData.outsideDutyMins;
          datesData[date].overThresholdOneMins += dateData.overThresholdOneMins;
          datesData[date].overThresholdTwoMins += dateData.overThresholdTwoMins;
          datesData[date].holidayMins += dateData.holidayMins;
          datesData[date].travelAllowance += dateData.travelAllowance;
          datesData[date].travelExpenses += dateData.travelExpenses;
        } else {
          datesData[date] = dateData;
        }
      }
    }
  });
  return datesData;
};

const addTeachingMins = (events, teachers, setTeachers) => {
  const now = new Date();
  // Create start and end dates for the current month to calc
  // teaching minutes
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  if (teachers.length > 0) {
    // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
    teachers.forEach(teacher => {
      teacher.teachingMins = 0;
      teacher.outsideDutyMins = 0;
      teacher.holidayMins = 0;
      teacher.overThresholdOneMins = 0;
      teacher.overThresholdTwoMins = 0;
    });
    teachers.forEach(teacher => {
      createPayPeriodData(events, teacher, monthStart, monthEnd);
      updateTeacher(teacher, teachers, setTeachers);
    });
  }
};

const getTeachers = async (events, teachers, setTeachers) => {
  return await axios
    .get("/teachers/")
    .then(res => {
      if (res.data.length > 0) {
        setTeachers(res.data);
      }
    })
    .then(addTeachingMins(events, teachers, setTeachers))
    .catch(err => console.log(err));
};

const getLessons = async (events, setEvents) => {
  return await axios
    .get("/lessons/")
    .then(res => {
      if (res.data.length > 0) {
        res.data.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
        setEvents([...res.data, events[0]]);
      }
    })
    .catch(err => console.log(err));
};

const addLesson = async (events, event, setEvents) => {
  const newEvents = [];
  if (event.recur === true) {
    const recurrences = getRecurrences(event);
    recurrences.map(r => {
      const newEvent = {
        ...event,
        start: r,
        end: moment(r)
          .add(event.duration, "m")
          .toDate(),
        isNewEvent: false
      };
      if (JapaneseHolidays.isHoliday(r)) {
        newEvent.isHoliday = true;
      }
      newEvents.push(newEvent);
    });
  }
  if (JapaneseHolidays.isHoliday(event.start)) {
    event = { ...event, isHoliday: true };
  }
  event = { ...event, isNewEvent: true };
  newEvents.push(event);
  await axios
    .post("/lessons/add", newEvents)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  return getLessons(events, setEvents);
};

const addTeacher = async (teachers, newTeacher, setTeachers) => {
  await axios
    .post("/teachers/add", newTeacher)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  return setTeachers([...teachers, newTeacher]);
};

const updateTeacher = async (teacher, teachers, setTeachers) => {
  const idx = teachers.findIndex(t => t._id === teacher._id);
  const updatedTeachers = [...teachers];

  const updatedTeacher = {
    ...teacher,
    resourceTitle: teacher.resourceTitle,
    name: teacher.name,
    familyName: teacher.familyName,
    teachingMins: teacher.teachingMins,
    holidayMins: teacher.holidayMins,
    outsideDutyMins: teacher.outsideDutyMins,
    otThreshold: teacher.otThreshold,
    overThresholdOneMins: teacher.overThresholdOneMins,
    overThresholdTwoMins: teacher.overThresholdTwoMins
  };
  updatedTeachers.splice(idx, 1, updatedTeacher);

  setTeachers(updatedTeachers);
  return await axios
    .put(`/teachers/update/${teacher._id}`, updatedTeacher)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const deleteTeacher = async teacher => {
  return await axios
    .delete(`/teachers/delete/${teacher._id}`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const deleteEvent = async (events, event, setEvents) => {
  const newEvents = events.filter(evt => evt._id !== event._id);
  setEvents(newEvents);
  return await axios
    .delete(`/lessons/delete/${event._id}`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const changeEvent = async (events, event, editedEvent, setEvents) => {
  const idx = events.findIndex(e => e._id === event._id);
  const nextEvents = [...events];

  nextEvents.splice(idx, 1, editedEvent);
  setEvents(nextEvents);

  return await axios
    .put(`/lessons/update/${event._id}`, editedEvent)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const addPayment = async newPayment => {
  return await axios
    .post(`/payments/add`, newPayment)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

export {
  getRecurrences,
  addTeachingMins,
  getTeachers,
  getLessons,
  addLesson,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  deleteEvent,
  changeEvent,
  addPayment,
  createPayPeriodData
};
