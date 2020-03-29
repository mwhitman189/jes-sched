import React, { useReducer, useState } from "react";
import { TeachersProvider } from "./context/TeachersContext";
import { EventsProvider } from "./context/EventsContext";
import errorReducer from "./reducers/errorReducer";
import authReducer from "./reducers/authReducer";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/routes";
import AuthAPI from "./utils/AuthAPI";
import "./App.css";

function App() {
  const [state, dispatch] = useReducer(authReducer);
  console.log(dispatch);
  const [auth, setAuth] = useState(false);

  return (
    <div className="App">
      <AuthAPI.Provider value={{ auth, setAuth }}>
        <EventsProvider>
          <TeachersProvider>
            <Router>
              <Routes />
            </Router>
          </TeachersProvider>
        </EventsProvider>
      </AuthAPI.Provider>
    </div>
  );
}

export default App;
