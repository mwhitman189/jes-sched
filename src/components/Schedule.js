import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { WorkWeek } from "./CustomView";
import eventsList from "../events";
import teachersList from "../teachers";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Schedule = props => {
  const [events, setEvents] = useState(eventsList);
  const [teacherData, setTeacherData] = useState(teachersList);
  const [didChange, setDidChange] = useState(false);

  // Limit displayed hours of the day
  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(21, 0, 0);

  const addTeachingMins = () => {
    for (let teacher in teacherData) {
      teacherData[teacher].teachingMins = 0;
    }
    events.forEach(e => {
      // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
      teacherData[e.resourceId].teachingMins += e.duration;
      setTeacherData([...teacherData]);
      teacherData[e.resourceId].resourceTitle = `${
        teacherData[e.resourceId].name
      } ${teacherData[e.resourceId].teachingMins}`;
    });
  };

  const moveEvent = ({
    event,
    resourceId,
    start,
    end,
    isAllDay: droppedOnAllDaySlot
  }) => {
    const idx = events.indexOf(event);
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, resourceId, start, end, allDay };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  const handleUpdate = ({
    event,
    resourceId,
    start,
    end,
    isAllDay: droppedOnAllDaySlot
  }) => {
    moveEvent({
      event,
      resourceId,
      start,
      end,
      isAllDay: droppedOnAllDaySlot
    });
    setDidChange(true);
  };

  useEffect(() => {
    addTeachingMins();
    setDidChange(false);
  }, [didChange]);

  // Style events based on event.type
  const eventStyleGetter = event => {
    let hexColor;
    switch (event.type) {
      case "pl":
        hexColor = "309632";
        break;
      case "kids":
        hexColor = "c47900";
        break;
      case "gs":
        hexColor = "52167d";
        break;
      case "prem":
        hexColor = "781419";
        break;
      default:
        hexColor = "3767a6";
        break;
    }

    let backgroundColor = "#" + hexColor;
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
      <DragAndDropCalendar
        style={{ width: "95vw", maxHeight: "100%" }}
        localizer={localizer}
        views={{ week: WorkWeek, day: true }}
        defaultView="day"
        events={events}
        onEventDrop={handleUpdate}
        startAccessor="start"
        endAccessor="end"
        resources={teacherData}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        selectable
        eventPropGetter={eventStyleGetter}
        step={30}
        timeslots={2}
        min={minTime}
        max={maxTime}
      />
    </div>
  );
};
export default Schedule;
