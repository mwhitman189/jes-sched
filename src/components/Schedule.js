import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";

import { WorkWeek } from "./CustomView";
import EventForm from "./EventForm";
import useToggle from "../hooks/useToggle";
import useFormState from "../hooks/useFormState";
import { validateRoom, validateTeacher } from "../validators";
import eventsList from "../events";
import teachersList from "../teachers";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Schedule = () => {
  const [events, setEvents] = useState(eventsList);
  const [teacherList, setTeacherList] = useState(teachersList);
  const [startTime, handleStartTimeChange, startTimeReset] = useFormState(
    new Date()
  );
  const [isOpen, toggleIsOpen] = useToggle(false);

  // Limit displayed hours of the day
  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(21, 0, 0);

  useEffect(() => {
    addTeachingMins();
  }, [events]);

  const addTeachingMins = () => {
    teacherList.forEach(teacher => {
      return (teacher.teachingMins = 0);
    });
    events.forEach(e => {
      const index = teacherList.findIndex(
        teacher => teacher.resourceId === e.resourceId
      );
      // Reset teaching minutes to "0", then add all teaching minutes to the corresponding instructor
      teacherList[index].teachingMins += parseInt(e.duration);
      setTeacherList([...teacherList]);
      teacherList[
        index
      ].resourceTitle = `${teacherList[index].name} ${teacherList[index].teachingMins}`;
    });
  };

  // TODO: Add a function to open the new class form with the current data populated, for validation
  const moveEvent = ({ event, resourceId, start, end }) => {
    const idx = events.indexOf(event);

    const updatedEvent = { ...event, resourceId, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setEvents(nextEvents);
    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  };

  const handleUpdate = ({ event, resourceId, start, end }) => {
    if (!validateRoom(events, event.room, start, parseInt(event.duration))) {
    } else if (
      !validateTeacher(
        events,
        event.resourceId,
        start,
        parseInt(event.duration)
      )
    ) {
    } else {
      moveEvent({
        event,
        resourceId,
        start,
        end
      });
    }
  };

  const handleSelect = ({ start }) => {
    toggleIsOpen();
    handleStartTimeChange(start);
  };

  const addEvent = newEvent => {
    setEvents([...events, newEvent]);
  };

  const handleAddEvent = newEvent => {
    addEvent(newEvent);
    toggleIsOpen();
  };

  return (
    <div>
      {isOpen && (
        <EventForm
          isOpen={isOpen}
          toggleIsOpen={toggleIsOpen}
          addEvent={handleAddEvent}
          addTeachingMins={addTeachingMins}
          events={events}
          teacherList={teacherList}
          startTime={startTime}
          handleStartTimeChange={handleStartTimeChange}
          startTimeReset={startTimeReset}
        />
      )}
      <DragAndDropCalendar
        style={{ width: "95vw", maxHeight: "100%" }}
        localizer={localizer}
        views={{ week: WorkWeek, day: true }}
        defaultView="day"
        events={events}
        onEventDrop={handleUpdate}
        startAccessor="start"
        endAccessor="end"
        resources={teacherList}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        selectable
        eventPropGetter={
          // Hide a dummy event that fixes drag and drop bug
          event => {
            if (event.hide) {
              return { style: { display: "none" } };
            }
          }
        }
        step={30}
        timeslots={2}
        min={minTime}
        max={maxTime}
        onSelectSlot={handleSelect}
      />
    </div>
  );
};
export default Schedule;
