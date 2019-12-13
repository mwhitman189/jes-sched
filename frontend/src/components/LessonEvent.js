import React from "react";

const LessonEvent = ({ event }) => (
  <div
    style={{
      fontWeight: "600",
      display: "flex",
      justifyContent: "space-between"
    }}
  >
    <div>{event.title}</div>
    <span style={{ fontWeight: "600" }}>{event.room}</span>
  </div>
);
export default LessonEvent;
