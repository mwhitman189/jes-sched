import moment from "moment";

function validateRoom(events, event) {
  const otherEvents = [...events.filter((e) => e._id !== event._id)];

  otherEvents.forEach((otherEvent) => {
    if (
      testDateOverlap(
        [otherEvent.start, otherEvent.end],
        [
          moment(new Date(event.start)),
          moment(
            moment(new Date(event.start)).add(event.duration, "m").toDate()
          ),
        ]
      )
    ) {
      return parseInt(otherEvent.room) !== parseInt(event.room);
    }
  });
  return true;
}

function validateTeacher(events, event) {
  const otherEvents = [...events.filter((e) => e._id !== event._id)];

  otherEvents.forEach((otherEvent) => {
    if (
      testDateOverlap(
        [otherEvent.start, otherEvent.end],
        [
          moment(new Date(event.start)),
          moment(
            moment(new Date(event.start))
              .add(parseInt(event.duration), "m")
              .toDate()
          ),
        ]
      )
    ) {
      return parseInt(otherEvent.resourceId) !== parseInt(event.resourceId);
    }
  });
  return true;
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
