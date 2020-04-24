import React from "react";
import moment from "moment";
import useStyles from "../styles/LessonEventStyles";
import CloseIcon from "@material-ui/icons/Close";

const LessonEvent = ({ event }) => {
  const classes = useStyles();
  return (
    <div className={classes.event}>
      {event.sameDayCancellation ? (
        <CloseIcon className={classes.cancelledIcon} />
      ) : (
        event.cancelled && (
          <>
            <p>SD</p>
            <CloseIcon className={classes.cancelledIcon} />
          </>
        )
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
