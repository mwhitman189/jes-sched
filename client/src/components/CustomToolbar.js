import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import { TeachersContext } from "../context/TeachersContext";
import { UserContext } from "../context/UserContext";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import RightArrowIcon from "@material-ui/icons/ChevronRight";
import LeftArrowIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import styles from "../styles/CustomToolbarStyles";
import "react-big-calendar/lib/sass/toolbar.scss";

// Debounce to prevent re-renders on every single dimension change
function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

const CustomToolbar = (props) => {
  const {
    classes,
    onNavigate,
    isRTL,
    date,
    handleAddTeacherNav,
    handlePayrollNav,
  } = props;
  const { teachers } = useContext(TeachersContext);
  const { user, dispatch } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Search for user in teachers. If user is teacher, return teacher object
  // for use in conditional rendering of teaching minutes
  const teacher =
    user.user !== null && teachers.find((t) => t.email === user.user.email);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT_SUCCESS" });
  };

  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #d3d4d5",
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      "&:focus": {
        backgroundColor: theme.palette.primary.main,
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  const collapseToolbar = (
    <div style={{ justifyContent: "flex-end" }} className={classes.toolbar}>
      <ul className={classes.teacherList}>
        {
          // If teacher is defined because user is a teacher, list user's teaching mins.
          // Otherwise, list all teachers' teaching mins
          teacher ? (
            <li
              className={
                teacher.overThresholdTwoMins > 0
                  ? classes.listItemRed
                  : teacher.overThresholdOneMins > 0
                  ? classes.listItemYellow
                  : classes.listItem
              }
            >{`${teacher.name}: ${teacher.teachingMins}`}</li>
          ) : (
            teachers.map((t) => (
              <li
                className={
                  t.overThresholdTwoMins > 0
                    ? classes.listItemRed
                    : t.overThresholdOneMins > 0
                    ? classes.listItemYellow
                    : classes.listItem
                }
                key={t.resourceId}
              >{`${t.name}: ${t.teachingMins}`}</li>
            ))
          )
        }
      </ul>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Open Menu
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div style={{ display: "flex" }}>
          <StyledMenuItem
            className={classes.navBtnNav}
            type="button"
            onClick={() => onNavigate("PREV")}
          >
            <ListItemIcon style={{ minWidth: 0 }}>
              <LeftArrowIcon fontSize="large" />
            </ListItemIcon>
          </StyledMenuItem>
          <StyledMenuItem
            className={classes.navBtnNav}
            type="button"
            onClick={() => onNavigate("NEXT")}
          >
            <ListItemIcon style={{ minWidth: 0 }}>
              <RightArrowIcon fontSize="large" />
            </ListItemIcon>
          </StyledMenuItem>
        </div>

        <StyledMenuItem
          className={classes.navBtn}
          onClick={handleAddTeacherNav}
        >
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="New Teacher" />
        </StyledMenuItem>
        <StyledMenuItem className={classes.navBtn} onClick={handlePayrollNav}>
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Payroll" />
        </StyledMenuItem>
        <StyledMenuItem
          style={{
            background: "#f50057",
            background:
              "linear-gradient(0deg, rgba(186, 4, 68,1) 7%, rgba(245, 0, 86,1) 100%)",
          }}
          className={classes.navBtn}
          onClick={handleLogout}
        >
          <ListItemIcon>
            <InboxIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );

  const fullSizeToolbar = (
    <ul className={classes.toolbar}>
      <div className={classes.btnGroup}>
        <IconButton
          className={classes.navBtn}
          type="button"
          onClick={() => onNavigate("PREV")}
        >
          <LeftArrowIcon
            className={classes.navIcon}
            icon={isRTL ? "chevron-right" : "chevron-left"}
          />
        </IconButton>
        <span
          className={classes.todayLabel}
          onClick={() => onNavigate("TODAY")}
        >
          {moment(date).format("dddd MM/DD").toLocaleString()}
        </span>
        <IconButton
          className={classes.navBtn}
          type="button"
          onClick={() => onNavigate("NEXT")}
        >
          <RightArrowIcon
            className={classes.navIcon}
            icon={isRTL ? "chevron-left" : "chevron-right"}
          />
        </IconButton>
      </div>
      <ul className={classes.teacherList}>
        {
          // If teacher is defined because user is a teacher, list user's teaching mins.
          // Otherwise, list all teachers' teaching mins
          teacher ? (
            <li
              className={
                teacher.overThresholdTwoMins > 0
                  ? classes.listItemRed
                  : teacher.overThresholdOneMins > 0
                  ? classes.listItemYellow
                  : classes.listItem
              }
            >{`${teacher.name}: ${teacher.teachingMins}`}</li>
          ) : (
            teachers.map((t) => (
              <li
                className={
                  t.overThresholdTwoMins > 0
                    ? classes.listItemRed
                    : t.overThresholdOneMins > 0
                    ? classes.listItemYellow
                    : classes.listItem
                }
                key={t.resourceId}
              >{`${t.name}: ${t.teachingMins}`}</li>
            ))
          )
        }
      </ul>
      <div className={classes.btnGroup}>
        <button className={classes.navBtn} onClick={handleAddTeacherNav}>
          New Teacher
        </button>
        <button className={classes.navBtn} onClick={handlePayrollNav}>
          Payroll
        </button>
        <button
          style={{
            background: "#f50057",
            background:
              "linear-gradient(0deg, rgba(186, 4, 68,1) 7%, rgba(245, 0, 86,1) 100%)",
          }}
          className={classes.navBtn}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </ul>
  );

  return dimensions.width < 750 ? collapseToolbar : fullSizeToolbar;
};

export default withStyles(styles)(CustomToolbar);
