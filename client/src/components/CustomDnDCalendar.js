import React, { useContext } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { EventsContext } from "../context/EventsContext";
import { TeachersContext } from "../context/TeachersContext";
import { UserContext } from "../context/UserContext";
import { WorkWeek } from "./CustomViews";
import Toolbar from "./Toolbar";
import LessonEvent from "./LessonEvent";
import lessonTypes from "../constants/lessonTypes";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
const JapaneseHolidays = require("japanese-holidays");

function CustomDnDCalendar(props) {
  const {
    handleMove,
    handleSelect,
    handleDoubleClick,
    handleAddTeacherNav,
    handleAddStaffNav,
    handleAddStudentNav,
    handlePayrollNav,
    handleOpenDetailView,
  } = props;
  const { events } = useContext(EventsContext);
  const { teachers } = useContext(TeachersContext);
  const { user } = useContext(UserContext);

  // Search for user in teachers. If user is teacher, return teacher object
  // for use in conditional rendering of teaching minutes
  const teacher =
    user.user.role === "teacher" &&
    teachers.find((t) => t.email === user.user.email);

  // Limit displayed hours of the day
  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(20, 59, 59);

  // Style events based on event.value
  const eventStyleGetter = (event) => {
    // Hide a dummy event that fixes drag and drop bug
    if (event.hide) {
      return { style: { display: "none" } };
    }

    // Find the type of event, then provide the corresponding bgColor from the
    // type object
    const typeObj = lessonTypes.find((typeObj) => event.type === typeObj.value);
    let bgColor = "#000";

    if (typeObj === undefined) {
      return false;
    } else {
      bgColor = typeObj.bgColor;
    }

    let style = {
      backgroundColor: bgColor,
      color: "white",
      border: 0,
      display: "block",
      boxShadow: "",
    };

    // Add a shadow to new events only to indicate that they have not been viewed
    if (event.isNewEvent) {
      style.boxShadow = "2px 2px 2px 2px rgba(74,73,74,0.35)";
    }
    return {
      style: style,
    };
  };

  // Set the background color of holiday DayColumns to a different color
  const dayStyleGetter = (date) => {
    const styles = {
      backgroundColor: "#ffd9d9",
    };
    return JapaneseHolidays.isHoliday(date) && { style: styles };
  };

  return (
    <DragAndDropCalendar
      style={{ width: "100vw", maxHeight: "96vh" }}
      localizer={localizer}
      views={{ week: WorkWeek, day: true }}
      defaultView="week"
      events={events}
      onEventDrop={handleMove}
      startAccessor="start"
      endAccessor="end"
      resources={teacher ? [teacher] : teachers}
      resourceIdAccessor="resourceId"
      resourceTitleAccessor="resourceTitle"
      selectable
      onSelectEvent={handleOpenDetailView}
      onDoubleClickEvent={handleDoubleClick}
      eventPropGetter={eventStyleGetter}
      dayPropGetter={dayStyleGetter}
      invertResourcesAndDates
      displayOthersColumn={teacher ? false : true}
      step={5}
      timeslots={12}
      min={minTime}
      max={maxTime}
      onSelectSlot={handleSelect}
      components={{
        event: LessonEvent,
        toolbar: (props) => (
          <Toolbar
            {...props}
            handleAddTeacherNav={handleAddTeacherNav}
            handleAddStaffNav={handleAddStaffNav}
            handleAddStudentNav={handleAddStudentNav}
            handlePayrollNav={handlePayrollNav}
          />
        ),
      }}
      resizableAccessor={() => false}
    />
  );
}

export default CustomDnDCalendar;
