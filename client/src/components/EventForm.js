import React, { useContext } from "react";
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
import { EventsContext } from "../context/EventsContext";
import { checkForSameDate } from "../helperFunctions";
import roomList from "../rooms";
import lessonTypes from "../lessonTypes";
import { makeStyles } from "@material-ui/core/styles";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    display: "inline",
    "& .MuiFormControl-root": {
      margin: "10px",
      width: "110px",
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
}));

export default function EventForm(props) {
  const classes = useStyles();
  const { events, addEvent, getEvents, editEvent, deleteEvent } = useContext(
    EventsContext
  );
  const { teachers } = useContext(TeachersContext);
  const {
    formType,
    setFormType,
    event,
    startTime,
    setSelectedEvent,
    selectedTeacher,
    validateRoomAndResource,
  } = props;

  const [start, updateStart] = useInputState(startTime);

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
  const [isRecurring, toggleIsRecurring] = useToggleState(false);

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

  const today = new Date().getTime();

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
    updateStart(date._d);
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
    addEvent({
      title: title,
      start: start,
      end: moment(start).add(duration, "m").toDate(),
      room: room,
      duration: parseInt(duration),
      resourceId: resource,
      type: eventType,
      recur: isRecurring,
    });
    getEvents(today);
    hideForm();
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    validateRoomAndResource(e, resource, start);
    const editedEvent = {
      title: title,
      start: start,
      end: moment(start).add(duration, "m").toDate(),
      room: room,
      duration: parseInt(duration),
      resourceId: parseInt(resource),
      type: eventType,
      isRecurring: isRecurring,
      isNewEvent: true,
    };
    editEvent(event, editedEvent);
    getEvents(today);
    hideForm();
  };

  const handleCancelEvent = (e) => {
    e.preventDefault();
    let sdCancellation = checkForSameDate(event.start);
    const editedEvent = {
      ...event,
      cancelled: true,
      sameDayCancellation: sdCancellation,
    };
    editEvent(event, editedEvent);
    getEvents(today);
    hideForm();
  };

  const handleDeleteEvent = () => {
    deleteEvent(event);
    getEvents(today);
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
              onChange={updateTitle}
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
              {teachers.map((t) => (
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
              {roomList.map((r) => (
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
