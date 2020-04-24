import React, { useReducer, createContext } from "react";
import errorsReducer from "../reducers/errorsReducer";

const initialState = {
  msg: null,
  status: null,
  id: null,
};

export const ErrorsContext = createContext();

export function ErrorsProvider(props) {
  const [errors, errorsDispatch] = useReducer(errorsReducer, initialState);

  return (
    <ErrorsContext.Provider value={{ errors, errorsDispatch }}>
      {props.children}
    </ErrorsContext.Provider>
  );
}
