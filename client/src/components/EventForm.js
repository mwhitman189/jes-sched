import React, { useState, useContext } from "react";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { validateRoom, validateTeacher } from "../validators";
import { TeachersContext } from "../context/TeachersContext";
import { StudentsContext } from "../context/StudentsContext";
import { EventsContext } from "../context/EventsContext";
import { checkForSameDate } from "../helperFunctions";
import roomList from "../rooms";
import lessonTypes from "../lessonTypes";
import { makeStyles } from "@material-ui/core/styles";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    display: "inline",
    "& .MuiFormControl-root": {
      margin: "10px",
      width: "200px",
    },
  },
  recurSwitch: {
    position: "absolute",
    right: "1rem",
    top: "1rem",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  timePickerContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function EventForm(props) {
  const classes = useStyles();
  const { addTeachingMins } = useContext(TeachersContext);
  const { events, addEvent, editEvent, deleteEvent } = useContext(
    EventsContext
  );
  const { teachers } = useContext(TeachersContext);
  const { students } = useContext(StudentsContext);
  const {
    formType,
    setFormType,
    event,
    startTime,
    setSelectedEvent,
    selectedTeacher,
    validateRoomAndResource,
    attendees,
  } = props;

  const [start, setStart] = useInputState(startTime);
  const [title, setTitle, resetTitle] = useInputState(event ? event.title : "");
  const [duration, setDuration, resetDuration] = useInputState(
    event ? event.duration : ""
  );
  const [resource, setResource, resetResource] = useInputState(
    event ? event.resourceId : selectedTeacher
  );
  const [room, setRoom, resetRoom] = useInputState(event ? event.room : "");
  const [eventType, setEventType, resetEventType] = useInputState(
    event ? event.type : ""
  );
  const [members, setMembers] = useInputState(event ? event.students : []);
  const [isRecurring, toggleIsRecurring] = useToggleState(false);
  const [isLoading, toggleIsLoading] = useToggleState(false);

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

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // If an event does not exist, check whether the selected room is
  // available at the specified time
  ValidatorForm.addValidationRule("teacherIsAvailable", (teacher) => {
    return validateTeacher(events, teacher, start, duration);
  });

  // If an event does not exist, check whether the selected room is
  // available at the specified time
  ValidatorForm.addValidationRule("roomIsAvailable", (room) => {
    return validateRoom(events, room, start, duration);
  });

  const handleTimeChange = (date) => {
    setStart(date._d);
  };

  const hideForm = () => {
    resetForm();
    setFormType("");
  };

  const resetForm = () => {
    resetTitle();
    resetDuration();
    resetResource();
    resetRoom();
    resetEventType();
    toggleIsRecurring(false);
    setSelectedEvent("");
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    addEvent({
      title: title,
      start: start,
      end: moment(start).add(duration, "m").toDate(),
      room: room,
      duration: parseInt(duration),
      resourceId: parseInt(resource),
      type: eventType,
      recur: isRecurring,
      students: members,
      attendees: members,
    });
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    validateRoomAndResource(e, resource, start);
    const editedEvent = {
      ...event,
      title: title,
      start: start,
      end: moment(start).add(duration, "m").toDate(),
      room: room,
      duration: parseInt(duration),
      resourceId: parseInt(resource),
      type: eventType,
      isRecurring: isRecurring,
      students: members,
      isNewEvent: true,
    };
    editEvent(editedEvent);
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleCancelEvent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    let sdCancellation = checkForSameDate(event.start);
    const editedEvent = {
      ...event,
      cancelled: true,
      sameDayCancellation: sdCancellation,
    };
    editEvent(editedEvent);
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleDeleteEvent = () => {
    toggleIsLoading(true);
    deleteEvent(event);
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleToggleRecurrence = () => {
    toggleIsRecurring(!isRecurring);
  };

  return (
    <Dialog
      open={formType === "event"}
      onClose={hideForm}
      aria-labelledby="form-dialog-title"
      // Allow TimePicker component to gain focus, preventing stack overflow
      disableEnforceFocus
    >
      <ValidatorForm onSubmit={event ? handleEditEvent : handleAddEvent}>
        <DialogTitle id="form-dialog-title">New Lesson</DialogTitle>
        <DialogContent>
          <FormControlLabel
            className={classes.recurSwitch}
            control={
              <Switch
                checked={isRecurring}
                onChange={handleToggleRecurrence}
                value={isRecurring}
              />
            }
            label="Weekly lesson"
          />
          <FormControl
            className={[classes.formControl, classes.timePickerContainer].join(
              " "
            )}
            style={{ flexDirection: "row" }}
          >
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <TimePicker
                value={start}
                onChange={handleTimeChange}
                minutesStep={5}
                margin="dense"
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              autoFocus
              margin="dense"
              id="title"
              label="Lesson Name"
              type="text"
              value={title}
              onChange={setTitle}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Lesson Name"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              margin="dense"
              id="duration"
              label="Duration"
              type="text"
              pattern="[0-9]*"
              value={duration}
              onChange={setDuration}
              fullWidth
              validators={["required"]}
              errorMessages={["Enter the Duration"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <SelectValidator
              classes={{ root: classes.root }}
              margin="dense"
              label="Teacher"
              InputLabelProps={{ shrink: true }}
              fullWidth
              id="resource"
              value={resource}
              onChange={setResource}
              name="resource"
              validators={teacherValidators}
              errorMessages={teacherValMsgs}
            >
              <MenuItem value="" />
              {teachers.map((t) => (
                <MenuItem key={`teacher-${t.resourceId}`} value={t.resourceId}>
                  {t.name}
                </MenuItem>
              ))}
            </SelectValidator>
          </FormControl>
          <FormControl fullWidth size="medium" className={classes.formControl}>
            <Autocomplete
              id="students"
              options={students}
              label="Students"
              margin="dense"
              getOptionLabel={(option) =>
                `${option.givenName} ${option.familyName}`
              }
              onChange={(newMembers) => {
                setMembers([...event.students, ...newMembers]);
                console.log("members state: ", members, "event.attendees");
              }}
              multiple
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="Students" variant="outlined" />
              )}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <SelectValidator
              classes={{ root: classes.root }}
              label="Room"
              InputLabelProps={{ shrink: true }}
              margin="dense"
              fullWidth
              id="room"
              value={room}
              onChange={setRoom}
              name="room"
              validators={roomValidators}
              errorMessages={roomValMsgs}
            >
              <MenuItem value="" />
              {roomList.map((r) => (
                <MenuItem key={`room-${r}`} value={r}>
                  {r}
                </MenuItem>
              ))}
            </SelectValidator>
          </FormControl>
          <FormControl className={classes.formControl}>
            <SelectValidator
              classes={{ root: classes.list }}
              margin="dense"
              label="Lesson Type"
              InputLabelProps={{ shrink: true }}
              fullWidth
              id="type"
              value={eventType}
              onChange={setEventType}
              name="type"
            >
              <MenuItem value="" />
              {lessonTypes.map((t) => (
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
          <Button onClick={handleCancelEvent} color="secondary">
            Cancel Lesson
          </Button>
          <Button onClick={hideForm} color="primary">
            Back
          </Button>
          <Button type="submit" color="primary">
            {event ? "Confirm Change" : "Add Lesson"}
          </Button>
        </DialogActions>
      </ValidatorForm>
    </Dialog>
  );
}
