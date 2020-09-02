import React, { useReducer, createContext } from 'react';
import authReducer from '../reducers/authReducer';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
};

export const UserContext = createContext();

export function UserProvider(props) {
  const [user, dispatch] = useReducer(authReducer, initialState);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
}
