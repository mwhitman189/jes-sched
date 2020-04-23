import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { TeachersProvider } from "./context/TeachersContext";
import { ErrorsProvider } from "./context/ErrorsContext";
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
            <ErrorsProvider>
              <Router>
                <Routes />
              </Router>
            </ErrorsProvider>
          </TeachersProvider>
        </EventsProvider>
      </UserProvider>
    </div>
  );
}

export default App;
