import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import axios from "axios";

import { WorkWeek } from "./CustomView";
import EventForm from "./EventForm";
import LessonEvent from "./LessonEvent";
import useToggle from "../hooks/useToggle";
import useFormState from "../hooks/useInputState";
import { validateRoom, validateTeacher } from "../validators";
import eventsList from "../events";
import teachersList from "../teachers";

import "react-big-calendar/lib/sass/styles.scss";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Schedule = () => {
  const [events, setEvents] = useState(eventsList);
  const [teacherList, setTeacherList] = useState(teachersList);
  const [startTime, updateStartTime, startTimeReset] = useFormState(new Date());
  const [isOpen, toggleIsOpen] = useToggle(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  // Limit displayed hours of the day
  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(21, 0, 0);

  useEffect(() => {
    axios.get("http://localhost:5000/lessons/").then(response => {
      if (response.data.length > 0) {
        setEvents(response.data);
      }
    });
  }, []);

  useEffect(() => {
    addTeachingMins();
  }, [events]);

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

  // TODO: Add a function to open the new class form with the current data populated, for validation
  const moveEvent = ({ event, resourceId, start, end }) => {
    const idx = events.indexOf(event);

    const updatedEvent = { ...event, resourceId, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  const addEvent = newEvent => {
    axios
      .post("http://localhost:5000/lessons/add", newEvent)
      .then(res => console.log(res.data));

    setEvents([...events, newEvent]);
  };

  const editEvent = updatedEvent => {
    const idx = events.indexOf(updatedEvent);
    const nextEvents = [...events];

    nextEvents.splice(idx, 1, updatedEvent);
    setEvents(nextEvents);
  };

  const handleMove = ({ event, resourceId, start, end }) => {
    const idx = events.indexOf(event);
    const otherEvents = [...events.slice(0, idx), ...events.slice(idx + 1)];
    if (
      !validateRoom(otherEvents, event.room, start, parseInt(event.duration))
    ) {
      alert("That room is unavailable");
    } else if (
      !validateTeacher(otherEvents, resourceId, start, parseInt(event.duration))
    ) {
      alert("That teacher is unavailable");
    } else {
      moveEvent({
        event,
        resourceId,
        start,
        end
      });
    }
  };

  const handleAddEvent = newEvent => {
    addEvent(newEvent);
    toggleIsOpen();
  };

  const handleEditEvent = updatedEvent => {
    editEvent(updatedEvent);
    toggleIsOpen();
    setSelectedEvent();
  };

  const handleSelect = ({ start }) => {
    toggleIsOpen();
    updateStartTime(start);
  };

  const handleDoubleClick = event => {
    setSelectedEvent(event);
    toggleIsOpen();
  };

  // Style events based on event.type
  const eventStyleGetter = event => {
    // Hide a dummy event that fixes drag and drop bug
    if (event.hide) {
      return { style: { display: "none" } };
    }
    let hexColor;
    switch (event.type) {
      case "pl":
        hexColor = "#e6ba1f";
        break;
      case "beg":
        hexColor = "#8adec1";
        break;
      case "el":
        hexColor = "#33dea2";
        break;
      case "lint":
        hexColor = "#1cbd85";
        break;
      case "hint":
        hexColor = "#0b8a5e";
        break;
      case "adv":
        hexColor = "#04593c";
        break;
      case "lb":
        hexColor = "#97dd1a";
        break;
      case "lg1":
        hexColor = "#ca161e";
        break;
      case "lg2":
        hexColor = "#fdc100";
        break;
      case "lg3":
        hexColor = "#0065bd";
        break;
      case "lg4":
        hexColor = "#00ae3e";
        break;
      case "lg5":
        hexColor = "#ff8d2a";
        break;
      case "lg6":
        hexColor = "#8f178e";
        break;
      case "gs":
        hexColor = "#670084";
        break;
      case "ct1":
        hexColor = "#d90000";
        break;
      case "ct2":
        hexColor = "#0076d0";
        break;
      case "ct3":
        hexColor = "#008935";
        break;
      case "prm":
        hexColor = "#7d190b";
        break;
      default:
        hexColor = "#7c9ae6";
        break;
    }

    let backgroundColor = hexColor;
    let style = {
      backgroundColor: backgroundColor,
      color: "white",
      border: 0,
      display: "block"
    };
    return {
      style: style
    };
  };

  return (
    <div>
      {isOpen && (
        <EventForm
          isOpen={isOpen}
          toggleIsOpen={toggleIsOpen}
          addEvent={handleAddEvent}
          addTeachingMins={addTeachingMins}
          events={events}
          teacherList={teacherList}
          startTime={startTime}
          updateStartTime={updateStartTime}
          startTimeReset={startTimeReset}
          editEvent={handleEditEvent}
          event={selectedEvent}
        />
      )}
      <DragAndDropCalendar
        style={{ width: "100vw", maxHeight: "100vh" }}
        localizer={localizer}
        views={{ week: WorkWeek, day: true }}
        defaultView="day"
        events={events}
        onEventDrop={handleMove}
        startAccessor="start"
        endAccessor="end"
        resources={teacherList}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        selectable
        onDoubleClickEvent={handleDoubleClick}
        eventPropGetter={eventStyleGetter}
        step={30}
        timeslots={2}
        min={minTime}
        max={maxTime}
        onSelectSlot={handleSelect}
        components={{
          day: { event: LessonEvent }
        }}
        resizableAccessor={() => false}
      />
    </div>
  );
};
export default Schedule;
