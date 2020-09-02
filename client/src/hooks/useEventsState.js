import { useState, useContext } from 'react';
import { createNewEvents } from '../helpers/events';
import { UserContext } from '../context/UserContext';
import {
  getDbEvents,
  addDbEvents,
  editDbEvent,
  deleteDbEvent,
  deleteDbEvents,
} from '../dbCalls';

export default function (initialEvents) {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState(initialEvents);
  const todaysDate = new Date();

  const getEventsFunc = () => getDbEvents(todaysDate, setEvents, user);

  return {
    events,
    getEvents: () => {
      getEventsFunc();
    },
    async addEvent(event) {
      const newEvents = createNewEvents(event, true);
      addDbEvents(newEvents, events, setEvents, getEventsFunc, user);
    },
    async deleteEvent(event) {
      deleteDbEvent(event, events, setEvents, user);
    },
    async deleteEvents(event) {
      deleteDbEvents(event, events, setEvents, user);
    },
    async editEvent(editedEvent) {
      editDbEvent(editedEvent, events, setEvents, user);
    },
  };
}
