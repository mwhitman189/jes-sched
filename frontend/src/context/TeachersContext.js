import React, { useState, createContext } from "react";

const TeachersContext = createContext({});

export const TeachersProvider = TeachersContext.Provider;
export const TeachersConsumer = TeachersContext.Consumer;
export default TeachersContext;
