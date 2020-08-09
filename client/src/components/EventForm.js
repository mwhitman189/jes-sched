import React, { useContext, useCallback } from "react";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import Form from "./templates/Form";
import FormInput from "./templates/FormInput";
import TextInput from "./templates/TextInput";
import Checkbox from "./templates/Checkbox";
import StyledSelect from "./templates/StyledSelect";
import MomentUtils from "@date-io/moment";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import BREAKPOINTS from "../constants/breakpoints";
import STYLES from "../constants/styles";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { validateRoom, validateTeacher } from "../validators";
import { TeachersContext } from "../context/TeachersContext";
import { StudentsContext } from "../context/StudentsContext";
import { EventsContext } from "../context/EventsContext";
import { checkForSameDate } from "../helpers/utilities";
import "flatpickr/dist/themes/airbnb.css";
import roomList from "../constants/rooms";
import lessonTypes from "../constants/lessonTypes";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    display: "inline",
    "& .MuiFormControl-root": {
      margin: "10px",
      width: "200px",
    },
  },
  recurSwitch: {
    position: "absolute",
    right: "1rem",
    top: "1rem",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  timePickerContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

const Dialog = styled.div`
  color: ${STYLES.color_primaryText};
  position: absolute;
  background-color: ${STYLES.color_primaryBackground};
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  margin: 0;
  top: 15%;
  left: 50%;
  flex-direction: column;
  transform: translate(-50%, -15%);
  padding: 10px;
  border-radius: 8px;
  background-color: ${STYLES.color_primaryBackground};
  z-index: 3;
  box-shadow: ${STYLES.shadow};
  min-height: 400px;
  @media (min-width: ${BREAKPOINTS.md}) {
    width: 600px;
  }
`;

const StyledFlatpickr = styled(Flatpickr)`
  color: ${STYLES.color_primaryText};
  height: 25px;
  border-radius: 4px;
  border: ${STYLES.color_secondaryBackground} solid 2px;
  box-shadow: ${STYLES.shadow};
`;

export default function EventForm(props) {
  const classes = useStyles();
  const { addTeachingMins } = useContext(TeachersContext);
  const { events, addEvent, editEvent, deleteEvent, deleteEvents } = useContext(
    EventsContext
  );
  const { teachers } = useContext(TeachersContext);
  const { students } = useContext(StudentsContext);
  const {
    formType,
    setFormType,
    event,
    startTime,
    setSelectedEvent,
    selectedTeacher,
    validateRoomAndResource,
  } = props;

  const [start, setStart] = useInputState(startTime);
  const [title, setTitle, resetTitle] = useInputState(event ? event.title : "");
  const [duration, setDuration, resetDuration] = useInputState(
    event ? event.duration : ""
  );
  const [resource, setResource, resetResource] = useInputState(
    event ? event.resourceId : selectedTeacher
  );
  const [room, setRoom, resetRoom] = useInputState(event ? event.room : "");
  const [eventType, setEventType, resetEventType] = useInputState(
    event ? event.type : ""
  );
  const [members, setMembers] = useInputState(event ? event.students : []);
  const [absentees, setAbsentees] = useInputState(event ? event.absentees : []);
  const [isRecurring, toggleIsRecurring] = useToggleState(false);
  const [travelTime, setTravelTime] = useInputState(0);
  const [isLoading, toggleIsLoading] = useToggleState(false);

  let teacherValidators = ["required"];
  let teacherValMsgs = ["Teacher Required"];
  let roomValidators = ["required"];
  let roomValMsgs = ["Room Required"];
  if (!event) {
    teacherValidators.push("teacherIsAvailable");
    teacherValMsgs.push("Teacher unavailable");
    roomValidators.push("roomIsAvailable");
    roomValMsgs.push("Room unavailable");
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // If an event does not exist, check whether the selected room is
  // available at the specified time
  ValidatorForm.addValidationRule("teacherIsAvailable", (teacher) => {
    return validateTeacher(events, teacher, start, duration);
  });

  // If an event does not exist, check whether the selected room is
  // available at the specified time
  ValidatorForm.addValidationRule("roomIsAvailable", (room) => {
    return validateRoom(events, room, start, duration);
  });

  const handleTimeChange = (date) => {
    setStart(date._d);
  };

  const hideForm = () => {
    resetForm();
    setFormType("");
  };

  const resetForm = () => {
    resetTitle();
    resetDuration();
    resetResource();
    resetRoom();
    resetEventType();
    toggleIsRecurring(false);
    setSelectedEvent("");
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);

    const id = uuidv4();
    const endTime = moment(start).add(duration, "m").toDate();
    addEvent({
      id: id,
      title: title,
      start: start,
      end: endTime,
      room: room,
      duration: parseInt(duration),
      resourceId: parseInt(resource),
      type: eventType,
      isRecurring: isRecurring,
      students: members,
      absentees: [],
      isLesson: true,
    });
    if (travelTime !== 0) {
      addEvent({
        id: id,
        title: "Travel",
        start: moment(start).subtract(travelTime, "m").toDate(),
        end: start,
        duration: parseInt(travelTime),
        resourceId: parseInt(resource),
        type: "trav",
        isRecurring: isRecurring,
        isLesson: false,
      });
      addEvent({
        id: id,
        title: "Return Travel",
        start: endTime,
        end: moment(endTime).add(travelTime, "m").toDate(),
        duration: parseInt(travelTime),
        resourceId: parseInt(resource),
        type: "trav",
        isRecurring: isRecurring,
        isLesson: false,
      });
    }
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleEditEvent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    validateRoomAndResource(e, resource, start);
    const id = e.id;
    const endTime = moment(start).add(duration, "m").toDate();
    const editedEvent = {
      ...event,
      title: title,
      start: start,
      end: endTime,
      room: room,
      duration: parseInt(duration),
      resourceId: parseInt(resource),
      type: eventType,
      isRecurring: isRecurring,
      students: members,
      absentees: absentees,
      isNewEvent: true,
    };
    editEvent(editedEvent);
    if (travelTime !== 0) {
      addEvent({
        id: id,
        title: "Travel",
        start: moment(start).subtract(travelTime, "m").toDate(),
        end: start,
        duration: parseInt(travelTime),
        resourceId: parseInt(resource),
        type: "trav",
        isRecurring: isRecurring,
        isLesson: false,
      });
      addEvent({
        id: id,
        title: "Return Travel",
        start: endTime,
        end: moment(endTime).add(travelTime, "m").toDate(),
        duration: parseInt(travelTime),
        resourceId: parseInt(resource),
        type: "trav",
        isRecurring: isRecurring,
        isLesson: false,
      });
    }
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleCancelEvent = (e) => {
    e.preventDefault();
    toggleIsLoading(true);
    let sdCancellation = checkForSameDate(event.start);
    const editedEvent = {
      ...event,
      isCancelled: true,
      isSameDayCancellation: sdCancellation,
    };
    editEvent(editedEvent);
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleDeleteEvent = () => {
    toggleIsLoading(true);
    deleteEvent(event);
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleDeleteEvents = () => {
    toggleIsLoading(true);
    deleteEvents(event);
    addTeachingMins(events, monthStart, monthEnd);
    toggleIsLoading(false);
    hideForm();
  };

  const handleToggleRecurrence = () => {
    toggleIsRecurring(!isRecurring);
  };

  const handleMembersChange = (selectedOption) => {
    setMembers(selectedOption);
  };

  return (
    <Dialog isOpen={formType === "event"}>
      <Form
        title={event ? "Edit Lesson" : "Add New Lesson"}
        submitAction={event ? handleEditEvent : handleAddEvent}
      >
        <FormInput label="Weekly Event" isCheckbox>
          <Checkbox
            name="isRecurring"
            isChecked={isRecurring}
            handleToggle={handleToggleRecurrence}
          />
        </FormInput>
        <FormInput label="Lesson Name">
          <TextInput name="title" value={title} setValue={setTitle} />
        </FormInput>
        <FormInput label="Start Time">
          <StyledFlatpickr
            id="time-picker"
            defaultValue={event ? event.start : ""}
            value={start}
            options={{
              enableTime: true,
              noCalendar: true,
              time_24hr: true,
              minTime: "9:00",
              maxTime: "21:00",
              minuteIncrement: 5,
            }}
          />
        </FormInput>
        <FormInput label="Lesson Duration">
          <TextInput name="duration" value={duration} setValue={setDuration} />
        </FormInput>
        <FormInput label="Teacher">
          <StyledSelect
            name="resource"
            value={resource || ""}
            getOptionValue={(option) => option.resourceId}
            options={teachers}
            onChange={setResource}
            placeholder="Select Teacher"
            getOptionLabel={(option) => option.name}
          />
        </FormInput>
        <FormInput label="Students">
          <StyledSelect
            options={students}
            getOptionLabel={(option) =>
              `${option.givenName} ${option.familyName}`
            }
            getOptionValue={(option) => option.label}
            isMulti
            onChange={handleMembersChange}
            placeholder="Add students"
            noOptionsMessage={() => "Student does not exist..."}
            isSearchable
          />
        </FormInput>
      </Form>
    </Dialog>
    // <Dialog
    //   open={formType === "event"}
    //   onClose={hideForm}
    //   aria-labelledby="form-dialog-title"
    //   // Allow TimePicker component to gain focus, preventing stack overflow
    //   disableEnforceFocus
    // >
    //   <ValidatorForm onSubmit={event ? handleEditEvent : handleAddEvent}>
    //     <DialogTitle id="form-dialog-title">New Lesson</DialogTitle>
    //     <DialogContent>

    //       <FormControl className={classes.formControl}>
    //         <SelectValidator
    //           classes={{ root: classes.root }}
    //           label="Room"
    //           InputLabelProps={{ shrink: true }}
    //           margin="dense"
    //           fullWidth
    //           id="room"
    //           value={room}
    //           onChange={setRoom}
    //           name="room"
    //           validators={roomValidators}
    //           errorMessages={roomValMsgs}
    //         >
    //           <MenuItem value="" />
    //           {roomList.map((r) => (
    //             <MenuItem key={`evtForm-room-${r}`} value={r}>
    //               {r}
    //             </MenuItem>
    //           ))}
    //         </SelectValidator>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <SelectValidator
    //           classes={{ root: classes.list }}
    //           margin="dense"
    //           label="Lesson Type"
    //           InputLabelProps={{ shrink: true }}
    //           fullWidth
    //           id="type"
    //           value={eventType}
    //           onChange={setEventType}
    //           name="type"
    //         >
    //           <MenuItem value="" />
    //           {lessonTypes.map((t) => (
    //             <MenuItem key={`evtForm-type-${t.shortName}`} value={t.type}>
    //               {t.name}
    //             </MenuItem>
    //           ))}
    //         </SelectValidator>
    //       </FormControl>
    //       <FormControl className={classes.formControl}>
    //         <TextValidator
    //           autoFocus
    //           margin="dense"
    //           id="travelTime"
    //           label="Travel Time"
    //           type="text"
    //           value={travelTime}
    //           onChange={setTravelTime}
    //           fullWidth
    //         />
    //       </FormControl>
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleDeleteEvent} color="secondary">
    //         Delete One
    //       </Button>
    //       <Button onClick={handleDeleteEvents} color="secondary">
    //         Delete All
    //       </Button>
    //       <Button onClick={handleCancelEvent} color="secondary">
    //         Cancel Lesson
    //       </Button>
    //       <Button onClick={hideForm} color="primary">
    //         Back
    //       </Button>
    //       <Button type="submit" color="primary">
    //         {event ? "Confirm Change" : "Add Lesson"}
    //       </Button>
    //     </DialogActions>
    //   </ValidatorForm>
    // </Dialog>
  );
}
