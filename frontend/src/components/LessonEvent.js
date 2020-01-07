import React from "react";
import moment from "moment";

const LessonEvent = ({ event }) => (
  <div style={{ fontSize: ".5rem", padding: "1px" }}>
    <div>{moment(event.start).format("LT")}</div>
    <div
      style={{
        fontSize: ".7rem",
        fontWeight: "600",
        display: "flex",
        justifyContent: "space-between",
        padding: "0"
      }}
    >
      <div>{event.title}</div>
      <span style={{ color: "#1b1c1c", paddingLeft: ".1rem" }}>
        {event.room}
      </span>
    </div>
    <div style={{ fontSize: ".5rem" }}>{moment(event.end).format("LT")}</div>
  </div>
);
export default LessonEvent;
