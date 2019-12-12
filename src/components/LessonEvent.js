import React from "react";

const LessonEvent = ({ event }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between"
    }}
  >
    <div>{event.title}</div>
    <span style={{}}>{event.room}</span>
  </div>
);
export default LessonEvent;
