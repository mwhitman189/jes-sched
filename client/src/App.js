import React, { useState } from "react";
import Schedule from "./components/Schedule";
import { TeachersProvider } from "./context/TeachersContext";
import "./App.css";

function App() {
  return (
    <div className="App">
      <TeachersProvider>
        <Schedule />
      </TeachersProvider>
    </div>
  );
}

export default App;
