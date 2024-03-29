import moment from 'moment';

const JapaneseHolidays = require('japanese-holidays');

const calcDutyHours = (dutyHours, start) => {
  // Check whether the current event is earliest lesson
  if (moment(start) < dutyHours.startTime) {
    dutyHours.startTime = moment(start);

    // Add 9 hours to the DH start time to ensure a minimum of 9 DH
    dutyHours.endTime = moment(dutyHours.startTime).add(9, 'hours');
  }

  return dutyHours;
};

const calcOutsideDutyMins = (
  eventStart,
  eventEnd,
  duration,
  dutyHoursStart,
  dutyHoursEnd,
) => {
  // Calculate difference in hours between the duty hours start time and the lesson start time
  const startDiff = dutyHoursStart.diff(eventStart, 'minutes');
  const endDiff = dutyHoursStart.diff(eventEnd, 'minutes');

  // Calculate difference in hours between the duty hours end time and the lesson end time
  const afterDhEndDiff = -dutyHoursEnd.diff(eventEnd, 'minutes');
  const afterDhStartDiff = -dutyHoursEnd.diff(eventStart, 'minutes');

  let outsideDutyMins;
  if (startDiff <= 0 && afterDhEndDiff <= 0) {
    outsideDutyMins = 0;
    return {
      teachingMins: duration,
      outsideDutyMins,
    };
  } if (
    (startDiff > 0 && endDiff > 0)
    || (afterDhEndDiff > 0 && afterDhStartDiff > 0)
  ) {
    return {
      teachingMins: 0,
      outsideDutyMins: duration,
    };
  } if (startDiff > 0) {
    const regularTeachingMins = duration - startDiff;
    return {
      teachingMins: regularTeachingMins,
      outsideDutyMins: startDiff,
    };
  }
  const regularTeachingMins = duration - afterDhEndDiff;
  return {
    teachingMins: regularTeachingMins,
    outsideDutyMins: afterDhEndDiff,
  };
};

const createPayPeriodData = (events, teacher, monthStart, monthEnd) => {
  // Creates an object of dates containing minutes worked, by work type
  const datesData = {};
  teacher.teachingMins = 0;
  teacher.outsideDutyMins = 0;
  teacher.holidayMins = 0;
  teacher.overThresholdOneMins = 0;
  teacher.overThresholdTwoMins = 0;

  const monthEvents = events.filter((e) => (
    moment(e.start).isBetween(monthStart, monthEnd, null, '[]')
      && e.resourceId === teacher.resourceId
  ));

  const dutyHoursByDate = {};

  monthEvents.forEach((e) => {
    const date = e.start.getDate();
    // Set the base duty hours to noon to ensure at least 9 duty hours
    if (!dutyHoursByDate[date]) {
      const baseDutyHours = {
        startTime: moment(e.start).set('hour', 12).set('minutes', 0),
        endTime: moment(e.start).set('hour', 21).set('minutes', 0),
      };
      // Set the duty hours for the event's date
      dutyHoursByDate[date] = calcDutyHours(baseDutyHours, e.start, e.end);
    } else {
      // Set the duty hours for the event's date
      dutyHoursByDate[date] = calcDutyHours(
        dutyHoursByDate[date],
        e.start,
        e.end,
      );
    }
  });

  monthEvents.forEach((e) => {
    if (e.isLesson) {
      if (e.sameDayCancellation || !e.isCancelled) {
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
            JapaneseHolidays.isHoliday(e.start)
            || e.start.getDay() === (0 || 1)
          ) {
            holidayMins = e.duration;
            teacher.holidayMins += holidayMins;
          } else {
            const totalTeachingMins = calcOutsideDutyMins(
              e.start,
              e.end,
              e.duration,
              dutyHoursByDate[date].startTime,
              dutyHoursByDate[date].endTime,
            );

            // Add total teaching minutes and outside duty minutes to teacher object
            teachingMins = totalTeachingMins.teachingMins;
            teacher.teachingMins += teachingMins;
            outsideDutyMins = totalTeachingMins.outsideDutyMins;
            teacher.outsideDutyMins += outsideDutyMins;

            // Calculate hours worked over monthly thresholds two and one
            const otThOneTotalMins = teacher.otThreshold;
            const otThTwoTotalMins = otThOneTotalMins + secondThreshold;
            if (teacher.teachingMins > otThTwoTotalMins) {
              teacher.overThresholdTwoMins += e.duration;
            } else if (teacher.teachingMins > otThOneTotalMins) {
              if (otThOneTotalMins + e.duration > otThTwoTotalMins) {
                teacher.overThresholdTwoMins
                  += otThOneTotalMins + e.duration - otThTwoTotalMins;
                teacher.overThresholdOneMins = otThOneTotalMins;
              } else {
                teacher.overThresholdOneMins += e.duration;
              }
            } else if (teacher.teachingMins + e.duration > otThOneTotalMins) {
              teacher.overThresholdOneMins
                += teacher.teachingMins + e.duration - otThOneTotalMins;
            }
          }

          // Teaching minutes object to be added to hash table
          const dateData = {
            resourceId: teacher.resourceId,
            date,
            day,
            teachingMins,
            outsideDutyMins,
            holidayMins,
            travelAllowance: 0,
            travelExpenses: 0,
          };

          // If date already in hash table, add teaching minutes to existing keys, otherwise create
          // a new date object
          if (datesData[date]) {
            datesData[date].teachingMins += dateData.teachingMins;
            datesData[date].outsideDutyMins += dateData.outsideDutyMins;
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
  datesData.overThresholdOneMins = teacher.overThresholdOneMins;
  datesData.overThresholdTwoMins = teacher.overThresholdTwoMins;

  return datesData;
};

export { createPayPeriodData };
