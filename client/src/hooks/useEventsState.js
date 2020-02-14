import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { getRecurrences } from "../helperFunctions";

export default initialEvents => {
  const [events, setEvents] = useState(initialEvents);
  const JapaneseHolidays = require("japanese-holidays");

  return {
    events,
    getEvents: async () => {
      return await axios
        .get("/lessons/")
        .then(res => {
          if (res.data.length > 0) {
            res.data.map(event => {
              event.start = new Date(event.start);
              event.end = new Date(event.end);
            });
            setEvents([...res.data, events[0]]);
          }
        })
        .catch(err => console.log(err));
    },
    addEvent: async event => {
      const newEvents = [];
      if (event.recur === true) {
        const recurrences = getRecurrences(event);
        recurrences.map(r => {
          const newEvent = {
            ...event,
            start: r,
            end: moment(r)
              .add(event.duration, "m")
              .toDate(),
            isNewEvent: false
          };
          if (JapaneseHolidays.isHoliday(r)) {
            newEvent.isHoliday = true;
          }
          newEvents.push(newEvent);
        });
      }
      if (JapaneseHolidays.isHoliday(event.start)) {
        event = { ...event, isHoliday: true };
      }
      event = { ...event, isNewEvent: true };
      newEvents.push(event);
      await axios
        .post("/lessons/add", newEvents)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
      return this.getEvents(events, setEvents);
    },
    deleteEvent: async event => {
      const newEvents = events.filter(evt => evt._id !== event._id);
      setEvents(newEvents);
      return await axios
        .delete(`/lessons/delete/${event._id}`)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    },
    editEvent: async (event, editedEvent) => {
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
};
