import { useState, useContext } from "react";
import { createNewEvents } from "../helpers/events";
import { UserContext } from "../context/UserContext";
import {
  getDbEvents,
  addDbEvents,
  editDbEvent,
  deleteDbEvent,
} from "../dbCalls";

export default function (initialEvents) {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState(initialEvents);
  const todaysDate = new Date().getTime();

  return {
    events,
    getEvents: () => {
      getDbEvents(todaysDate, setEvents, user);
    },
    addEvent: async function (event) {
      const newEvents = createNewEvents(event, true);
      addDbEvents(newEvents, user);
      getDbEvents(todaysDate, setEvents, user);
    },
    deleteEvent: async function (event) {
      deleteDbEvent(event, user);
      getDbEvents(todaysDate, setEvents, user);
    },
    editEvent: async function (editedEvent) {
      editDbEvent(editedEvent, user);
      getDbEvents(todaysDate, setEvents, user);
    },
  };
}
