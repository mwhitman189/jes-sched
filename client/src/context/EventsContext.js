import React, { createContext } from 'react';
import useEventsState from '../hooks/useEventsState';

const defaultEvents = [
  {
    id: 1,
    title: 'Dummy Event to fix drag and drop bug',
    start: new Date(),
    end: new Date(),
    room: 2,
    duration: 0,
    resourceId: 1,
    isHidden: true,
    students: [],
    attendees: [],
  },
];

export const EventsContext = createContext();

export function EventsProvider(props) {
  const events = useEventsState(defaultEvents);

  return (
    <EventsContext.Provider value={events}>
      {props.children}
    </EventsContext.Provider>
  );
}
