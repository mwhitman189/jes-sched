import { useState, useContext } from "react";
import axios from "axios";
import { addNewEvent } from "../helperFunctions";
import { UserContext } from "../context/UserContext";
import { tokenConfig } from "../reducers/loadUserReducer";

export default function (initialEvents) {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState(initialEvents);

  const testObj = {
    events,
    getEvents: async function (dateTime) {
      await axios
        .get("/api/lessons", tokenConfig(user))
        .then((res) => {
          if (res.data.length > 0) {
            res.data.forEach((event) => {
              event.start = new Date(event.start);
              event.end = new Date(event.end);
              // Check if last recurrence, and if so, create two more months of recurrences
              if (event.isLast) {
                if (dateTime >= event.start.getTime()) {
                  addNewEvent(event);
                }
              }
            });
            return setEvents(res.data);
          }
        })
        .catch((err) => console.log(err));
    },
    addEvent: async function (event) {
      const newEvents = addNewEvent(event);
      setEvents([...events, ...newEvents]);
      await axios
        .post("/api/lessons/add", newEvents, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    },
    deleteEvent: async function (event) {
      const newEvents = events.filter((evt) => evt._id !== event._id);
      setEvents(newEvents);
      await axios
        .delete(`/api/lessons/delete/${event._id}`, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    },
    editEvent: async function (event, editedEvent) {
      const idx = events.findIndex((e) => e._id === event._id);
      const nextEvents = [...events];

      nextEvents.splice(idx, 1, editedEvent);
      setEvents(nextEvents);
      await axios
        .put(`/api/lessons/update/${event._id}`, editedEvent, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    },
  };

  return testObj;
}
