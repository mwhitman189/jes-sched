import React, { useContext } from "react";
import { StudentsContext } from "../context/StudentsContext";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function PositionedPopper(props) {
  const { isOpen, anchorEl, selectedEvent } = props;
  const classes = useStyles();
  // Create hash table for students in lesson to reduce lookup time
  const attendant_ids = {};
  selectedEvent.attendants.map((a) => {
    attendant_ids._id = a._id;
  });

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
                  if (s._id in attendant_ids) {
                    return (
                      <div>
                        <Typography
                          key={`${s._id} binky`}
                          className={classes.typography}
                        >
                          {s.givenName}
                        </Typography>
                        ;
                      </div>
                    );
                  } else {
                    return (
                      <div>
                        <p>X</p>
                        <Typography
                          key={`${s._id} binky`}
                          className={classes.typography}
                        >
                          {s.givenName}
                        </Typography>
                      </div>
                    );
                  }
                })}
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
