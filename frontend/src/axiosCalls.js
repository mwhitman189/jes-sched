import axios from "axios";

const API_URI = "http://localhost:5000";

const getTeachers = async setTeachers => {
  await axios
    .get(`${API_URI}/teachers/`)
    .then(res => {
      if (res.data.length > 0) {
        console.log(res.data);
        setTeachers(res.data);
      }
    })
    .catch(err => console.log(err));
};

const getLessons = async setEvents => {
  await axios
    .get(`${API_URI}/lessons/`)
    .then(res => {
      if (res.data.length > 0) {
        res.data.map(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
        setEvents(res.data);
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
    .put(
      `${API_URI}/teachers/update/${teacher._id}`,
      {
        name: teacher.name,
        teachingMins: teacher.teachingMins
      },
      { headers: { "Content-Type": "application/json" } }
    )
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
};

export { getTeachers, getLessons, addLesson, addTeacher, updateTeacher };
