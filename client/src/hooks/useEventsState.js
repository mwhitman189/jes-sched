import { useState, useContext } from "react";
import axios from "axios";
import { addNewEvent, getRecurrences } from "../helperFunctions";
import { UserContext } from "../context/UserContext";
import { tokenConfig } from "../reducers/loadUserReducer";

export default function (initialEvents) {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState(initialEvents);

  return {
    events,
    getEvents: async function (dateTime) {
      await axios
        .get("/api/lessons", tokenConfig(user))
        .then((res) => {
          res.data.forEach((event) => {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
            // Check if last recurrence, and if so, create two more months of recurrences
            if (event.isLast) {
              if (dateTime >= event.start.getTime()) {
                const newEvents = addNewEvent(event);
                res.data = [...res.data, newEvents];
              }
            }
          });
          return setEvents(res.data);
        })
        .catch((err) => console.log(err));
    },
    addEvent: async function (event) {
      await axios
        .post("/api/lessons/add", newEvents, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      const newEvents = addNewEvent(event);
      const updatedEvents = [...events, newEvents];
      setEvents(updatedEvents);
    },
    deleteEvent: async function (event) {
      await axios
        .delete(`/api/lessons/delete/${event._id}`, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      const updatedEvents = events.filter((evt) => evt._id !== event._id);
      setEvents(updatedEvents);
    },
    editEvent: async function (event, editedEvent) {
      await axios
        .put(`/api/lessons/update/${event._id}`, editedEvent, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      const idx = events.findIndex((evt) => evt._id === event._id);
      const updatedEvents = [...events];
      updatedEvents.splice(idx, 1, editedEvent);
      setEvents(updatedEvents);
    },
  };
}
