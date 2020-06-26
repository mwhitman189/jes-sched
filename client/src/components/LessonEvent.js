import React from "react";
import moment from "moment";
import useStyles from "../styles/LessonEventStyles";
import CloseIcon from "@material-ui/icons/Close";

const LessonEvent = ({ event }) => {
  const classes = useStyles();
  return (
    <div className={classes.event}>
      {event.sameDayCancellation ? (
        <div className={classes.cancelled}>
          <CloseIcon />
          <p className={classes.sameDay}>当日</p>
        </div>
      ) : event.cancelled ? (
        <CloseIcon className={classes.cancelled} />
      ) : (
        event.absentees &&
        event.absentees.map((a) => (
          <div key={a._id} className={classes.container}>
            <CloseIcon className={classes.absenteeX} />
            <p className={classes.absentees}>{a.givenName}</p>
          </div>
        ))
      )}
      <div className={classes.group}>
        <div>{moment(event.start).format("HH:mm")}</div>
        <div className={classes.innerGroup}>
          <div className={classes.title}>{event.title}</div>
          <span className={classes.room}>{event.room}</span>
        </div>
      </div>
      <div>{moment(event.end).format("HH:mm")}</div>
    </div>
  );
};
export default LessonEvent;
