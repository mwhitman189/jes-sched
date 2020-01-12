import React, { useState } from "react";
import Schedule from "./components/Schedule";
import { TeachersProvider } from "./context/TeachersContext";
import "./App.css";

// const teachers = [
//   { name: "Miles", teachingMins: 75 },
//   { name: "Tim", teachingMins: -40 },
//   { name: "Martin", teachingMins: 120 }
// ];

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
