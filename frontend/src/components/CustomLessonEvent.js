import React from "react";

const CustomLessonEvent = ({ event }) => {
  return (
    <div
      style={{
        display: "flex",
        fontWeight: "600",
        justifyContent: "space-between"
      }}
    >
      <div>{event.title}</div>
      <span>{event.room}</span>
    </div>
  );
};
export default CustomLessonEvent;
