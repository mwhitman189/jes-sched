import React, { useState, useContext, useEffect } from "react";
import moment from "moment";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { checkForSameDate } from "../helpers/utilities";
import roomList from "../constants/rooms";
import lessonTypes from "../constants/lessonTypes";
import Form from "./templates/Form";
import FormInput from "./templates/FormInput";
import TextInput from "./templates/TextInput";
import Checkbox from "./templates/Checkbox";
import StyledSelect from "./templates/StyledSelect";
import useInputState from "../hooks/useInputState";
import useToggleState from "../hooks/useToggleState";
import { validateRoom, validateTeacher } from "../validators";
import { TeachersContext } from "../context/TeachersContext";
import { StudentsContext } from "../context/StudentsContext";
import { EventsContext } from "../context/EventsContext";

const Dialog = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  position: absolute;
  background-color: ${(props) => props.theme.colors.primaryBackground};
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  margin: 0;
  top: 15%;
  left: 50%;
  flex-direction: column;
  justify-content: space-between;
  transform: translate(-50%, -15%);
  padding: 10px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.primaryBackground};
  z-index: 10;
  box-shadow: ${(props) => props.theme.effects.shadow};
  height: 400px;
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    width: 600px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledFlatpickr = styled(Flatpickr)`
  color: ${(props) => props.theme.colors.primaryText};
  height: 25px;
  border-radius: 4px;
  border: ${(props) => props.theme.colors.secondaryBackground} solid 2px;
  box-shadow: ${(props) => props.theme.effects.shadow};
`;

const ButtonGroup = styled.div`
  margin: 30px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  flex: 1 1 0px;
  padding: 0;
  flex-direction: row;
`;

const Button = styled.button`
  display: ${(props) => props.theme.btnStyles.display};
  cursor: ${(props) => props.theme.btnStyles.cursor};
  justify-content: ${(props) => props.theme.btnStyles.justifyContent};
  align-items: ${(props) => props.theme.btnStyles.alignItems};
  font-weight: ${(props) => props.theme.btnStyles.fontWeight};
  text-transform: ${(props) => props.theme.btnStyles.textTransform};
  color: ${(props) => props.theme.btnStyles.color};
  background: ${(props) => (props.background ? props.background : "#4287f5")};
  border: ${(props) => props.theme.btnStyles.border};
  border-radius: ${(props) => props.theme.btnStyles.borderRadius};
  height: ${(props) => props.theme.btnStyles.height};
  margin: ${(props) => props.theme.btnStyles.margin};
  width: ${(props) => props.theme.btnStyles.width};
`;

const SubmitButton = styled(Button)`
  ${(props) =>
    props.disabled
      ? "opacity: .4; cursor: not-allowed"
      : "opacity: 1; cursor: pointer"};
`;

export default function EventForm(props) {
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
    selectedTeacherId,
  } = props;

  const resourceFromId = teachers.find(
    (t) => t.resourceId === (event.resourceId || selectedTeacherId)
  );

  const roomOption = event ? { label: event.room, value: event.room } : "";
  const eventTypeOption = lessonTypes.find((t) => t.value === event.type);

  const [start, setStart] = useInputState(startTime);
  const [title, setTitle, resetTitle] = useInputState(event ? event.title : "");

  const [duration, setDuration, resetDuration] = useInputState(
    event ? event.duration : ""
  );

  const [resource, setResource, resetResource] = useInputState(
    resourceFromId ? resourceFromId : ""
  );

  const [room, setRoom, resetRoom] = useInputState(roomOption);
  const [eventType, setEventType, resetEventType] = useInputState(
    eventTypeOption
  );
  const [members, setMembers] = useInputState(event ? event.students : []);
  const [absentees, setAbsentees] = useInputState(event ? event.absentees : []);
  const [isRecurring, toggleIsRecurring] = useToggleState(false);
  const [travelTime, setTravelTime] = useInputState("");
  const [errors, setErrors] = useState({});
  const [isLoading, toggleIsLoading] = useToggleState(false);

  const isSubmitDisabled =
    errors.titleError ||
    errors.durationError ||
    errors.resourceError ||
    errors.roomError ||
    errors.eventTypeError;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // ***Form Validation***
  useEffect(() => {
    // Event title
    if (title === "") {
      setErrors((prevState) => ({
        ...prevState,
        titleError: "Lesson name required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, titleError: "" }));
    }
  }, [title]);

  useEffect(() => {
    // Event duration
    if (duration === "") {
      setErrors((prevState) => ({
        ...prevState,
        durationError: "Duration required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, durationError: "" }));
    }
  }, [duration]);

  useEffect(() => {
    // Event type
    if (eventType === "") {
      setErrors((prevState) => ({
        ...prevState,
        eventTypeError: "Lesson type required",
      }));
    } else {
      setErrors((prevState) => ({ ...prevState, eventTypeError: "" }));
    }
  }, [eventType]);

  useEffect(() => {
    // Event resource
    if (resource === "") {
      setErrors((prevState) => ({
        ...prevState,
        resourceError: "Lesson name required",
      }));
    } else {
      // Set the resourceId to the new value
      if (event) event.resourceId = resource.resourceId;

      if (!validateTeacher(events, event)) {
        setErrors((prevState) => ({
          ...prevState,
          resourceError: "Teacher conflict",
        }));
      } else {
        setErrors((prevState) => ({ ...prevState, resourceError: "" }));
      }
    }
  }, [resource]);

  useEffect(() => {
    // Event room
    if (room === "") {
      setErrors((prevState) => ({
        ...prevState,
        roomError: "Room required",
      }));
    } else {
      // Set the room to the new value
      if (event) event.room = room.value;

      if (!validateRoom(events, event)) {
        setErrors((prevState) => ({
          ...prevState,
          roomError: "Room conflict",
        }));
      } else {
        setErrors((prevState) => ({ ...prevState, roomError: "" }));
      }
    }
  }, [room]);
  // ***End Form Validation***

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
      room: room.value,
      duration: parseInt(duration),
      resourceId: parseInt(resource.resourceId),
      type: eventType.value,
      isRecurring: isRecurring,
      students: members,
      absentees: [],
      isLesson: true,
    });
    if (travelTime > 0) {
      addEvent({
        id: id,
        title: "Travel",
        start: moment(start).subtract(travelTime, "m").toDate(),
        end: start,
        duration: parseInt(travelTime),
        resourceId: parseInt(resource.resourceId),
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
        resourceId: parseInt(resource.resourceId),
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
    const id = e.id;
    const endTime = moment(start).add(duration, "m").toDate();
    const editedEvent = {
      ...event,
      title: title,
      start: start,
      end: endTime,
      room: room.value,
      duration: parseInt(duration),
      resourceId: parseInt(resource.resourceId),
      type: eventType.value,
      isRecurring: isRecurring,
      students: members,
      absentees: absentees,
      isNewEvent: true,
    };
    editEvent(editedEvent);
    if (travelTime > 0) {
      addEvent({
        id: id,
        title: "Travel",
        start: moment(start).subtract(travelTime, "m").toDate(),
        end: start,
        duration: parseInt(travelTime),
        resourceId: parseInt(resource.resourceId),
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
        resourceId: parseInt(resource.resourceId),
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

  const handleResourceChange = (selectedOption) => {
    setResource(selectedOption);
  };

  const handleRoomChange = (selectedOption) => {
    setRoom(selectedOption);
  };

  const handleEventTypeChange = (selectedOption) => {
    setEventType(selectedOption);
  };

  return (
    <Dialog isOpen={formType === "event"}>
      <Form
        title={event ? "Edit Lesson" : "Add New Lesson"}
        submitAction={event ? handleEditEvent : handleAddEvent}
      >
        <InputGroup>
          <FormInput label="Weekly Event" isCheckbox>
            <Checkbox
              name="isRecurring"
              isChecked={isRecurring}
              handleToggle={handleToggleRecurrence}
            />
          </FormInput>
          <FormInput label="Lesson Name" error={errors.titleError}>
            <TextInput
              name="title"
              value={title}
              setValue={setTitle}
              required
            />
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
              required
            />
          </FormInput>
        </InputGroup>
        <InputGroup>
          <FormInput label="Lesson Duration" error={errors.durationError}>
            <TextInput
              name="duration"
              value={duration}
              setValue={setDuration}
              required
            />
          </FormInput>
          <FormInput label="Travel Time (minutes)">
            <TextInput
              name="travelTime"
              value={travelTime}
              setValue={setTravelTime}
            />
          </FormInput>
        </InputGroup>
        <InputGroup>
          <FormInput label="Teacher" error={errors.resourceError}>
            <StyledSelect
              name="resource"
              options={teachers}
              value={resource || ""}
              getOptionLabel={(option) => option.givenName}
              getOptionValue={(option) => option.resourceId}
              onChange={handleResourceChange}
              placeholder="Select Teacher"
              required
            />
          </FormInput>
          <FormInput label="Students">
            <StyledSelect
              name="students"
              options={students}
              value={members || []}
              getOptionLabel={(option) =>
                `${option.givenName} ${option.familyName}`
              }
              getOptionValue={(option) => option}
              isMulti
              onChange={handleMembersChange}
              placeholder="Add students"
              noOptionsMessage={() => "Student does not exist..."}
              isSearchable
            />
          </FormInput>
        </InputGroup>
        <InputGroup>
          <FormInput label="Room" error={errors.roomError}>
            <StyledSelect
              name="room"
              options={roomList}
              value={room || ""}
              getOptionsLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              onChange={handleRoomChange}
              placeholder="Select Room"
            />
          </FormInput>
          <FormInput label="Lesson Type" error={errors.eventTypeError}>
            <StyledSelect
              name="type"
              options={lessonTypes}
              value={eventType || ""}
              onChange={handleEventTypeChange}
              placeholder="Lesson Type"
            />
          </FormInput>
        </InputGroup>
        <ButtonGroup>
          <Button type="button" onClick={handleDeleteEvent} color="secondary">
            Delete One
          </Button>
          <Button type="button" onClick={handleDeleteEvents} color="secondary">
            Delete All
          </Button>
          <Button type="button" onClick={handleCancelEvent} color="secondary">
            Cancel Lesson
          </Button>
          <Button type="button" onClick={hideForm} color="primary">
            Back
          </Button>
          <SubmitButton
            type="submit"
            color="primary"
            titleError={errors.titleError}
            durationError={errors.durationError}
            resourceError={errors.resourceError}
            disabled={isSubmitDisabled}
          >
            {event ? "Confirm Change" : "Add Lesson"}
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </Dialog>
  );
}
