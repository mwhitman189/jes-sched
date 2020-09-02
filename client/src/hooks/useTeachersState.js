import { useState, useContext } from 'react';
import axios from 'axios';
import { createPayPeriodData } from '../helpers/payroll';
import { tokenConfig } from '../reducers/loadUserReducer';
import { UserContext } from '../context/UserContext';
import { editDbTeacher, getDbTeachers } from '../dbCalls';

export default (initialTeachers) => {
  const { user } = useContext(UserContext);
  const [teachers, setTeachers] = useState(initialTeachers);

  const updateTeacher = (teacher) => {
    const updatedTeacher = {
      ...teacher,
      resourceTitle: teacher.resourceTitle,
      givenName: teacher.givenName,
      familyName: teacher.familyName,
      email: teacher.email,
      teachingMins: teacher.teachingMins,
      holidayMins: teacher.holidayMins,
      outsideDutyMins: teacher.outsideDutyMins,
      otThreshold: teacher.otThreshold,
      overThresholdOneMins: teacher.overThresholdOneMins,
      overThresholdTwoMins: teacher.overThresholdTwoMins,
      minsByDate: teacher.minsByDate,
    };

    editDbTeacher(updatedTeacher, user);
    return updatedTeacher;
  };

  return {
    teachers,
    setTeachers,
    getTeachers: () => {
      getDbTeachers(setTeachers, user);
    },
    addTeacher: async (newTeacher) => {
      await axios
        .post('/api/teachers/add', newTeacher, tokenConfig(user))
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
    addTeachingMins: (events, monthStart, monthEnd) => {
      if (teachers.length > 0) {
        const updatedTeachers = [...teachers];
        let updatedTeacher;
        let idx;
        teachers.forEach((teacher) => {
          idx = teachers.findIndex((t) => t._id === teacher._id);
          const datesData = createPayPeriodData(
            events,
            teacher,
            monthStart,
            monthEnd,
          );
          for (let i = 1; i < 32; i++) {
            if (JSON.stringify(teacher.minsByDate)) {
              teacher.minsByDate[i] = datesData[i]
                ? datesData[i].teachingMins
                : 0;
            }
          }
          updatedTeacher = updateTeacher(teacher);
          updatedTeachers[idx] = updatedTeacher;
        });

        setTeachers(updatedTeachers);
      }
    },
  };
};
