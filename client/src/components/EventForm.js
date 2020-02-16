import React, { useEffect, useContext } from "react";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";
import moment from "moment";

import useInputState from "../hooks/useInputState";
import { validateRoom, validateTeacher } from "../validators";
import { EventsContext } from "../context/EventsContext";

import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import roomList from "../rooms";
import lessonTypes from "../lessonTypes";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function EventForm(props) {
  const { events, addEvent, editEvent, deleteEvent } = useContext(
    EventsContext
  );
  const classes = useStyles();
  const {
    formType,
    setFormType,
    teachers,
    startTime,
    updateStartTime,
    event,
    setSelectedEvent,
    selectedTeacher,
    isRecurring,
    toggleIsRecurring
  } = props;

  // If a new start time was input, use it for the form input,
  // otherwise use the original event's start time
  const startDateTime = startTime ? startTime : event.start;

  const [title, updateTitle, resetTitle] = useInputState(
    event ? event.title : ""
  );
  const [duration, updateDuration, resetDuration] = useInputState(
    event ? event.duration : ""
  );
  const [resource, updateResource, resetResource] = useInputState(
    event ? event.resourceId : selectedTeacher
  );
  const [room, updateRoom, resetRoom] = useInputState(event ? event.room : "");
  const [eventType, updateEventType, resetEventType] = useInputState(
    event ? event.type : ""
  );

  let teacherValidators = ["required"];
  let teacherValMsgs = ["Teacher Required"];
  let roomValidators = ["required"];
  let roomValMsgs = ["Room Required"];
  if (!event) {
    teacherValidators.push("teacherIsAvailable");
    teacherValMsgs.push("Teacher unavailable");
    roomValidators.push("roomIsAvailable");
    roomValMsgs.push("Room unavailable");
  }

  useEffect(() => {
    // If an event does not exist, check whether the selected room is
    // available at the specified time
    ValidatorForm.addValidationRule("teacherIsAvailable", teacher => {
      return validateTeacher(events, teacher, startTime, duration);
    });

    // If an event does not exist, check whether the selected room is
    // available at the specified time
    ValidatorForm.addValidationRule("roomIsAvailable", room => {
      return validateRoom(events, room, startTime, duration);
    });
  });

  const hideForm = () => setFormType("");

  const resetForm = () => {
    resetTitle();
    resetDuration();
    resetResource();
    resetRoom();
    resetEventType();
    toggleIsRecurring(false);
  };

  const handleAddEvent = e => {
    e.preventDefault();
    const startTimeObj = new Date(startDateTime);
    addEvent({
      title: title,
      start: startTimeObj,
      end: moment(startTimeObj)
        .add(duration, "m")
        .toDate(),
      room: room,
      duration: parseInt(duration),
      resourceId: parseInt(selectedTeacher),
      type: eventType,
      recur: isRecurring
    });
    resetForm();
    setSelectedEvent("");
    hideForm();
  };

  const handleEditEvent = e => {
    e.preventDefault();
    const startTimeObj = new Date(startDateTime);
    const editedEvent = {
      title: title,
      start: startTimeObj,
      end: moment(startTimeObj)
        .add(duration, "m")
        .toDate(),
      room: room,
      duration: duration,
      resourceId: parseInt(resource),
      type: eventType,
      isRecurring: isRecurring
    };
    editEvent(event, editedEvent);
    resetForm();
    setSelectedEvent("");
    hideForm();
  };

  const handleDeleteEvent = () => {
    deleteEvent(event);
    setSelectedEvent("");
    hideForm();
  };

  const handleToggleRecurrence = () => {
    toggleIsRecurring(!isRecurring);
  };

  const handleCancel = () => {
    resetForm();
    setSelectedEvent("");
    hideForm();
  };

  return (
    <Dialog
      open={formType === "event"}
      onClose={hideForm}
      aria-labelledby="form-dialog-title"
    >
      <ValidatorForm onSubmit={event ? handleEditEvent : handleAddEvent}>
        <DialogTitle id="form-dialog-title">New Lesson</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter Lesson Info</DialogContentText>
          <FormControlLabel
            control={
              <Switch
                checked={isRecurring}
                onChange={handleToggleRecurrence}
                value={isRecurring}
              />
            }
            label="Weekly lesson"
          />
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="title"
              label="Lesson Name"
              type="text"
              value={title}
              onChange={updateTitle}
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
              value={startDateTime}
              onChange={updateStartTime}
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
              onChange={updateDuration}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Duration"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <SelectValidator
              className={classes.selectStyles}
              margin="dense"
              label="Teacher"
              InputLabelProps={{ shrink: true }}
              fullWidth
              id="resource"
              value={resource}
              onChange={updateResource}
              name="resource"
              validators={teacherValidators}
              errorMessages={teacherValMsgs}
            >
              <MenuItem value="" />
              {teachers.map(t => (
                <MenuItem key={`teacher-${t.resourceId}`} value={t.resourceId}>
                  {t.name}
                </MenuItem>
              ))}
            </SelectValidator>
          </FormControl>
          <FormControl className={classes.formControl}>
            <SelectValidator
              className={classes.selectStyles}
              label="Room"
              InputLabelProps={{ shrink: true }}
              margin="dense"
              fullWidth
              id="room"
              value={room}
              onChange={updateRoom}
              name="room"
              validators={roomValidators}
              errorMessages={roomValMsgs}
            >
              <MenuItem value="" />
              {roomList.map(r => (
                <MenuItem key={`room-${r}`} value={r}>
                  {r}
                </MenuItem>
              ))}
            </SelectValidator>
          </FormControl>
          <FormControl className={classes.formControl}>
            <SelectValidator
              className={classes.selectStyles}
              margin="dense"
              label="Lesson Type"
              InputLabelProps={{ shrink: true }}
              fullWidth
              id="type"
              value={eventType}
              onChange={updateEventType}
              name="type"
            >
              <MenuItem value="" />
              {lessonTypes.map(t => (
                <MenuItem key={`type-${t.shortName}`} value={t.type}>
                  {t.name}
                </MenuItem>
              ))}
            </SelectValidator>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteEvent} color="secondary">
            Delete Lesson
          </Button>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            {event ? "Confirm Change" : "Add Lesson"}
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}
