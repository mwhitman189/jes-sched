import axios from 'axios'
import { tokenConfig } from './reducers/loadUserReducer'
import { createNewEvents } from './helpers/events'

// ** Auth **

// ** Events **
const getDbEvents = (dateTime, setEvents, user) => {
  axios
    .get('/api/events', tokenConfig(user))
    .then((res) => {
      res.data.forEach((event) => {
        event.start = new Date(event.start)
        event.end = new Date(event.end)
        if (event.isLast) {
          // Check if the event is the last recurrence, and if so, create one more month
          // of recurrences
          if (
            dateTime
            >= new Date(dateTime.getFullYear(), dateTime.getMonth(), 28)
          ) {
            const newEvents = createNewEvents(event, false)
            res.data = [ ...res.data, ...newEvents ]
          }
        }
      })
      return setEvents(res.data)
    })
    .catch((err) => console.log(err))
}

const addDbEvents = (
  newEvents,
  events,
  setEvents,
  getEventsFunc,
  user,
) => {
  axios
    .post('/api/events/add', newEvents, tokenConfig(user))
    .then((res) => {
      getEventsFunc()
      return setEvents([ ...events, ...newEvents ])
    })
    .catch((err) => console.log(err))
}

const editDbEvent = (editedEvent, events, setEvents, user) => {
  axios
    .put(
      `/api/events/update/${editedEvent._id}`,
      editedEvent,
      tokenConfig(user),
    )
    .then((res) => {
      const idx = events.findIndex((e) => e._id === editedEvent._id)
      return setEvents([
        ...events.slice(0, idx),
        editedEvent,
        ...events.slice(idx + 1),
      ])
    })
    .catch((err) => console.log(err))
}

const deleteDbEvent = (event, events, setEvents, user) => {
  axios
    .delete(`/api/events/delete/one/${event._id}`, tokenConfig(user))
    .then((res) => setEvents(events.filter((e) => e._id !== event._id)))
    .catch((err) => console.log(err))
}

const deleteDbEvents = (event, events, setEvents, user) => {
  axios
    .delete(`/api/events/delete/all/${event.id}`, tokenConfig(user))
    .then((res) => {
      const today = new Date().setHours(24)
      // Only delete events with the event ID if they occur after today's date
      return setEvents(
        events.filter((e) => e.id !== event.id || e.start < today),
      )
    })
    .catch((err) => console.log(err))
}

// ** Payments **
const addDbPayment = (newPayment, user) => axios
  .post('api/payments/add', newPayment, tokenConfig(user))
  .then((res) => console.log(res.data))
  .catch((err) => console.log(err))

// ** Staff **

// ** Students **

// ** Teachers **
const getDbTeachers = (setTeachers, user) => {
  axios
    .get('/api/teachers', tokenConfig(user))
    .then((res) => {
      if (res.data.length > 0) {
        return setTeachers(res.data)
      }
    })
    .catch((err) => console.log(err))
}

const editDbTeacher = (updatedTeacher, user) => {
  axios
    .put(
      `/api/teachers/update/${updatedTeacher._id}`,
      updatedTeacher,
      tokenConfig(user),
    )
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err))
}

// ** Users **

export {
  addDbPayment,
  getDbEvents,
  addDbEvents,
  editDbEvent,
  deleteDbEvent,
  deleteDbEvents,
  getDbTeachers,
  editDbTeacher,
}
