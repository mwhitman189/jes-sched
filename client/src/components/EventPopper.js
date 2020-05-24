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
  const { isOpen, anchorEl, selectedEvent } = props;
  const { editEvent } = useContext(EventsContext);
  const { user } = useContext(UserContext);
  const classes = useStyles();
  // Create hash table for students in lesson to reduce lookup time
  const attendant_ids = {};
  selectedEvent.attendants.map((a) => {
    attendant_ids._id = a._id;
  });

  const toggleAttendance = (id) => {
    if (user.user.role !== "teacher") {
      let newAttendants;
      if (!(id in attendant_ids)) {
        const student = selectedEvent.students.find((s) => s._id === id);
        newAttendants = [...selectedEvent.attendants, student];
        console.log("id was not in attendant_ids", newAttendants);
      } else {
        newAttendants = selectedEvent.attendants.filter((a) => a._id !== id);
        console.log("id WAS in attendant_ids", newAttendants);
      }
      const updatedEvent = { ...selectedEvent, attendants: newAttendants };
      editEvent(selectedEvent, updatedEvent);
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
                selectedEvent.students.map((s) => (
                  <Typography
                    key={`student number ${s._id}`}
                    className={
                      s._id in attendant_ids
                        ? classes.attending
                        : classes.absent
                    }
                    onClick={() => toggleAttendance(s._id)}
                  >
                    {s.givenName}
                  </Typography>
                ))}
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
