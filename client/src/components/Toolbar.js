import React, { useContext, useState } from "react";
import moment from "moment";
import { UserContext } from "../context/UserContext";
import TeacherList from "./TeacherList";
import NewEntryDialog from "./NewEntryDialog";
import styled from "styled-components";
import "react-big-calendar/lib/sass/toolbar.scss";

const BREAKPOINT = "500px";

const ToolbarContainer = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 0;
  padding: 0 10px;
`;

const Menu = styled.nav`
  position: fixed;
  top: 0;
  right: 0;
  overflow-x: hidden;
  transition: 0.2s;
  display: flex;
  background: #b3cae8;
  flex-direction: column;
  width: 200px;
  z-index: 2000;
  transform: ${(props) => (props.isClosed ? "translate(200px)" : "none")};
`;

const ButtonContainer = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 0px;
  padding: 3px;
  flex-direction: ${(props) => (props.isColumn ? "column" : "row")};
  @media (min-width: ${BREAKPOINT}) {
    height: 100%;
  }
`;

const Button = styled.button`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  text-transform: capitalize;
  color: #fff;
  background: ${(props) => (props.background ? props.background : "#4287f5")};
  border: none;
  border-radius: 4px;
  margin: 4px;
  height: 35px;
  width: 100%;
  &:hover {
    background: ${(props) =>
      props.hoverBackground ? props.hoverBackground : "#2b69cc"};
  }
  @media (min-width: ${BREAKPOINT}) {
    width: ${(props) => (props.width ? props.width : "80px")};
  }
`;

const MenuButton = styled(Button)`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 50px;
  @media (min-width: ${BREAKPOINT}) {
    display: hidden;
  }
`;

const CloseButton = styled(Button)`
  right: 0;
  margin: 10px;
  align-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: #ffffff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #575757;
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
    date,
    handleAddTeacherNav,
    handlePayrollNav,
    handleAddStaffNav,
    handleAddStudentNav,
  } = props;

  const { user, dispatch } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(true);

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

  const openDrawer = () => {
    setIsClosed(false);
  };

  const closeDrawer = () => {
    setIsClosed(true);
  };

  return (
    <ToolbarContainer>
      <NewEntryDialog
        isOpen={isOpen}
        items={ITEM_TYPES}
        closeDialog={handleClose}
      />
      <TeacherList />
      <MenuButton onClick={openDrawer}>Menu</MenuButton>
      <Menu isClosed={isClosed}>
        <ButtonContainer isLeft>
          <Button onClick={() => onNavigate("PREV")}>&lt;</Button>
          <DateDisplay onClick={() => onNavigate("TODAY")}>
            {moment(date).format("MM/DD").toLocaleString()}
          </DateDisplay>
          <Button onClick={() => onNavigate("NEXT")}>&gt;</Button>
          <CloseButton onClick={closeDrawer}>X</CloseButton>
        </ButtonContainer>
        <Button onClick={() => onView("week")}>Week View</Button>
        <ButtonContainer isColumn>
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
      </Menu>
    </ToolbarContainer>
  );
};
export default Toolbar;
