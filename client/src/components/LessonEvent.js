import React from "react";
import moment from "moment";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";

const EventWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  fontsize: 0.6rem;
  padding: 2px;
  height: 10%;
  width: 10%;
  overflow: hidden;
`;

const CancelledIcon = styled.div`
  display: flex;
  position: absolute;
  color: red;
  position: relative;
  font-weight: 800;
  fontsize: 0.7rem;
  margin: 0;
  padding: 0;
`;

const SameDayTag = styled.p`
  position: absolute;
  color: red;
  fontsize: 0.5rem;
  margin: 0;
  padding: 0;
`;

const AbsenteesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  top: 0;
`;

const AbsenteeX = styled(CloseIcon)`
  color: rgba(217, 18, 4, 0.5);
  fontsize: 0.5rem;
  position: relative;
`;

const Absentees = styled.p`
  color: rgba(0, 0, 0, 0.5);
  fontsize: 0.5rem;
  position: absolute;
  padding: 0;
  margin: 0;
`;

const EventInfo = styled.div`
  display: flex;
  flexdirection: column;
  justifycontent: space-between;
`;

const InnerGroup = styled.div`
  fontsize: 0.7rem;
  fontweight: 600;
  display: flex;
  justifycontent: space-between;
  padding: 0;
`;

const Title = styled.div`
  fontsize: 0.55rem;
  maxwidth: 85%;
  whitespace: nowrap;
  overflow: hidden;
`;

const Room = styled.span`
  fontsize: 0.55rem;
  color: #1b1c1c;
  paddingleft: 0.1rem;
`;

const LessonEvent = ({ event }) => {
  return (
    <EventWrapper>
      {event.cancelled ? (
        <CancelledIcon>
          <CloseIcon />
          {event.sameDayCancellation && <SameDayTag>当日</SameDayTag>}
        </CancelledIcon>
      ) : (
        event.absentees &&
        event.absentees.map((a) => (
          <AbsenteesWrapper key={a._id}>
            <AbsenteeX />
            <Absentees>{a.givenName}</Absentees>
          </AbsenteesWrapper>
        ))
      )}
      <EventInfo>
        <div>{moment(event.start).format("HH:mm")}</div>
        <InnerGroup>
          <Title>{event.title}</Title>
          <Room>{event.room}</Room>
        </InnerGroup>
      </EventInfo>
      <div>{moment(event.end).format("HH:mm")}</div>
    </EventWrapper>
  );
};
export default LessonEvent;
