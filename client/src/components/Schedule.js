import React, { useState, useEffect, useContext } from "react";
import CustomDnDCalendar from "./CustomDnDCalendar";
import { protectAction } from "../helperFunctions";
import { validateRoom, validateTeacher } from "../validators";
import { TeachersContext } from "../context/TeachersContext";
import { EventsContext } from "../context/EventsContext";
import { StudentsContext } from "../context/StudentsContext";
import { UserContext } from "../context/UserContext";
import useFormState from "../hooks/useInputState";
import EventForm from "./EventForm";
import StaffForm from "./StaffForm";
import TeacherForm from "./TeacherForm";
import CustomizedSnackbars from "./CustomizedSnackbars";
import Payroll from "./Payroll";
import Footer from "./Footer";
import EventPopper from "./EventPopper";
import "react-big-calendar/lib/sass/styles.scss";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

const Schedule = () => {
  const { getTeachers, addTeachingMins } = useContext(TeachersContext);
  const { events, editEvent, getEvents } = useContext(EventsContext);
  const { getStudents } = useContext(StudentsContext);
  const { user } = useContext(UserContext);

  const [formType, setFormType] = useState("");
  const [startTime, setStartTime] = useFormState(new Date());
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  useEffect(() => {
    // Pass current dateTime to compare to recurrence events to check if a new batch of recurrences
    // is needed
    getEvents(now.getTime());
    getTeachers(events);
    getStudents();
  }, []);

  useEffect(() => {
    addTeachingMins(events, monthStart, monthEnd);
  }, [events]);

  const moveEvent = ({ event, resourceId, start, end }) => {
    const setdEvent = { ...event, resourceId, start, end };
    handleDoubleClick(setdEvent);
  };

  const validateRoomAndResource = (event, resourceId, start) => {
    const idx = events.indexOf(event);
    const otherEvents = [...events.slice(0, idx), ...events.slice(idx + 1)];

    if (
      !validateRoom(otherEvents, event.room, start, parseInt(event.duration))
    ) {
      setSelectedEvent(event);
      handleToggleSnackbar("Room Conflict. Please choose another room or time");
      return false;
    }
    if (
      !validateTeacher(otherEvents, resourceId, start, parseInt(event.duration))
    ) {
      setSelectedEvent(event);
      handleToggleSnackbar(
        "Teacher Conflict. Please choose another teacher or time"
      );
      return false;
    }
    return true;
  };

  // Add validation to a move upon dropping an event with drag and drop
  // If there is a conflict, prevent the move and flash a conflict snackbar
  const handleMove = ({ event, resourceId, start, end }) => {
    setIsLoading(true);
    if (validateRoomAndResource(event, resourceId, start)) {
      moveEvent({
        event,
        resourceId,
        start,
        end,
      });
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const handleSelect = ({ start, resourceId }) => {
    setIsLoading(true);
    setStartTime(start);
    setSelectedTeacher(resourceId);
    setFormType("event");
    setIsLoading(false);
  };

  const handleDoubleClick = (event) => {
    setIsLoading(true);
    setStartTime(event.start);
    setSelectedEvent(event);
    setFormType("event");
    setIsLoading(false);
  };

  const handleAddTeacherNav = () => {
    setFormType("teacher");
  };

  const handleAddStaffNav = () => {
    setFormType("staff");
  };

  const handleToggleSnackbar = (msg) => {
    setMessage(msg);
    setIsOpen(true);
  };

  const handlePayrollNav = () => {
    setFormType("payroll");
  };

  const handleSingleClick = (event, target) => {
    if (user.user.role === "teacher") {
      const setdEvent = { ...event, isNewEvent: false };
      editEvent(setdEvent);
    }
    setIsDetailView(!isDetailView);
    setAnchorEl(target.currentTarget);
    setSelectedEvent(event);
    setAttendees(event.attendants);
  };

  return (
    <div>
      {isDetailView && (
        <EventPopper
          isOpen={isDetailView}
          anchorEl={anchorEl}
          selectedEvent={selectedEvent}
          attendees={attendees}
          setAttendees={setAttendees}
        />
      )}
      {formType === "event" && (
        <EventForm
          formType={formType}
          setFormType={setFormType}
          startTime={startTime}
          setStartTime={setStartTime}
          event={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          selectedTeacher={selectedTeacher}
          validateRoomAndResource={validateRoomAndResource}
          attendees={attendees}
          setAttendees={setAttendees}
        />
      )}
      {formType === "teacher" && (
        <TeacherForm formType={formType} setFormType={setFormType} />
      )}
      {formType === "staff" && (
        <StaffForm formType={formType} setFormType={setFormType} />
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
        handleAddStaffNav={protectAction(user, handleAddStaffNav)}
        handlePayrollNav={protectAction(user, handlePayrollNav)}
        handleOpenDetailView={handleSingleClick}
      />
      <Footer />
    </div>
  );
};
export default Schedule;
