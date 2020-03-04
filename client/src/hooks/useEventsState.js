import { useState } from "react";
import axios from "axios";
import { addNewEvent } from "../helperFunctions";

export default function(initialEvents) {
  const [events, setEvents] = useState(initialEvents);

  const testObj = {
    events,
    getEvents: async function(dateTime) {
      return await axios
        .get("/lessons/")
        .then(res => {
          if (res.data.length > 0) {
            res.data.forEach(event => {
              event.start = new Date(event.start);
              event.end = new Date(event.end);
              // Check if last recurrence, and if so, create two more months of recurrences
              if (event.isLast) {
                if (dateTime >= event.start.getTime()) {
                  addNewEvent(event);
                }
              }
            });
            return setEvents([...res.data, events[0]]);
          }
        })
        .catch(err => console.log(err));
    },
    addEvent: async function(event) {
      const newEvents = addNewEvent(event);
      setEvents([...events, ...newEvents]);
      await axios
        .post("/lessons/add", newEvents)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    },
    deleteEvent: async function(event) {
      const newEvents = events.filter(evt => evt._id !== event._id);
      setEvents(newEvents);
      return await axios
        .delete(`/lessons/delete/${event._id}`)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    },
    editEvent: async function(event, editedEvent) {
      const idx = events.findIndex(e => e._id === event._id);
      const nextEvents = [...events];

      nextEvents.splice(idx, 1, editedEvent);
      setEvents(nextEvents);
      return await axios
        .put(`/lessons/update/${event._id}`, editedEvent)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    }
  };

  return testObj;
}
