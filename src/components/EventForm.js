import React, { useEffect } from "react";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";
import moment from "moment";

import useFormState from "../hooks/useFormState";
import { validateRoom, validateTeacher } from "../validators";

import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import roomList from "../rooms";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  selectStyles: {
    marginTop: "23px"
  }
}));

export default function EventForm(props) {
  const classes = useStyles();

  const [title, handleTitleChange, titleReset] = useFormState("");
  const [duration, handleDurationChange, durationReset] = useFormState("");
  const [resource, handleResourceChange, resourceReset] = useFormState("");
  const [room, handleRoomChange, roomReset] = useFormState("");

  const {
    addEvent,
    isOpen,
    toggleIsOpen,
    events,
    teacherList,
    startTime,
    handleStartTimeChange,
    startTimeReset
  } = props;

  useEffect(() => {
    // Check whether the selected room is available at the specified time
    ValidatorForm.addValidationRule("roomIsAvailable", room => {
      return validateRoom(events, room, startTime, duration);
    });
  });

  useEffect(() => {
    // Check whether the selected room is available at the specified time
    ValidatorForm.addValidationRule("teacherIsAvailable", teacher => {
      return validateTeacher(events, teacher, startTime, duration);
    });
  });

  useEffect(() => {
    durationReset();
    titleReset();
    resourceReset();
    roomReset();
    startTimeReset();
  }, [events]);

  const handleAddEvent = () => {
    const startTimeObj = new Date(startTime);
    addEvent({
      title: `${title} -- ${room}`,
      start: startTimeObj,
      end: moment(startTimeObj)
        .add(duration, "m")
        .toDate(),
      room: room,
      duration: duration,
      resourceId: parseInt(resource)
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={toggleIsOpen}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm onSubmit={handleAddEvent}>
        <DialogTitle id="form-dialog-title">New Lesson</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Lesson Info</DialogContentText>
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="title"
              label="Lesson Name"
              type="text"
              value={title}
              onChange={handleTitleChange}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Lesson Name"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="startTime"
              label="Start Time"
              type="text"
              value={startTime}
              onChange={handleStartTimeChange}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Start Time"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              margin="dense"
              id="duration"
              label="Lesson Duration"
              type="text"
              pattern="[0-9]*"
              value={duration}
              onChange={handleDurationChange}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Duration"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="resource">Teacher</InputLabel>
            <SelectValidator
              className={classes.selectStyles}
              margin="dense"
              fullWidth
              id="resource"
              value={resource}
              onChange={handleResourceChange}
              name="resource"
              validators={["required", "teacherIsAvailable"]}
              errorMessages={["Select a Teacher", "Teacher is unavailable"]}
            >
              <MenuItem value="" />
              {teacherList.map(t => (
                <MenuItem key={`teacher-${t.resourceId}`} value={t.resourceId}>
                  {t.name}
                </MenuItem>
              ))}
            </SelectValidator>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="room">Room #</InputLabel>
            <SelectValidator
              className={classes.selectStyles}
              margin="dense"
              fullWidth
              id="room"
              value={room}
              onChange={handleRoomChange}
              name="room"
              validators={["required", "roomIsAvailable"]}
              errorMessages={["Select a Room", "That room is already taken"]}
            >
              <MenuItem value="" />
              {roomList.map(r => (
                <MenuItem key={`room-${r}`} value={r}>
                  {r}
                </MenuItem>
              ))}
            </SelectValidator>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleIsOpen} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add Class
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}
