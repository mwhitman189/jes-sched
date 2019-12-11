import moment from "moment";

function validateRoom(events, room, start, duration) {
  return events.every(event => {
    if (
      testDateOverlap(
        [event.start, event.end],
        [
          moment(new Date(start)),
          moment(
            moment(new Date(start))
              .add(duration, "m")
              .toDate()
          )
        ]
      )
    ) {
      console.log(parseInt(event.room), room);
      return parseInt(event.room) !== parseInt(room);
    }
    return true;
  });
}

function validateTeacher(events, teacher, start, duration) {
  return events.every(event => {
    if (
      testDateOverlap(
        [event.start, event.end],
        [
          moment(new Date(start)),
          moment(
            moment(new Date(start))
              .add(duration, "m")
              .toDate()
          )
        ]
      )
    ) {
      console.log(parseInt(event.resourceId), teacher);
      return parseInt(event.resourceId) !== parseInt(teacher);
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
