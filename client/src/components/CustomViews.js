import React from 'react';
import { Navigate } from 'react-big-calendar';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';
import * as dates from 'date-arithmetic';

const WorkWeek = (props) => {
  const { date } = props;
  const range = WorkWeek.range(date);

  return <TimeGrid {...props} range={range} />;
};

WorkWeek.range = (date) => {
  // Set the date object's time to 0:00 so all events for the day will be displayed
  // on the first day of the calendar week regardless of time of day
  date.setHours(0, 0, 0, 0);
  // Set start date to the current work week's Monday
  const gotDate = date.getDate();

  // Check the current date's day as integer from 0(Sun) to 6(Sat)
  switch (date.getDay()) {
    case 0:
      date.setDate(gotDate + 1);
      break;

    case 1:
      date.setDate(gotDate);
      break;

    case 2:
      date.setDate(gotDate - 1);
      break;

    case 3:
      date.setDate(gotDate - 2);
      break;

    case 4:
      date.setDate(gotDate - 3);
      break;

    case 5:
      date.setDate(gotDate - 4);
      break;

    case 6:
      date.setDate(gotDate - 5);
      break;

    default:
      break;
  }

  const start = date;
  const end = dates.add(start, 5, 'day');
  let current = start;
  const range = [];

  while (dates.lte(current, end, 'day')) {
    range.push(current);
    current = dates.add(current, 1, 'day');
  }
  return range;
};

// Set navigation button behavior
WorkWeek.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.subtract(date, 7, 'day');

    case Navigate.NEXT:
      return dates.add(date, 7, 'day');

    case Navigate.TODAY:
      return date;

    default:
      return date;
  }
};

WorkWeek.title = (date) => `${date.toLocaleDateString()}`;

export { WorkWeek };
