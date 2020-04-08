import React from "react";
import { TeachersProvider } from "./context/TeachersContext";
import { EventsProvider } from "./context/EventsContext";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Routes from "./routes/routes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <CookiesProvider>
        <UserProvider>
          <EventsProvider>
            <TeachersProvider>
              <Router>
                <Routes />
              </Router>
            </TeachersProvider>
          </EventsProvider>
        </UserProvider>
      </CookiesProvider>
    </div>
  );
}

export default App;
