import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { WorkWeek } from "./CustomView";
import useToggle from "../hooks/useToggle";
import useFormState from "../hooks/useFormState";
import eventsList from "../events";
import teachersList from "../teachers";
import "react-big-calendar/lib/css/react-big-calendar.css";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Schedule = props => {
  const [events, setEvents] = useState(eventsList);
  const [teacherList, setTeacherList] = useState(teachersList);
  const [didChange, setDidChange] = useState(false);
  const [isOpen, toggleIsOpen] = useToggle(false);
  const [title, handleTitleChange, titleReset] = useFormState("");
  const [startTime, setStartTime] = useState("");
  const [duration, handleDurationChange, durationReset] = useFormState("");

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
      teacherList[index].teachingMins += e.duration;
      setTeacherList([...teacherList]);
      teacherList[
        index
      ].resourceTitle = `${teacherList[index].name} ${teacherList[index].teachingMins}`;
    });
  };

  const moveEvent = ({
    event,
    resourceId,
    start,
    end,
    isAllDay: droppedOnAllDaySlot
  }) => {
    const idx = events.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, resourceId, start, end, allDay };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  const handleUpdate = ({
    event,
    resourceId,
    start,
    end,
    isAllDay: droppedOnAllDaySlot
  }) => {
    moveEvent({
      event,
      resourceId,
      start,
      end,
      isAllDay: droppedOnAllDaySlot
    });
    setDidChange(true);
  };

  useEffect(() => {
    addTeachingMins();
    setDidChange(false);
  }, [didChange]);

  const handleSelect = ({ start }) => {
    toggleIsOpen();
    setStartTime(start);
  };

  const addEvent = () => {
    setEvents([
      ...events,
      {
        title: title,
        start: startTime,
        end: moment(startTime)
          .add(duration, "m")
          .toDate(),
        duration: duration,
        resourceId: 1
      }
    ]);
    toggleIsOpen();
    durationReset();
    titleReset();
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
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Class Name"
          type="text"
          value={title}
          onChange={handleTitleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          id="name"
          label="Class Duration"
          type="text"
          value={duration}
          onChange={handleDurationChange}
          fullWidth
        />
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
        // eventPropGetter={eventStyleGetter}
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
