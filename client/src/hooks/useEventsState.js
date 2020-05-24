import { useState, useContext } from "react";
import axios from "axios";
import { addNewEvent } from "../helperFunctions";
import { UserContext } from "../context/UserContext";
import { tokenConfig } from "../reducers/loadUserReducer";

export default function (initialEvents) {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState(initialEvents);
  const todaysDate = new Date().getTime();

  const getEvents = async (dateTime) => {
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
  };

  return {
    events,
    getEvents: () => {
      getEvents(todaysDate);
    },
    addEvent: async function (event) {
      const newEvents = addNewEvent(event);
      await axios
        .post("/api/lessons/add", newEvents, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      getEvents(todaysDate);
    },
    deleteEvent: async function (event) {
      await axios
        .delete(`/api/lessons/delete/${event._id}`, tokenConfig(user))
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      getEvents(todaysDate);
    },
    editEvent: async function (editedEvent) {
      await axios
        .put(
          `/api/lessons/update/${editedEvent._id}`,
          editedEvent,
          tokenConfig(user)
        )
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
      getEvents(todaysDate);
    },
  };
}
