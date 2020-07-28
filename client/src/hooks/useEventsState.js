import { useState, useContext } from "react";
import { createNewEvents } from "../helpers/events";
import { UserContext } from "../context/UserContext";
import {
  getDbEvents,
  addDbEvents,
  editDbEvent,
  deleteDbEvent,
  deleteDbEvents,
} from "../dbCalls";

export default function (initialEvents) {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState(initialEvents);
  const todaysDate = new Date();

  const getEventsFunc = () => {
    getDbEvents(todaysDate, setEvents, user);
  };

  return {
    events,
    getEvents: () => {
      getEventsFunc();
    },
    addEvent: async function (event) {
      const newEvents = createNewEvents(event, true);
      addDbEvents(newEvents, user);
      getEventsFunc();
    },
    deleteEvent: async function (event) {
      deleteDbEvent(event, user);
      getEventsFunc();
    },
    deleteEvents: async function (event) {
      deleteDbEvents(event, user);
      getEventsFunc();
    },
    editEvent: async function (editedEvent) {
      editDbEvent(editedEvent, user);
      getEventsFunc();
    },
  };
}
