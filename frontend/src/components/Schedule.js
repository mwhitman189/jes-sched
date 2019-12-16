import React, { useState, useEffect } from "react";

import CustomDnDCalendar from "./CustomDnDCalendar";
import EventForm from "./EventForm";
import TeacherForm from "./TeacherForm";
import useFormState from "../hooks/useInputState";
import { validateRoom, validateTeacher } from "../validators";
import {
  addTeachingMins,
  getTeachers,
  getLessons,
  addLesson,
  addTeacher,
  updateTeacher,
  changeEvent
} from "../helperFunctions";

import "react-big-calendar/lib/sass/styles.scss";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

const Schedule = () => {
  const [formType, setFormType] = useState("");
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Dummy Event to fix drag and drop bug",
      start: new Date(),
      end: new Date(),
      room: 2,
      duration: 0,
      resourceId: 1,
      hide: true
    }
  ]);
  const [teachers, setTeachers] = useState([]);
  const [startTime, updateStartTime, resetStartTime] = useFormState(new Date());
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    getLessons(events, setEvents);
    getTeachers(events, teachers, setTeachers);
  }, []);

  useEffect(() => {
    addTeachingMins(events, teachers, setTeachers);
  }, [events]);

  const moveEvent = ({ event, resourceId, start, end }) => {
    const updatedEvent = { ...event, resourceId, start, end };
    changeEvent(events, event, updatedEvent, setEvents);
  };

  // Add validation to a move upon dropping an event with drag and drop
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
    addLesson(events, newEvent, setEvents);
    setFormType("event");
  };

  const handleSelect = ({ start }) => {
    updateStartTime(start);
    setFormType("event");
  };

  const handleDoubleClick = event => {
    updateStartTime(event.start);
    setSelectedEvent(event);
    setFormType("event");
  };

  const handleAddTeacher = newTeacher => {
    addTeacher(teachers, newTeacher, setTeachers);
    setFormType("");
  };

  const handleBtnClick = () => {
    setFormType("teacher");
  };

  return (
    <div>
      {formType === "event" && (
        <EventForm
          formType={formType}
          setFormType={setFormType}
          addEvent={handleAddEvent}
          events={events}
          teachers={teachers}
          startTime={startTime}
          updateStartTime={updateStartTime}
          resetStartTime={resetStartTime}
          event={selectedEvent}
          setEvents={setEvents}
        />
      )}
      {formType === "teacher" && (
        <TeacherForm
          formType={formType}
          setFormType={setFormType}
          addTeacher={handleAddTeacher}
          setTeachers={setTeachers}
          teachers={teachers}
        />
      )}
      <button
        style={{ position: "absolute", top: "0px", left: "45%" }}
        onClick={handleBtnClick}
      >
        New Teacher
      </button>
      <CustomDnDCalendar
        handleMove={handleMove}
        handleSelect={handleSelect}
        handleDoubleClick={handleDoubleClick}
        events={events}
        teachers={teachers}
      />
    </div>
  );
};
export default Schedule;
