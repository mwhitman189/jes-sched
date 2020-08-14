import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
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
  flex: 1 1 auto;
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
  justify-content: space-between;
  width: 200px;
  z-index: 2;
  padding: 2px;
  transform: ${(props) => (props.isClosed ? "translate(200px)" : "none")};
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    position: relative;
    transform: none;
    flex-direction: row;
    width: 100%;
    height: 100%;
    background: #fff;
  }
`;

const ButtonContainer = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1 1 0px;
  padding: 0;
  flex-direction: ${(props) => (props.isRow ? "row" : "column")};
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    height: 100%;
    flex-direction: row;
  }
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
  width: 100%;
  &:hover {
    background: ${(props) =>
      props.hoverBackground ? props.hoverBackground : "#2b69cc"};
  }
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    width: ${(props) => (props.width ? props.width : "90px")};
    margin: 0 4px;
  }
`;

const MenuButton = styled(Button)`
  position: relative;
  width: 50px;
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    display: none;
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
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    display: none;
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
      title: "Teacher",
      onClickEvent: handleAddTeacherNav,
    },
    {
      itemType: "staff",
      title: "Staff",
      onClickEvent: handleAddStaffNav,
    },
    {
      itemType: "student",
      title: "Student",
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
        <ButtonContainer isRow>
          <Button onClick={() => onNavigate("PREV")}>&lt;</Button>
          <DateDisplay onClick={() => onNavigate("TODAY")}>
            {moment(date).format("MM/DD").toLocaleString()}
          </DateDisplay>
          <Button onClick={() => onNavigate("NEXT")}>&gt;</Button>
          <CloseButton onClick={closeDrawer}>X</CloseButton>
        </ButtonContainer>
        <ButtonContainer>
          <Button onClick={() => onView("week")}>Week View</Button>
        </ButtonContainer>
        <ButtonContainer>
          {user.user.role === "staff" && (
            <>
              <Button onClick={handleOpen}>
                <span className="material-icons">person_add</span>Add New...
              </Button>
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
