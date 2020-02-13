import React, { useState, createContext } from "react";

export const TeachersContext = createContext({});

export function TeachersProvider(props) {
  const [teachers, setTeachers] = useState([]);
  return (
    <TeachersContext.Provider value={{ teachers, setTeachers }}>
      {props.children}
    </TeachersContext.Provider>
  );
}
