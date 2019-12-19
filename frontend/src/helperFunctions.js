import axios from "axios";
import { RRule } from "rrule";
import moment from "moment";

const API_URI = "http://localhost:5000";

const getRecurrences = event => {
  const now = new Date();
  // Create start and end dates for the current month to calc
  // teaching minutes
  const month_start = new Date(now.getFullYear(), now.getMonth(), 1);
  const month_end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // Create an array of DateTimes for the recurrence of events.
  const rrule = new RRule({
    freq: RRule.WEEKLY,
    count: 5,
    interval: 1,
    dtstart: new Date(event.start)
  });
  const monthRecurrences = rrule.between(month_start, month_end);
  return [rrule, monthRecurrences];
};

const addTeachingMins = (events, teachers, setTeachers) => {
  if (teachers.length > 0) {
    // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
    teachers.forEach(teacher => {
      teacher.teachingMins = 0;
      teacher.resourceTitle = `${teacher.name} ${teacher.teachingMins}`;
    });

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
};

const getTeachers = async (events, teachers, setTeachers) => {
  return await axios
    .get(`${API_URI}/teachers/`)
    .then(res => {
      if (res.data.length > 0) {
        setTeachers(res.data);
      }
    })
    .then(addTeachingMins(events, teachers, setTeachers))
    .catch(err => console.log(err));
};

const getLessons = async (events, setEvents) => {
  return await axios
    .get(`${API_URI}/lessons/`)
    .then(res => {
      if (res.data.length > 0) {
        res.data.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          console.log(event);
          // Add all of the recurrences for an event if recurrences is set to true
          if (event.recur === true) {
            const recurrences = getRecurrences(event)[1];
            recurrences.map(r => {
              const newEvent = {
                ...event,
                start: r,
                end: moment(r)
                  .add(event.duration, "m")
                  .toDate()
              };
              res.data.push(newEvent);
            });
            // The second item in the array contains all recurrences
          }
        });
        console.log(res.data);
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
  return setEvents([...events, newEvent]);
};

const addTeacher = async (teachers, newTeacher, setTeachers) => {
  await axios
    .post(`${API_URI}/teachers/add`, newTeacher)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
  return setTeachers([...teachers, newTeacher]);
};

const updateTeacher = async teacher => {
  const updatedTeacher = {
    resourceId: teacher.resourceId,
    resourceTitle: teacher.resourceTitle,
    name: teacher.name,
    familyName: teacher.familyName,
    teachingMins: teacher.teachingMins
  };
  return await axios
    .put(`${API_URI}/teachers/update/${teacher._id}`, updatedTeacher)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const deleteTeacher = async teacher => {
  return await axios
    .delete(`${API_URI}/teachers/delete/${teacher._id}`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const deleteEvent = async (events, event, setEvents) => {
  const newEvents = events.filter(evt => evt._id !== event._id);
  setEvents(newEvents);
  return await axios
    .delete(`${API_URI}/lessons/delete/${event._id}`)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

const changeEvent = async (events, event, editedEvent, setEvents) => {
  const idx = events.findIndex(e => e._id === event._id);
  const nextEvents = [...events];

  nextEvents.splice(idx, 1, editedEvent);
  setEvents(nextEvents);

  return await axios
    .put(`${API_URI}/lessons/update/${event._id}`, editedEvent)
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

export {
  getRecurrences,
  addTeachingMins,
  getTeachers,
  getLessons,
  addLesson,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  deleteEvent,
  changeEvent
};