import React, { createContext } from 'react';
import useTeachersState from '../hooks/useTeachersState';

const defaultTeachers = [
  {
    resourceId: 1,
    resourceTitle: 'defaultTeacher',
    name: 'DefaultTeacher',
    familyName: 'DefaultTeacherLN',
    email: 'default@default.com',
    otThreshold: 0,
    teachingHours: 0,
    outsideDutyMins: 0,
    holidayMins: 0,
    travelAllowance: 0,
    travelExpenses: 0,
    overThresholdOneMins: 0,
    overThresholdTwoMins: 0,
    contractType: 'IA',
    dependentsNum: 0,
    isPartTime: false,
  },
];

export const TeachersContext = createContext();

export function TeachersProvider(props) {
  const teachers = useTeachersState(defaultTeachers);

  return (
    <TeachersContext.Provider value={teachers}>
      {props.children}
    </TeachersContext.Provider>
  );
}
