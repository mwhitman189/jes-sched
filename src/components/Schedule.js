import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { WorkWeek } from "./CustomView";
import useToggle from "../hooks/useToggle";
import useFormState from "../hooks/useFormState";
import eventsList from "../events";
import teachersList from "../teachers";
import roomList from "../rooms";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const Schedule = props => {
  const classes = useStyles();
  const [events, setEvents] = useState(eventsList);
  const [teacherList, setTeacherList] = useState(teachersList);
  const [isOpen, toggleIsOpen] = useToggle(false);
  const [title, handleTitleChange, titleReset] = useFormState("");
  const [startTime, setStartTime] = useState("");
  const [duration, handleDurationChange, durationReset] = useFormState("");
  const [resource, handleResourceChange, resourceReset] = useFormState("");
  const [room, handleRoomChange, roomReset] = useFormState("");

  useEffect(() => {
    durationReset();
    titleReset();
    resourceReset();
    roomReset();
    addTeachingMins();
  }, [events]);

  // Limit displayed hours of the day
  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(21, 0, 0);

  const addTeachingMins = () => {
    teacherList.forEach(teacher => {
      return (teacher.teachingMins = 0);
    });
    events.forEach(e => {
      const index = teacherList.findIndex(
        teacher => teacher.resourceId === e.resourceId
      );
      // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
      teacherList[index].teachingMins += parseInt(e.duration);
      setTeacherList([...teacherList]);
      teacherList[
        index
      ].resourceTitle = `${teacherList[index].name} ${teacherList[index].teachingMins}`;
    });
  };

  const moveEvent = ({ event, resourceId, start, end }) => {
    const idx = events.indexOf(event);

    const updatedEvent = { ...event, resourceId, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  const handleUpdate = ({ event, resourceId, start, end }) => {
    moveEvent({
      event,
      resourceId,
      start,
      end
    });
  };

  const handleSelect = ({ start }) => {
    toggleIsOpen();
    setStartTime(start);
  };

  const addEvent = () => {
    setEvents([
      ...events,
      {
        title: `${title} -- ${room}`,
        start: startTime,
        end: moment(startTime)
          .add(duration, "m")
          .toDate(),
        duration: duration,
        resourceId: parseInt(resource)
      }
    ]);
  };

  const newEventForm = (
    <Dialog
      open={isOpen}
      onClose={toggleIsOpen}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the start time and class duration
        </DialogContentText>
        <FormControl className={classes.formControl}>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Class Name"
            type="text"
            value={title}
            onChange={handleTitleChange}
            fullWidth
            required
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            autoFocus
            margin="dense"
            id="startTime"
            label="Start Time"
            type="text"
            value={moment(startTime).format("hh:mm")}
            onChange={setStartTime}
            fullWidth
            required
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            margin="dense"
            id="duration"
            label="Class Duration"
            type="text"
            pattern="[0-9]*"
            value={duration}
            onChange={handleDurationChange}
            fullWidth
            required
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="resource">Teacher</InputLabel>
          <Select
            native
            id="resource"
            value={resource}
            onChange={handleResourceChange}
            name="resource"
            required
          >
            <option value="" />
            {teacherList.map(t => (
              <option key={`teacher-${t.resourceId}`} value={t.resourceId}>
                {t.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="room">Room #</InputLabel>
          <Select
            native
            id="room"
            value={room}
            onChange={handleRoomChange}
            name="room"
            required
          >
            <option value="" />
            {roomList.map(r => (
              <option key={`room-${r}`} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleIsOpen} color="primary">
          Cancel
        </Button>
        <Button onClick={addEvent} color="primary">
          Add Class
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <div>
      {isOpen && newEventForm}
      <DragAndDropCalendar
        style={{ width: "95vw", maxHeight: "100%" }}
        localizer={localizer}
        views={{ week: WorkWeek, day: true }}
        defaultView="day"
        events={events}
        onEventDrop={handleUpdate}
        startAccessor="start"
        endAccessor="end"
        resources={teacherList}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        selectable
        eventPropGetter={
          // Hide a dummy event that fixes drag and drop bug
          event => {
            if (event.hide) {
              return { style: { display: "none" } };
            }
          }
        }
        step={30}
        timeslots={2}
        min={minTime}
        max={maxTime}
        onSelectSlot={handleSelect}
      />
    </div>
  );
};
export default Schedule;
