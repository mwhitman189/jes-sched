import React, { useState } from "react";
import Schedule from "./components/Schedule";
import { TeachersProvider } from "./context/TeachersContext";
import "./App.css";

function App() {
  const [teachers, setTeachers] = useState([]);
  return (
    <div className="App">
      <TeachersProvider value={{ teachers, setTeachers }}>
        <Schedule />
      </TeachersProvider>
    </div>
  );
}

export default App;
