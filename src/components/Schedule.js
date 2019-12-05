import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { WorkWeek } from "./CustomView";
import myEventsList from "../events";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const Schedule = props => {
  const [events, setEvents] = useState(myEventsList);
  console.log(myEventsList);

  // Limit displayed hours of the day
  const minTime = new Date();
  minTime.setHours(9, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(21, 0, 0);

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
        startAccessor="start"
        endAccessor="end"
        resources={[
          { resourceId: 0, resourceTitle: "Martin" },
          { resourceId: 1, resourceTitle: "Tim" },
          { resourceId: 2, resourceTitle: "Sarah" },
          { resourceId: 3, resourceTitle: "Miles" }
        ]}
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
