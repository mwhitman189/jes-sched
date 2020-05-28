import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { EventsContext } from "../context/EventsContext";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  attending: {
    cursor: "pointer",
    padding: theme.spacing(2),
  },
  absent: {
    opacity: 0.3,
    textDecoration: "line-through",
    cursor: "pointer",
    padding: theme.spacing(2),
  },
}));

export default function PositionedPopper(props) {
  const { isOpen, anchorEl, selectedEvent, attendees, setAttendees } = props;
  const { editEvent } = useContext(EventsContext);
  const { user } = useContext(UserContext);
  const classes = useStyles();

  const toggleAttendance = (id) => {
    if (user.user.role !== "teacher") {
      let newAttendees;
      if (attendees.some((a) => a._id === id)) {
        newAttendees = attendees.filter((a) => a._id !== id);
      } else {
        const student = selectedEvent.students.find((s) => s._id === id);
        newAttendees = [...attendees, student];
      }
      const editedEvent = { ...selectedEvent, attendees: newAttendees };
      editEvent(editedEvent);
      return setAttendees(newAttendees);
    }
  };

  return (
    <div className={classes.root}>
      <Popper
        open={isOpen}
        anchorEl={anchorEl}
        placement={"left-end"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {selectedEvent.students &&
                selectedEvent.students.map((s) => {
                  let className;
                  if (attendees.some((a) => a._id === s._id)) {
                    className = classes.attending;
                  } else {
                    className = classes.absent;
                  }
                  return (
                    <Typography
                      key={`student number ${s._id}`}
                      className={className}
                      onClick={() => toggleAttendance(s._id)}
                    >
                      {s.givenName}
                    </Typography>
                  );
                })}
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
