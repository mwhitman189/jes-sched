import { useState } from "react";
import axios from "axios";
import { addTeachingMins } from "../helperFunctions";

export default initialTeachers => {
  const [teachers, setTeachers] = useState(initialTeachers);

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
        .then(addTeachingMins(events))
        .catch(err => console.log(err));
    },
    addTeacher: async newTeacher => {
      await axios
        .post("/teachers/add", newTeacher)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
      return setTeachers([...teachers, newTeacher]);
    },
    updateTeacher: async teacher => {
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
    },
    deleteTeacher: async teacher => {
      return await axios
        .delete(`/teachers/delete/${teacher._id}`)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    }
  };
};
