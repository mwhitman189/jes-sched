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
              {selectedEvent.students.map((s) => (
                <Typography
                  key={`${s.givenName} binky`}
                  className={classes.typography}
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
