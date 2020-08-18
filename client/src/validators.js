import moment from "moment";

function validateRoom(events, event) {
  for (let otherEvent of events) {
    if (otherEvent._id !== event._id && event.room !== 0) {
      if (
        testDateOverlap(
          [moment(otherEvent.start), moment(otherEvent.end)],
          [
            moment(event.start),
            moment(moment(event.start).add(event.duration, "m").toDate()),
          ]
        )
      ) {
        return parseInt(otherEvent.room) !== parseInt(event.room);
      }
    }
  }
  return true;
}

function validateTeacher(events, event) {
  for (let otherEvent of events) {
    if (otherEvent._id !== event._id) {
      if (
        testDateOverlap(
          [moment(otherEvent.start), moment(otherEvent.end)],
          [
            moment(event.start),
            moment(moment(event.start).add(event.duration, "m").toDate()),
          ]
        )
      ) {
        return parseInt(otherEvent.resourceId) !== parseInt(event.resourceId);
      }
    }
  }
  return true;
}

function testDateOverlap(dateArr, testDateArr) {
  if (
    testDateArr[0].isBetween(dateArr[0], dateArr[1], null, "[]") ||
    testDateArr[1].isBetween(dateArr[0], dateArr[1], null, "[]") ||
    dateArr[0].isBetween(testDateArr[0], testDateArr[1], null, "[]") ||
    dateArr[1].isBetween(testDateArr[0], testDateArr[1], null, "[]")
  ) {
    return true;
  }
}

export { validateRoom, validateTeacher };
