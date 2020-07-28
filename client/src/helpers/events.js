import { RRule } from "rrule";
import moment from "moment";

const JapaneseHolidays = require("japanese-holidays");

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
  // Remove redundant event
  twoMonthsRecurrences.shift();
  return twoMonthsRecurrences;
};

const updateRecurrences = (event) => {
  const now = new Date();
  const month_start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const month_end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  // Create an array of DateTimes for the recurrence of events.
  const rrule = new RRule({
    freq: RRule.WEEKLY,
    count: 26,
    interval: 1,
    dtstart: new Date(event.start),
  });
  const oneMonthsRecurrences = rrule.between(month_start, month_end);
  return oneMonthsRecurrences;
};

const createNewEvents = (event, isNew) => {
  let newEvents = [];
  let origEvent = event;
  if (event.isRecurring === true) {
    let recurrences;
    if (isNew === true) {
      recurrences = getRecurrences(event);
    } else {
      recurrences = updateRecurrences(event);
    }
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
      newEvents = [...newEvents, newEvent];
    });
    newEvents[newEvents.length - 1].isLast = true;
  }
  if (JapaneseHolidays.isHoliday(origEvent.start)) {
    origEvent = { ...origEvent, isHoliday: true };
  }
  origEvent = { ...origEvent, isNewEvent: true };
  newEvents = [...newEvents, origEvent];

  return newEvents;
};

export { getRecurrences, updateRecurrences, createNewEvents };
