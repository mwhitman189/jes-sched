import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TeachersProvider } from './context/TeachersContext';
import { StudentsProvider } from './context/StudentsContext';
import { ErrorsProvider } from './context/ErrorsContext';
import { EventsProvider } from './context/EventsContext';
import { UserProvider } from './context/UserContext';
import Routes from './routes/routes';
import './App.css';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <EventsProvider>
          <TeachersProvider>
            <StudentsProvider>
              <ErrorsProvider>
                <Router>
                  <Routes />
                </Router>
              </ErrorsProvider>
            </StudentsProvider>
          </TeachersProvider>
        </EventsProvider>
      </UserProvider>
    </div>
  );
}

export default App;
