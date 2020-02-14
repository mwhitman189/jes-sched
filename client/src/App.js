import React from "react";
import Schedule from "./components/Schedule";
import { TeachersProvider } from "./context/TeachersContext";
import { EventsProvider } from "./context/EventsContext";
import "./App.css";

function App() {
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
