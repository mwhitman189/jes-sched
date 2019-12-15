import axios from "axios";

const API_URI = "http://localhost:5000";

const updateTeacher = async teacher => {
  try {
    const res = await axios.put(
      `${API_URI}/teachers/update/${teacher._id}`,
      {
        name: teacher.name,
        teachingMins: teacher.teachingMins
      },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

const getTeachers = async setTeachers => {
  try {
    const res = await axios.get(`${API_URI}/teachers/`).then(res => {
      if (res.data.length > 0) {
        console.log(res.data);
        setTeachers(res.data);
      }
    });
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

export { updateTeacher, getTeachers };
