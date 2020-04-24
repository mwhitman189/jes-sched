import React, { useState, useEffect, useContext } from "react";
import CustomDnDCalendar from "./CustomDnDCalendar";
import { protectAction } from "../helperFunctions";
import { validateRoom, validateTeacher } from "../validators";
import { TeachersContext } from "../context/TeachersContext";
import { EventsContext } from "../context/EventsContext";
import { UserContext } from "../context/UserContext";
import useFormState from "../hooks/useInputState";
import EventForm from "./EventForm";
import TeacherForm from "./TeacherForm";
import CustomizedSnackbars from "./CustomizedSnackbars";
import Payroll from "./Payroll";
import Footer from "./Footer";
import "react-big-calendar/lib/sass/styles.scss";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

const Schedule = () => {
  const { getTeachers, addTeachingMins } = useContext(TeachersContext);
  const { events, addEvent, getEvents } = useContext(EventsContext);
  const { user } = useContext(UserContext);

  const [formType, setFormType] = useState("");
  const [startTime, updateStartTime] = useFormState(new Date());
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    // Pass current dateTime to compare to recurrence events to check if a new batch of recurrences
    // is needed
    getEvents(new Date().getTime());
  }, []);

  useEffect(() => {
    getTeachers(events);
  }, [events]);

  useEffect(() => {
    addTeachingMins(events);
  }, [events]);

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
        end,
      });
      return 0;
    }
    return 1;
  };

  const handleAddEvent = (newEvent) => {
    addEvent(newEvent);
    setFormType("");
  };

  const handleSelect = ({ start, resourceId }) => {
    updateStartTime(start);
    setSelectedTeacher(resourceId);
    setFormType("event");
  };

  const handleDoubleClick = (event) => {
    updateStartTime(event.start);
    setSelectedEvent(event);
    setFormType("event");
  };

  const handleAddTeacherNav = () => {
    setFormType("teacher");
  };

  const handleToggleSnackbar = (msg) => {
    setMessage(msg);
    setIsOpen(true);
  };

  const handlePayrollNav = () => {
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
          event={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          selectedTeacher={selectedTeacher}
          validateRoomAndResource={validateRoomAndResource}
        />
      )}
      {formType === "teacher" && (
        <TeacherForm formType={formType} setFormType={setFormType} />
      )}
      {formType === "payroll" && <Payroll setFormType={setFormType} />}
      <CustomizedSnackbars
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant={"error"}
        msg={message}
      />

      <CustomDnDCalendar
        handleMove={protectAction(user, handleMove)}
        handleSelect={protectAction(user, handleSelect)}
        handleDoubleClick={protectAction(user, handleDoubleClick)}
        handleAddTeacherNav={protectAction(user, handleAddTeacherNav)}
        handlePayrollNav={protectAction(user, handlePayrollNav)}
      />
      <Footer />
    </div>
  );
};
export default Schedule;
