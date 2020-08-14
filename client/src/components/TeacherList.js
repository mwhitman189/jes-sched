import React, { useContext } from "react";
import styled from "styled-components";
import { calcMinsToHours } from "../helpers/utilities";
import { TeachersContext } from "../context/TeachersContext";
import { UserContext } from "../context/UserContext";

const Resources = styled.ul`
  font-size: 1rem;
  display: flex;
  justify-content: space-around;
  list-style: none;
  font-weight: 600;
  margin: 0;
  padding: 0;
  "& li": {
    font-size: 85%
    padding: 0 .6rem
  };
  @media (min-width: ${(props) => props.theme.breakpoints.lg}): {
    font-size: .7rem
  };
`;

const Resource = styled.li`
  margin: 0 8px;
  color: ${(props) =>
    props.resource.isPartTime
      ? "#ca02e0"
      : props.resource.overThresholdTwoMins > 0
      ? "#e00262"
      : props.resource.overThresholdOneMins > 0
      ? "#ca02e0"
      : "#0220e0"};
`;

const TeacherList = () => {
  const { teachers } = useContext(TeachersContext);
  const { user } = useContext(UserContext);

  // Search for user in teachers. If user is teacher, return teacher object
  // for use in conditional rendering of teaching minutes
  const teacher =
    user.user.role === "teacher" &&
    teachers.find((t) => t.email === user.user.email);

  const individualTeachingHours =
    teacher && calcMinsToHours(teacher.teachingMins);

  return (
    <Resources>
      {
        // If teacher is defined because user is a teacher, list user's teaching mins.
        // Otherwise, list all teachers' teaching mins
        teacher ? (
          <Resource
            resource={teacher}
          >{`${teacher.name}: ${individualTeachingHours}`}</Resource>
        ) : (
          teachers &&
          teachers.map((t) => {
            const teachingHours = calcMinsToHours(t.teachingMins);
            return (
              <Resource key={`toolbar-teacher1-${t.resourceId}`} resource={t}>
                <div>{t.name}</div>
                <div>{teachingHours}</div>
              </Resource>
            );
          })
        )
      }
    </Resources>
  );
};
export default TeacherList;
