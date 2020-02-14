import React, { createContext } from "react";
import useTeachersState from "../hooks/useTeachersState";

const defaultTeachers = [];

export const TeachersContext = createContext();

export function TeachersProvider(props) {
  const teachers = useTeachersState(defaultTeachers);

  return (
    <TeachersContext.Provider value={teachers}>
      {props.children}
    </TeachersContext.Provider>
  );
}
