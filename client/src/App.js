import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { TeachersProvider } from "./context/TeachersContext";
import { EventsProvider } from "./context/EventsContext";
import { UserProvider } from "./context/UserContext";
import Routes from "./routes/routes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <EventsProvider>
          <TeachersProvider>
            <Router>
              <Routes />
            </Router>
          </TeachersProvider>
        </EventsProvider>
      </UserProvider>
    </div>
  );
}

export default App;
