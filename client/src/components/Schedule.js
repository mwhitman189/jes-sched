import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import CustomDnDCalendar from "./CustomDnDCalendar";
import EventForm from "./EventForm";
import TeacherForm from "./TeacherForm";
import CustomizedSnackbars from "./CustomizedSnackbars";
import Payroll from "./Payroll";
import useFormState from "../hooks/useInputState";
import { TeachersContext } from "../context/TeachersContext";
import { validateRoom, validateTeacher } from "../validators";
import { EventsContext } from "../context/EventsContext";
import "react-big-calendar/lib/sass/styles.scss";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

const Schedule = () => {
  const {
    teachers,
    setTeachers,
    getTeachers,
    addTeacher,
    addTeachingMins
  } = useContext(TeachersContext);
  const { events, addEvent, getEvents } = useContext(EventsContext);

  const [formType, setFormType] = useState("");
  const [startTime, updateStartTime, resetStartTime] = useFormState(new Date());
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    // Pass current dateTime to compare to recurrence events to check if a new batch of recurrences
    // is needed
    getEvents(new Date().getTime());
    getTeachers(events);
  }, []);

  useEffect(() => {
    addTeachingMins(events);
  }, [events, setTeachers]);

  const moveEvent = ({ event, resourceId, start, end }) => {
    const updatedEvent = { ...event, resourceId, start, end };
    handleDoubleClick(updatedEvent);
  };

  const validateRoomAndResource = (event, resourceId, start) => {
    const idx = events.indexOf(event);
    const otherEvents = [...events.slice(0, idx), ...events.slice(idx + 1)];
    if (
      !validateRoom(otherEvents, event.room, start, parseInt(event.duration))
    ) {
      setSelectedEvent(event);
      handleToggleSnackbar("Room Conflict. Please choose another room or time");
      return 1;
    }
    if (
      !validateTeacher(otherEvents, resourceId, start, parseInt(event.duration))
    ) {
      setSelectedEvent(event);
      handleToggleSnackbar(
        "Teacher Conflict. Please choose another teacher or time"
      );
      return 1;
    }
    return 0;
  };

  // Add validation to a move upon dropping an event with drag and drop
  // If there is a conflict, prevent the move and flash a conflict snackbar
  const handleMove = ({ event, resourceId, start, end }) => {
    if (validateRoomAndResource(event, resourceId, start) === 0) {
      moveEvent({
        event,
        resourceId,
        start,
        end
      });
      return 0;
    }
    return 1;
  };

  const handleAddEvent = newEvent => {
    addEvent(newEvent);
    setFormType("");
  };

  const handleSelect = ({ start, resourceId }) => {
    updateStartTime(start);
    setSelectedTeacher(resourceId);
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

  const handleToggleSnackbar = msg => {
    setMessage(msg);
    setIsOpen(true);
  };

  const handlePayrollBtnClick = () => {
    setFormType("payroll");
  };

  return (
    <div>
      {formType === "event" && (
        <EventForm
          formType={formType}
          setFormType={setFormType}
          addEvent={handleAddEvent}
          startTime={startTime}
          updateStartTime={updateStartTime}
          resetStartTime={resetStartTime}
          event={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          selectedTeacher={selectedTeacher}
          validateRoomAndResource={validateRoomAndResource}
        />
      )}
      {formType === "teacher" && (
        <TeacherForm
          formType={formType}
          setFormType={setFormType}
          addTeacher={handleAddTeacher}
        />
      )}
      {formType === "payroll" && <Payroll setFormType={setFormType} />}
      <CustomizedSnackbars
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant={"error"}
        msg={message}
      />
      <CustomDnDCalendar
        handleMove={handleMove}
        handleSelect={handleSelect}
        handleDoubleClick={handleDoubleClick}
        handleBtnClick={handleBtnClick}
        handlePayrollBtnClick={handlePayrollBtnClick}
      />
    </div>
  );
};
export default Schedule;
