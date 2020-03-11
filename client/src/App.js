import React, { useReducer } from "react";
import Schedule from "./components/Schedule";
import { TeachersProvider } from "./context/TeachersContext";
import { EventsProvider } from "./context/EventsContext";
import errorReducer from "./reducers/errorReducer";
import authReducer from "./reducers/authReducer";
import "./App.css";

function App() {
  const [state, dispatch] = useReducer(authReducer);
  console.log(dispatch);

  return (
    <div className="App">
      <EventsProvider>
        <TeachersProvider>
          <Schedule />
        </TeachersProvider>
      </EventsProvider>
    </div>
  );
}

export default App;
