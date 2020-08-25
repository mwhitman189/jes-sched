import React, { useState, useEffect, useContext, useRef } from "react";
import CustomDnDCalendar from "./CustomDnDCalendar";
import { ThemeProvider } from "styled-components";
import { useReactToPrint } from "react-to-print";
import { protectAction } from "../helpers/utilities";
import { TeachersContext } from "../context/TeachersContext";
import { EventsContext } from "../context/EventsContext";
import { StudentsContext } from "../context/StudentsContext";
import { UserContext } from "../context/UserContext";
import theme from "../constants/styles";
import useFormState from "../hooks/useInputState";
import EventForm from "./EventForm";
import StaffForm from "./StaffForm";
import StudentForm from "./StudentForm";
import TeacherForm from "./TeacherForm";
import Snackbar from "./Snackbar";
import Payroll from "./Payroll";
import Footer from "./Footer";
import EventPopper from "./EventPopper";
import "react-big-calendar/lib/sass/styles.scss";
import "../styles/react-big-calendarStyles.scss";

const Schedule = () => {
  // Create a ref to use with React-to-print
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <LessonSchedule ref={componentRef} />
      <button onClick={handlePrint}>Print Schedule</button>
    </div>
  );
};

// Wrap the schedule in a class-based component for use with React-to-print
class LessonSchedule extends React.Component {
  render() {
    return <SchedulePrePrintBtn />;
  }
}

const SchedulePrePrintBtn = () => {
  const { getTeachers, addTeachingMins } = useContext(TeachersContext);
  const { events, editEvent, getEvents } = useContext(EventsContext);
  const { getStudents } = useContext(StudentsContext);
  const { user } = useContext(UserContext);

  const [formType, setFormType] = useState("");
  const [startTime, setStartTime] = useFormState(new Date());
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [absentees, setAbsentees] = useState([]);
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
    getTeachers();
    getStudents();
  }, []);

  useEffect(() => {
    addTeachingMins(events, monthStart, monthEnd);
  }, [events]);

  const moveEvent = ({ event, resourceId, start, end }) => {
    const updatedEvent = {
      ...event,
      resourceId: resourceId,
      start: start,
      end: end,
    };
    handleDoubleClick(updatedEvent);
  };

  const handleSelect = ({ start, resourceId }) => {
    setIsLoading(true);
    setStartTime(start);
    setSelectedTeacherId(resourceId);
    setFormType("event");
    setIsLoading(false);
  };

  const handleDoubleClick = (event) => {
    setIsLoading(true);
    setIsDetailView(false);
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

  const handleAddStudentNav = () => {
    setFormType("student");
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
      const updatedEvent = { ...event, isNewEvent: false };
      editEvent(updatedEvent);
    }
    setIsDetailView(!isDetailView);
    setAnchorEl(target.currentTarget);
    setSelectedEvent(event);
    setAbsentees(event.absentees);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        {isDetailView && (
          <EventPopper
            isOpen={isDetailView}
            anchorEl={anchorEl}
            selectedEvent={selectedEvent}
            absentees={absentees}
            setAbsentees={setAbsentees}
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
            selectedTeacherId={selectedTeacherId}
            absentees={absentees}
            setAbsentees={setAbsentees}
          />
        )}
        {formType === "teacher" && (
          <TeacherForm formType={formType} setFormType={setFormType} />
        )}
        {formType === "staff" && (
          <StaffForm formType={formType} setFormType={setFormType} />
        )}
        {formType === "student" && (
          <StudentForm formType={formType} setFormType={setFormType} />
        )}
        {formType === "payroll" && <Payroll setFormType={setFormType} />}
        <Snackbar msg={message} isOpen={isOpen} setIsOpen={setIsOpen} />
        <CustomDnDCalendar
          handleMove={protectAction(user, moveEvent)}
          handleSelect={protectAction(user, handleSelect)}
          handleDoubleClick={protectAction(user, handleDoubleClick)}
          handleAddTeacherNav={protectAction(user, handleAddTeacherNav)}
          handleAddStaffNav={protectAction(user, handleAddStaffNav)}
          handleAddStudentNav={protectAction(user, handleAddStudentNav)}
          handlePayrollNav={protectAction(user, handlePayrollNav)}
          handleOpenDetailView={handleSingleClick}
        />
        <Footer />
      </div>
    </ThemeProvider>
  );
};
export default Schedule;
