import { useState } from "react";
import axios from "axios";
import { createPayPeriodData } from "../helperFunctions";

export default initialTeachers => {
  const [teachers, setTeachers] = useState(initialTeachers);

  const updateTeacher = async teacher => {
    const idx = teachers.findIndex(t => t._id === teacher._id);
    const updatedTeachers = [...teachers];

    const updatedTeacher = {
      ...teacher,
      resourceTitle: teacher.resourceTitle,
      name: teacher.name,
      familyName: teacher.familyName,
      teachingMins: teacher.teachingMins,
      holidayMins: teacher.holidayMins,
      outsideDutyMins: teacher.outsideDutyMins,
      otThreshold: teacher.otThreshold,
      overThresholdOneMins: teacher.overThresholdOneMins,
      overThresholdTwoMins: teacher.overThresholdTwoMins
    };
    updatedTeachers.splice(idx, 1, updatedTeacher);

    setTeachers(updatedTeachers);
    return await axios
      .put(`/teachers/update/${teacher._id}`, updatedTeacher)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  };

  return {
    teachers,
    getTeachers: async events => {
      return await axios
        .get("/teachers/")
        .then(res => {
          if (res.data.length > 0) {
            setTeachers(res.data);
          }
        })
        .catch(err => console.log(err));
    },
    addTeacher: async newTeacher => {
      await axios
        .post("/teachers/add", newTeacher)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
      return setTeachers([...teachers, newTeacher]);
    },
    deleteTeacher: async teacher => {
      return await axios
        .delete(`/teachers/delete/${teacher._id}`)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    },
    addTeachingMins: events => {
      const now = new Date();
      // Create start and end dates for the current month to calc
      // teaching minutes
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      if (teachers.length > 0) {
        // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
        teachers.forEach(teacher => {
          teacher.teachingMins = 0;
          teacher.outsideDutyMins = 0;
          teacher.holidayMins = 0;
          teacher.overThresholdOneMins = 0;
          teacher.overThresholdTwoMins = 0;
        });
        console.log("Hello");

        teachers.forEach(teacher => {
          createPayPeriodData(events, teacher, monthStart, monthEnd);
          updateTeacher(teacher);
        });
      }
    }
  };
};
