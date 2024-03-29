import React, { useContext, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { UserContext } from '../context/UserContext'
import TeacherList from './TeacherList'
import ModalContainer from './templates/ModalContainer'
import NewEntryDialog from './NewEntryDialog'
import theme from '../constants/styles'
import 'react-big-calendar/lib/sass/toolbar.scss'

const ToolbarContainer = styled.div`
  height: 40px;
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0 10px;
  justify-content: space-between;
`

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
  padding: 5px;
  transform: ${({ isClosed }) => (isClosed ? 'translate(200px)' : 'none')};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: relative;
    transform: none;
    flex-direction: row;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 2px;
  }
`

const ButtonContainer = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1 0 auto;
  padding: 0;
  flex-direction: ${({ isRow }) => (isRow ? 'row' : 'column')};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    height: 100%;
    flex-direction: row;
  }
`

const Button = styled.button`
  display: ${({ theme }) => theme.btnStyles.display};
  cursor: ${({ theme }) => theme.btnStyles.cursor};
  justify-content: ${({ theme }) => theme.btnStyles.justifyContent};
  align-items: ${({ theme }) => theme.btnStyles.alignItems};
  font-weight: ${({ theme }) => theme.btnStyles.fontWeight};
  text-transform: ${({ theme }) => theme.btnStyles.textTransform};
  color: ${({ theme }) => theme.btnStyles.color};
  background: ${({ background, theme }) => (background || theme.colors.primary)};
  border: ${({ theme }) => theme.btnStyles.border};
  border-radius: ${({ theme }) => theme.btnStyles.borderRadius};
  height: ${({ theme }) => theme.btnStyles.height};
  margin: ${({ theme }) => theme.btnStyles.margin};
  width: 100%;
  justify-content: ${({ justification }) => (justification || 'center')};

  &:hover {
    background: ${({ hoverBackground }) => (hoverBackground || '#2b69cc')};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: ${({ width }) => (width || '90px')};
    margin: 0 4px;
    justify-content: center;
  }
`

const MenuButton = styled(Button)`
  position: relative;
  width: 50px;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

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
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

const DateDisplay = styled.span`
  color: rgba(68, 68, 68, 0.7);
  margin: 0 0.2rem;
  cursor: pointer;
`

const Toolbar = (props) => {
  const {
    onNavigate,
    onView,
    date,
    handleAddTeacherNav,
    handlePayrollNav,
    handleAddStaffNav,
    handleAddStudentNav,
  } = props

  const { user, dispatch } = useContext(UserContext)
  const [ isClosed, setIsClosed ] = useState(true)

  // Set the types of items to display in the "Create new..." dialog
  const ITEM_TYPES = [
    {
      itemType: 'teacher',
      title: 'Teacher',
      onClickEvent: handleAddTeacherNav,
    },
    {
      itemType: 'staff',
      title: 'Staff',
      onClickEvent: handleAddStaffNav,
    },
    {
      itemType: 'student',
      title: 'Student',
      onClickEvent: handleAddStudentNav,
    },
  ]

  const handleLogout = (e) => {
    e.preventDefault()
    dispatch({ type: 'LOGOUT_SUCCESS' })
  }

  const openDrawer = () => {
    setIsClosed(false)
  }

  const closeDrawer = () => {
    setIsClosed(true)
  }

  return (
    <ToolbarContainer>
      <TeacherList />
      <MenuButton onClick={openDrawer}>Menu</MenuButton>
      <Menu isClosed={isClosed}>
        <ButtonContainer isRow>
          <Button onClick={() => onNavigate('PREV')} justification="center">
            &lt;
          </Button>
          <DateDisplay onClick={() => onNavigate('TODAY')}>
            {moment(date).format('MM/DD').toLocaleString()}
          </DateDisplay>
          <Button onClick={() => onNavigate('NEXT')} justification="center">
            &gt;
          </Button>
          <CloseButton onClick={closeDrawer}>X</CloseButton>
        </ButtonContainer>
        <ButtonContainer>
          <Button onClick={() => onView('week')}>Week View</Button>
        </ButtonContainer>
        <ButtonContainer>
          {user.user.role === 'staff' && (
            <ModalContainer
              triggerIcon="person_add"
              triggerText="Add New..."
              background={theme.colors.primary}
              textColor={theme.colors.secondaryText}
              btnStyles={theme.btnStyles}
            >
              <NewEntryDialog items={ITEM_TYPES} />
            </ModalContainer>
          )}
          <Button onClick={handlePayrollNav}>Payroll</Button>
          <Button
            onClick={handleLogout}
            background="#f21d4b"
            hoverBackground="#c90a33"
          >
            Log Out
          </Button>
        </ButtonContainer>
      </Menu>
    </ToolbarContainer>
  )
}
export default Toolbar
