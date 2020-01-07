import React from "react";
import moment from "moment";

const LessonEvent = ({ event }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      fontSize: ".6rem",
      padding: "1px",
      height: "100%",
      width: "100%"
    }}
  >
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
    <div>{moment(event.end).format("LT")}</div>
  </div>
);
export default LessonEvent;
