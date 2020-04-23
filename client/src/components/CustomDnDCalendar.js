import React, { useContext } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { EventsContext } from "../context/EventsContext";
import { TeachersContext } from "../context/TeachersContext";
import { UserContext } from "../context/UserContext";
import { WorkWeek } from "./CustomViews";
import LessonEvent from "./LessonEvent";
import CustomToolbar from "./CustomToolbar";
import "react-big-calendar/lib/sass/toolbar.scss";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

function CustomDnDCalendar(props) {
  const {
    handleMove,
    handleSelect,
    handleDoubleClick,
    handleAddTeacherNav,
    handlePayrollNav,
  } = props;
  const { events, editEvent } = useContext(EventsContext);
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

  // Style events based on event.type
  const eventStyleGetter = (event) => {
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
        hexColor = "#00fca5";
        break;
      case "el":
        hexColor = "#02bd7b";
        break;
      case "lint":
        hexColor = "#018256";
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
      display: "block",
      boxShadow: "",
    };

    if (event.isNewEvent) {
      style.boxShadow = "2px 2px 2px 2px rgba(74,73,74,0.35)";
    }
    return {
      style: style,
    };
  };

  const handleSingleClick = (event) => {
    const updatedEvent = { ...event, isNewEvent: false };
    editEvent(event, updatedEvent);
  };

  return (
    <DragAndDropCalendar
      style={{ width: "100vw", maxHeight: "96vh" }}
      localizer={localizer}
      views={{ week: WorkWeek }}
      defaultView="week"
      events={events}
      onEventDrop={handleMove}
      startAccessor="start"
      endAccessor="end"
      resources={teacher ? [teacher] : teachers}
      resourceIdAccessor="resourceId"
      resourceTitleAccessor="resourceTitle"
      selectable
      onSelectEvent={handleSingleClick}
      onDoubleClickEvent={handleDoubleClick}
      eventPropGetter={eventStyleGetter}
      step={5}
      timeslots={12}
      min={minTime}
      max={maxTime}
      onSelectSlot={handleSelect}
      components={{
        event: LessonEvent,
        toolbar: (props) => (
          <CustomToolbar
            {...props}
            handleAddTeacherNav={handleAddTeacherNav}
            handlePayrollNav={handlePayrollNav}
          />
        ),
      }}
      resizableAccessor={() => false}
    />
  );
}

export default CustomDnDCalendar;
