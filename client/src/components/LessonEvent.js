import React from "react";
import moment from "moment";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";

const EventWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 0.6rem;
  padding: 1px;
  overflow: hidden;
  position: relative;
  height: 100%;
`;

const CancelledIcon = styled.div`
  display: flex;
  position: absolute;
  color: red;
  position: relative;
  font-weight: 800;
  margin: 0;
  padding: 0;
`;

const SameDayTag = styled.p`
  position: relative;
  color: red;
  margin: 0;
  padding: 0;
  writing-mode: vertical-lr;
  text-orientation: upright;
`;

const AbsenteesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  top: 0;
`;

const AbsenteeX = styled.span`
  width: 1rem;
  color: rgba(217, 18, 4, 0.8);
  position: relative;
`;

const Absentees = styled.p`
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.5rem;
  padding: 0;
  margin: 0;
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  left: 1px;
  top: 0.7rem;
`;

const InnerGroup = styled.div`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  padding: 0;
  font-size: 0.5rem;
  line-height: 80%;
`;

const Title = styled.div`
  max-width: 85%;
  line-height: 80%;
  white-space: nowrap;
  overflow: hidden;
`;

const Room = styled.span`
  color: #1b1c1c;
  padding-left: 0.1rem;
`;

const ExtraInfoWrapper = styled.div`
  z-index: 9;
  position: absolute;
`;

const EndTime = styled.div`
  position: relative;
  bottom: 0;
`;

const LessonEvent = ({ event }) => {
  return (
    <EventWrapper>
      <ExtraInfoWrapper>
        {event.isCancelled ? (
          <CancelledIcon>
            <CloseIcon />
            {event.isSameDayCancellation && <SameDayTag>SD</SameDayTag>}
          </CancelledIcon>
        ) : (
          event.absentees &&
          event.absentees.map((a) => (
            <AbsenteesWrapper key={`lessonEvent-absentee-${a._id}`}>
              <Absentees>
                <AbsenteeX>x</AbsenteeX>
                {a.givenName}
              </Absentees>
            </AbsenteesWrapper>
          ))
        )}
      </ExtraInfoWrapper>
      <div>{moment(event.start).format("HH:mm")}</div>
      <EventInfo>
        <InnerGroup>
          <Title>{event.title}</Title>
          <Room>{event.room}</Room>
        </InnerGroup>
      </EventInfo>
      <EndTime>{moment(event.end).format("HH:mm")}</EndTime>
    </EventWrapper>
  );
};
export default LessonEvent;
