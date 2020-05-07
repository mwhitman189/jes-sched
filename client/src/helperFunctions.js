import axios from "axios";
import { RRule } from "rrule";
import moment from "moment";

const JapaneseHolidays = require("japanese-holidays");
// TODO: Edit months_start and months_end to accomodate renewal of recurrences.
const getRecurrences = (event) => {
  const now = new Date();
  // Create start and end dates for the current month to calc
  // teaching minutes
  const months_start = new Date(now.getFullYear(), now.getMonth(), 1);
  const months_end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  // Create an array of DateTimes for the recurrence of events.
  const rrule = new RRule({
    freq: RRule.WEEKLY,
    count: 26,
    interval: 1,
    dtstart: new Date(event.start),
  });
  const twoMonthsRecurrences = rrule.between(months_start, months_end);
  twoMonthsRecurrences.shift();
  return twoMonthsRecurrences;
};

const calcDutyHours = (dutyHours, start) => {
  // Check whether the current event is earliest lesson
  if (moment(start) < dutyHours.startTime) {
    dutyHours.startTime = moment(start);

    // Add 9 hours to the DH start time to ensure a minimum of 9 DH
    dutyHours.endTime = moment(dutyHours.startTime).add(9, "hours");
  }

  return dutyHours;
};

// Check whether a cancellation took place on the same day of the class
const checkForSameDate = (eventStart) => {
  const todaysDate = new Date();
  return eventStart.getDate() === todaysDate.getDate();
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
      outsideDutyMins: outsideDutyMins,
    };
  } else if (
    (startDiff > 0 && endDiff > 0) ||
    (afterDhEndDiff > 0 && afterDhStartDiff > 0)
  ) {
    return {
      teachingMins: 0,
      outsideDutyMins: duration,
    };
  } else if (startDiff > 0) {
    const regularTeachingMins = duration - startDiff;
    return {
      teachingMins: regularTeachingMins,
      outsideDutyMins: startDiff,
    };
  } else {
    const regularTeachingMins = duration - afterDhEndDiff;
    return {
      teachingMins: regularTeachingMins,
      outsideDutyMins: afterDhEndDiff,
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

  const monthEvents = events.filter((e) => {
    return (
      moment(e.start).isBetween(monthStart, monthEnd, null, "[]") &&
      e.resourceId === teacher.resourceId
    );
  });

  const dutyHoursByDate = {};

  monthEvents.forEach((e) => {
    const date = e.start.getDate();
    // Set the base duty hours to noon to ensure at least 9 duty hours
    if (!dutyHoursByDate[date]) {
      const baseDutyHours = {
        startTime: moment(e.start).set("hour", 12).set("minutes", 0),
        endTime: moment(e.start).set("hour", 21).set("minutes", 0),
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

  monthEvents.forEach((e) => {
    if (e.sameDayCancellation || !e.cancelled) {
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
            holidayMins = e.duration;
            teacher.holidayMins += holidayMins;
          } else {
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
            travelExpenses: 0,
          };
          // If date already in hash table, add teaching minutes to existing keys, otherwise create
          // a new date object
          if (datesData[date]) {
            datesData[date].teachingMins += dateData.teachingMins;
            datesData[date].outsideDutyMins += dateData.outsideDutyMins;
            datesData[date].overThresholdOneMins +=
              dateData.overThresholdOneMins;
            datesData[date].overThresholdTwoMins +=
              dateData.overThresholdTwoMins;
            datesData[date].holidayMins += dateData.holidayMins;
            datesData[date].travelAllowance += dateData.travelAllowance;
            datesData[date].travelExpenses += dateData.travelExpenses;
          } else {
            datesData[date] = dateData;
          }
        }
      }
    }
  });
  return datesData;
};

const addNewEvent = (event) => {
  const newEvents = [];
  if (event.recur === true) {
    const recurrences = getRecurrences(event);
    recurrences.map((r) => {
      const newEvent = {
        ...event,
        start: r,
        end: moment(r).add(event.duration, "m").toDate(),
        isNewEvent: false,
        isLast: false,
      };
      if (JapaneseHolidays.isHoliday(r)) {
        newEvent.isHoliday = true;
      }
      newEvents.push(newEvent);
    });
    newEvents[newEvents.length - 1].isLast = true;
  }
  if (JapaneseHolidays.isHoliday(event.start)) {
    event = { ...event, isHoliday: true };
  }
  event = { ...event, isNewEvent: true };
  newEvents.unshift(event);

  return newEvents;
};

const addPayment = async (newPayment) => {
  return await axios
    .post(`/payments/add`, newPayment)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

const protectAction = (user, action) => {
  if (user.user.role === "staff") {
    return action;
  }
  return console.log("Not gonna do it. Wouldn't be prudent.");
};

export {
  getRecurrences,
  addNewEvent,
  addPayment,
  createPayPeriodData,
  protectAction,
  checkForSameDate,
};
