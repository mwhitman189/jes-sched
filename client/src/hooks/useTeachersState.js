import { useState, useContext } from "react";
import axios from "axios";
import { createPayPeriodData } from "../helperFunctions";
import { tokenConfig } from "../reducers/loadUserReducer";
import { UserContext } from "../context/UserContext";

export default (initialTeachers) => {
  const { user } = useContext(UserContext);
  const [teachers, setTeachers] = useState(initialTeachers);

  const updateTeacher = async (teacher) => {
    const idx = teachers.findIndex((t) => t._id === teacher._id);
    const updatedTeachers = [...teachers];

    const updatedTeacher = {
      ...teacher,
      resourceTitle: teacher.resourceTitle,
      name: teacher.name,
      familyName: teacher.familyName,
      email: teacher.email,
      teachingMins: teacher.teachingMins,
      holidayMins: teacher.holidayMins,
      outsideDutyMins: teacher.outsideDutyMins,
      otThreshold: teacher.otThreshold,
      overThresholdOneMins: teacher.overThresholdOneMins,
      overThresholdTwoMins: teacher.overThresholdTwoMins,
    };
    updatedTeachers.splice(idx, 1, updatedTeacher);

    setTeachers(updatedTeachers);
    await axios
      .put(
        `/api/teachers/update/${teacher._id}`,
        updatedTeacher,
        tokenConfig(user)
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  return {
    teachers,
    getTeachers: async () => {
      await axios
        .get("/api/teachers", tokenConfig(user))
        .then((res) => {
          if (res.data.length > 0) {
            setTeachers(res.data);
          }
        })
        .catch((err) => console.log(err));
    },
    addTeacher: async (newTeacher) => {
      await axios
        .post("/api/teachers/add", newTeacher, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      return setTeachers([...teachers, newTeacher]);
    },
    deleteTeacher: async (teacher) => {
      await axios
        .delete(`/api/teachers/delete/${teacher._id}`, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      return setTeachers(teachers.filter((t) => t._id !== teacher._id));
    },
    addTeachingMins: (events, now) => {
      // Create start and end dates for the current month to calc
      // teaching minutes
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      if (teachers.length > 0) {
        // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor

        teachers.forEach((teacher) => {
          createPayPeriodData(events, teacher, monthStart, monthEnd);
          updateTeacher(teacher);
        });
      }
    },
  };
};
