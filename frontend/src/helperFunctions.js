import axios from "axios";
import moment from "moment";

const API_URI = "http://localhost:5000";

const addTeachingMins = (events, teachers, setTeachers) => {
  if (teachers.length > 0) {
    // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
    teachers.forEach(teacher => {
      teacher.teachingMins = 0;
      teacher.resourceTitle = `${teacher.name} ${teacher.teachingMins}`;
    });
    if (events.length > 0) {
      events.forEach(e => {
        const idx = teachers.findIndex(
          teacher => teacher.resourceId === e.resourceId
        );
        teachers[idx].teachingMins += parseInt(e.duration);
        setTeachers([...teachers]);
        teachers[
          idx
        ].resourceTitle = `${teachers[idx].name} ${teachers[idx].teachingMins}`;
      });

      teachers.forEach(teacher => {
        updateTeacher(teacher);
      });
    }
  }
};

const getTeachers = async setTeachers => {
  await axios
    .get(`${API_URI}/teachers/`)
    .then(res => {
      if (res.data.length > 0) {
        setTeachers(res.data);
      }
    })
    .catch(err => console.log(err));
};

const getLessons = async (events, setEvents) => {
  await axios
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

const addLesson = async (events, newEvent, setEvents) => {
  await axios
    .post(`${API_URI}/lessons/add`, newEvent)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  setEvents([...events, newEvent]);
};

const addTeacher = async (teachers, newTeacher, setTeachers) => {
  await axios
    .post(`${API_URI}/teachers/add`, newTeacher)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  setTeachers([...teachers, newTeacher]);
};

const updateTeacher = async teacher => {
  await axios
    .put(`${API_URI}/teachers/update/${teacher._id}`, {
      resourceId: teacher.resourceId,
      resourceTitle: teacher.resourceTitle,
      name: teacher.name,
      familyName: teacher.familyName,
      teachingMins: teacher.teachingMins
    })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const changeEvent = async (events, event, setEvents) => {
  const editedEvent = {
    _id: event._id,
    groupId: 3,
    title: event.title,
    start: event.start,
    end: moment(event.startTimeObj)
      .add(event.duration, "m")
      .toDate(),
    room: event.room,
    duration: event.duration,
    resourceId: parseInt(event.resourceId),
    type: event.eventType
  };
  console.log(editedEvent);
  const idx = events.indexOf(event);
  console.log(idx);
  const nextEvents = [...events];

  nextEvents.splice(idx, 1, editedEvent);
  setEvents(nextEvents);

  await axios
    .put(`${API_URI}/lessons/update/${event._id}`, editedEvent)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

export {
  addTeachingMins,
  getTeachers,
  getLessons,
  addLesson,
  addTeacher,
  updateTeacher,
  changeEvent
};
