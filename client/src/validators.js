import moment from "moment";

function validateRoom(events, room, start, duration) {
  return events.every((event) => {
    if (
      testDateOverlap(
        [event.start, event.end],
        [
          moment(new Date(start)),
          moment(moment(new Date(start)).add(duration, "m").toDate()),
        ]
      )
    ) {
      return parseInt(event.room) !== parseInt(room);
    }
    return true;
  });
}

function validateTeacher(
  otherEvents,
  eventResourceId,
  eventStart,
  eventDuration
) {
  return otherEvents.every((otherEvent) => {
    if (
      testDateOverlap(
        [otherEvent.start, otherEvent.end],
        [
          moment(new Date(eventStart)),
          moment(moment(new Date(eventStart)).add(eventDuration, "m").toDate()),
        ]
      )
    ) {
      return parseInt(otherEvent.resourceId) !== parseInt(eventResourceId);
    }
    return true;
  });
}

function testDateOverlap(dateArr, testDateArr) {
  if (
    testDateArr[0].isBetween(dateArr[0], dateArr[1], null, "[]") ||
    testDateArr[1].isBetween(dateArr[0], dateArr[1], null, "[]")
  ) {
    return true;
  }
}

export { validateRoom, validateTeacher };
