import React, { useContext, useState } from "react";
import moment from "moment";
import { TeachersContext } from "../context/TeachersContext";
import { UserContext } from "../context/UserContext";
import TeacherList from "./TeacherList";
import NewEntryDialog from "./NewEntryDialog";
import styled from "styled-components";
import "react-big-calendar/lib/sass/toolbar.scss";

const ToolbarContainer = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 0;
  padding: 0 10px;
`;

const ButtonContainer = styled.div`
  margin: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 0px;
  padding: 3px;
`;

const Button = styled.button`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  text-transform: uppercase;
  color: #fff;
  background: ${(props) => (props.background ? props.background : "#4287f5")};
  border: none;
  border-radius: 4px;
  margin: 0 4px;
  height: 100%;
  width: ${(props) => (props.width ? props.width : "80px")};
  &:hover {
    background: ${(props) =>
      props.hoverBackground ? props.hoverBackground : "#2b69cc"};
  }
`;

const DateDisplay = styled.span`
  color: rgba(68, 68, 68, 0.7);
  margin: 0 0.2rem;
  cursor: pointer;
`;

const Toolbar = (props) => {
  const {
    onNavigate,
    onView,
    isRTL,
    date,
    handleAddTeacherNav,
    handlePayrollNav,
    handleAddStaffNav,
    handleAddStudentNav,
  } = props;

  const { user, dispatch } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  // Set the types of items to display in the "Create new..." dialog
  const ITEM_TYPES = [
    {
      itemType: "teacher",
      title: "Add teacher",
      onClickEvent: handleAddTeacherNav,
    },
    {
      itemType: "staff",
      title: "Add staff",
      onClickEvent: handleAddStaffNav,
    },
    {
      itemType: "student",
      title: "Add student",
      onClickEvent: handleAddStudentNav,
    },
  ];

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT_SUCCESS" });
  };

  return (
    <ToolbarContainer>
      <NewEntryDialog
        isOpen={isOpen}
        items={ITEM_TYPES}
        closeDialog={handleClose}
      />
      <ButtonContainer isLeft>
        <Button onClick={() => onNavigate("PREV")}>&lt;</Button>
        <DateDisplay onClick={() => onNavigate("TODAY")}>
          {moment(date).format("MM/DD").toLocaleString()}
        </DateDisplay>
        <Button onClick={() => onNavigate("NEXT")}>&gt;</Button>
      </ButtonContainer>
      <TeacherList />
      <ButtonContainer>
        {user.user.role === "staff" && (
          <>
            <Button onClick={handleOpen}>Add New...</Button>
            <Button onClick={handlePayrollNav}>Payroll</Button>
          </>
        )}
        <Button
          onClick={handleLogout}
          background={"#f21d4b"}
          hoverBackground={"#c90a33"}
        >
          Log Out
        </Button>
      </ButtonContainer>
    </ToolbarContainer>
  );
};
export default Toolbar;
