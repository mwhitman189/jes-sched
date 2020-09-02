import React, { useContext } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import CloseIcon from '@material-ui/icons/Close';
import { TeachersContext } from '../context/TeachersContext';

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

const ResourceName = styled.div`
  color: rgba(245, 66, 230, 0.6);
  position: absolute;
  top: ${({ duration }) => (duration > 50 ? '8px' : '5px')};
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
  top: 6px;
`;

const AbsenteeX = styled.span`
  width: 1rem;
  padding: 0;
  margin: 0;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 85%;
  white-space: nowrap;
  overflow: hidden;
`;

const Room = styled.span`
  color: #1b1c1c;
  background: ${({ theme }) => theme.colors.secondaryText};
  border-radius: 50%;
  padding: 0.2rem;
`;

const ExtraInfoWrapper = styled.div`
  z-index: 3;
  position: absolute;
`;

const EndTime = styled.div`
  position: relative;
  bottom: 0;
`;

const LessonEvent = ({ event }) => {
  const { teachers } = useContext(TeachersContext);
  const resource = teachers.find((r) => r.resourceId === event.resourceId);
  return (
    <EventWrapper>
      <ResourceName duration={event.duration}>
        {(resource.isPartTime || resource.isSub) && resource.name}
      </ResourceName>
      <ExtraInfoWrapper>
        {event.isCancelled ? (
          <CancelledIcon>
            <CloseIcon />
            {event.isSameDayCancellation && <SameDayTag>SD</SameDayTag>}
          </CancelledIcon>
        ) : (
          event.absentees
          && event.absentees.map((a) => (
            <AbsenteesWrapper key={`lessonEvent-absentee-${a._id}`}>
              <Absentees>
                <AbsenteeX>x</AbsenteeX>
                {a.givenName}
              </Absentees>
            </AbsenteesWrapper>
          ))
        )}
      </ExtraInfoWrapper>
      <div>{moment(event.start).format('HH:mm')}</div>
      <EventInfo>
        <InnerGroup>
          <Title>{event.title}</Title>
          <Room>{event.room}</Room>
        </InnerGroup>
      </EventInfo>
      <EndTime>{moment(event.end).format('HH:mm')}</EndTime>
    </EventWrapper>
  );
};
export default LessonEvent;
