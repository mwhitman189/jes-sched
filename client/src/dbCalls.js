import axios from "axios";
import { tokenConfig } from "./reducers/loadUserReducer";
import { createNewEvents } from "./helpers/events";

// ** Auth **

// ** Events **
const getDbEvents = async (dateTime, setEvents, user) => {
  await axios
    .get("/api/events", tokenConfig(user))
    .then((res) => {
      res.data.forEach((event) => {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        if (event.isRecurring) {
          // Check if the event is the last recurrence, and if so, create one more month
          // of recurrences
          if (
            dateTime >=
            new Date(dateTime.getFullYear(), dateTime.getMonth(), 28)
          ) {
            const newEvents = createNewEvents(event, false);
            res.data = [...res.data, ...newEvents];
          }
        }
      });
      return setEvents(res.data);
    })
    .catch((err) => console.log(err));
};

const addDbEvents = async (newEvents, user) => {
  await axios
    .post("/api/events/add", newEvents, tokenConfig(user))
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

const editDbEvent = async (editedEvent, user) => {
  await axios
    .put(
      `/api/events/update/${editedEvent._id}`,
      editedEvent,
      tokenConfig(user)
    )
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

const deleteDbEvent = async (event, user) => {
  await axios
    .delete(`/api/events/delete/one/${event._id}`, tokenConfig(user))
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

const deleteDbEvents = async (event, user) => {
  await axios
    .delete(`/api/events/delete/all/${event.id}`, tokenConfig(user))
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

// ** Payments **
const addDbPayment = async (newPayment, user) => {
  return await axios
    .post(`api/payments/add`, newPayment, tokenConfig(user))
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

// ** Staff **

// ** Students **

// ** Teachers **
const getDbTeachers = async (setTeachers, user) => {
  await axios
    .get("/api/teachers", tokenConfig(user))
    .then((res) => {
      if (res.data.length > 0) {
        setTeachers(res.data);
      }
    })
    .catch((err) => console.log(err));
};

const editDbTeacher = async (updatedTeacher, user) => {
  await axios
    .put(
      `/api/teachers/update/${updatedTeacher._id}`,
      updatedTeacher,
      tokenConfig(user)
    )
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

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
};
