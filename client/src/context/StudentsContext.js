import React, { createContext } from "react";
import useStudentsState from "../hooks/useStudentsState";

const defaultStudents = [
  {
    _id: 1,
    givenName: "DefaultStudent",
    familyName: "DefaultStudentLN",
    phone: "080-0101-0101",
    email: "default@default.com",
  },
  {
    _id: 2,
    givenName: "DefaultStudent2",
    familyName: "DefaultStudentLN2",
    phone: "080-0101-0102",
    email: "default2@default.com",
  },
];

export const StudentsContext = createContext();

export function StudentsProvider(props) {
  const students = useStudentsState(defaultStudents);

  return (
    <StudentsContext.Provider value={students}>
      {props.children}
    </StudentsContext.Provider>
  );
}
