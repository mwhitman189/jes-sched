import React, { useState, useEffect, useContext } from "react";
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
  const { events, setEvents, addEvent, getEvents } = useContext(EventsContext);

  const [formType, setFormType] = useState("");
  const [startTime, updateStartTime, resetStartTime] = useFormState(new Date());
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    getEvents(new Date().getTime());
    getTeachers(events);
    addTeachingMins(events);
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
  };

  // Add validation to a move upon dropping an event with drag and drop
  // If there is a conflict, prevent the move and flash a conflict snackbar
  const handleMove = ({ event, resourceId, start, end }) => {
    validateRoomAndResource(event, resourceId, start);
    moveEvent({
      event,
      resourceId,
      start,
      end
    });
    return 0;
  };

  const handleAddEvent = newEvent => {
    addEvent(newEvent);
    setEvents(getEvents());
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
          events={events}
          teachers={teachers}
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
          setTeachers={setTeachers}
          teachers={teachers}
        />
      )}
      {formType === "payroll" && (
        <Payroll events={events} setFormType={setFormType} />
      )}
      <CustomizedSnackbars
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant={"error"}
        msg={message}
        events={events}
      />
      <CustomDnDCalendar
        handleMove={handleMove}
        handleSelect={handleSelect}
        handleDoubleClick={handleDoubleClick}
        events={events}
        setEvents={setEvents}
        teachers={teachers}
        handleBtnClick={handleBtnClick}
        handlePayrollBtnClick={handlePayrollBtnClick}
      />
    </div>
  );
};
export default Schedule;
