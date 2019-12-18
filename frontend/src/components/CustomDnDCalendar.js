import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";

import { WorkWeek } from "./CustomView";
import LessonEvent from "./LessonEvent";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const CustomDnDCalendar = props => {
  const {
    handleMove,
    handleSelect,
    handleDoubleClick,
    events,
    teachers
  } = props;

  // Limit displayed hours of the day
  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(21, 0, 0);

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
      display: "block"
    };
    return {
      style: style
    };
  };

  return (
    <DragAndDropCalendar
      style={{ width: "100vw", maxHeight: "100vh" }}
      localizer={localizer}
      views={{ week: WorkWeek, day: true }}
      defaultView="day"
      events={events}
      onEventDrop={handleMove}
      startAccessor="start"
      endAccessor="end"
      resources={teachers}
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
  );
};

export default CustomDnDCalendar;
