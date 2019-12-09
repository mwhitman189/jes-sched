import moment from "moment";

function validateRoom(events, room, startTime, duration) {
  return events.every(event => {
    if (
      testDateOverlap(
        [event.start, event.end],
        [
          moment(new Date(startTime)),
          moment(
            moment(new Date(startTime))
              .add(duration, "m")
              .toDate()
          )
        ]
      )
    ) {
      return parseInt(event.room) !== parseInt(room);
    }
    return true;
  });
}

function validateTeacher(events, teacher, startTime, duration) {
  return events.every(event => {
    if (
      testDateOverlap(
        [event.start, event.end],
        [
          moment(new Date(startTime)),
          moment(
            moment(new Date(startTime))
              .add(duration, "m")
              .toDate()
          )
        ]
      )
    ) {
      return parseInt(event.resourceId) !== parseInt(teacher);
    }
    return true;
  });
}

function testDateOverlap(dateArr, testDateArr) {
  if (
    testDateArr[0].isBetween(dateArr[0], dateArr[1]) ||
    testDateArr[1].isBetween(dateArr[0], dateArr[1])
  ) {
    return true;
  }
}

export { validateRoom, validateTeacher };
