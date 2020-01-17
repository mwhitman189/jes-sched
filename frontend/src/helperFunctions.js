import axios from "axios";
import { RRule } from "rrule";
import moment from "moment";

var JapaneseHolidays = require("japanese-holidays");

const API_URI = "http://localhost:5000";

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
  return twoMonthsRecurrences;
};

const calcOutsideDutyMins = (start, end, duration) => {
  const dutyHoursStart = moment(new Date(start).setHours(12, 0, 0));
  const startDiff = dutyHoursStart.diff(start, "minutes");
  const endDiff = dutyHoursStart.diff(end, "minutes");

  let outsideDutyMins;
  if (startDiff <= 0) {
    outsideDutyMins = 0;
    return {
      teachingMins: duration,
      outsideDutyMins: outsideDutyMins
    };
  } else if (startDiff > 0 && endDiff > 0) {
    outsideDutyMins = startDiff - endDiff;
    return {
      teachingMins: duration,
      outsideDutyMins: outsideDutyMins
    };
  } else {
    outsideDutyMins = startDiff - endDiff;
    return {
      teachingMins: endDiff,
      outsideDutyMins: outsideDutyMins
    };
  }
};

const addTeachingMins = (events, teachers, setTeachers) => {
  const now = new Date();
  // Create start and end dates for the current month to calc
  // teaching minutes
  const month_start = new Date(now.getFullYear(), now.getMonth(), 1);
  const month_end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  if (teachers.length > 0) {
    // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
    teachers.forEach(teacher => {
      teacher.teachingMins = 0;
      teacher.overThresholdOneMins = 0;
      teacher.overThresholdTwoMins = 0;
    });

    events.forEach(e => {
      if (moment(e.start).isBetween(month_start, month_end, null, "[]")) {
        const idx = teachers.findIndex(
          teacher => teacher.resourceId === e.resourceId
        );
        if (JapaneseHolidays.isHoliday(e.start)) {
          teachers[idx].holidayMins += parseInt(e.duration);
        } else {
          const totalTeachingMins = calcOutsideDutyMins(
            e.start,
            e.end,
            e.duration
          );
          teachers[idx].teachingMins += totalTeachingMins.teachingMins;
          teachers[idx].outsideDutyMins += totalTeachingMins.outsideDutyMins;
        }

        // Update displayed teaching minutes
        setTeachers([...teachers]);
      }
    });
    // Set the time difference from the first to second thresholds
    const secondThreshold = 10 * 60;
    teachers.forEach(teacher => {
      if (teacher.teachingMins >= teacher.otThreshold + secondThreshold) {
        teacher.overThresholdTwoMins +=
          teacher.teachingMins - (teacher.otThreshold + secondThreshold);
        teacher.overThresholdOneMins += secondThreshold;
      } else if (teacher.teachingMins >= teacher.otThreshold) {
        teacher.overThresholdOneMins +=
          teacher.teachingMins - teacher.otThreshold;
      }
      updateTeacher(teacher);
    });
  }
};

const getTeachers = async (events, teachers, setTeachers) => {
  return await axios
    .get(`${API_URI}/teachers/`)
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
    .get(`${API_URI}/lessons/`)
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
      let newEvent;
      if (JapaneseHolidays.isHoliday(r)) {
        newEvent = {
          ...event,
          start: r,
          end: moment(r)
            .add(event.duration, "m")
            .toDate(),
          isHoliday: true
        };
      } else {
        newEvent = {
          ...event,
          start: r,
          end: moment(r)
            .add(event.duration, "m")
            .toDate(),
          isHoliday: false
        };
      }
      newEvents.push(newEvent);
      return newEvents;
    });
  } else {
    if (JapaneseHolidays.isHoliday(event.start)) {
      event = { ...event, isHoliday: true };
    } else {
      event = { ...event, isHoliday: false };
    }
    newEvents.push(event);
  }
  await axios
    .post(`${API_URI}/lessons/add`, newEvents)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  return getLessons(events, setEvents);
};

const addTeacher = async (teachers, newTeacher, setTeachers) => {
  await axios
    .post(`${API_URI}/teachers/add`, newTeacher)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  return setTeachers([...teachers, newTeacher]);
};

const updateTeacher = async teacher => {
  const updatedTeacher = {
    resourceId: teacher.resourceId,
    resourceTitle: teacher.resourceTitle,
    name: teacher.name,
    familyName: teacher.familyName,
    teachingMins: teacher.teachingMins,
    otThreshold: teacher.otThreshold,
    overThresholdOneMins: teacher.overThresholdOneMins,
    overThresholdTwoMins: teacher.overThresholdTwoMins
  };
  return await axios
    .put(`${API_URI}/teachers/update/${teacher._id}`, updatedTeacher)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const deleteTeacher = async teacher => {
  return await axios
    .delete(`${API_URI}/teachers/delete/${teacher._id}`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const deleteEvent = async (events, event, setEvents) => {
  const newEvents = events.filter(evt => evt._id !== event._id);
  setEvents(newEvents);
  return await axios
    .delete(`${API_URI}/lessons/delete/${event._id}`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const changeEvent = async (events, event, editedEvent, setEvents) => {
  const idx = events.findIndex(e => e._id === event._id);
  const nextEvents = [...events];

  nextEvents.splice(idx, 1, editedEvent);
  setEvents(nextEvents);

  return await axios
    .put(`${API_URI}/lessons/update/${event._id}`, editedEvent)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const addPayment = async newPayment => {
  return await axios
    .post(`${API_URI}/payments/add`, newPayment)
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
  addPayment
};
