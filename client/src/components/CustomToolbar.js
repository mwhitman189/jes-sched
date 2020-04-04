import React, { useContext } from "react";
import moment from "moment";
import { TeachersContext } from "../context/TeachersContext";
import { UserContext } from "../context/UserContext";
import IconButton from "@material-ui/core/IconButton";
import RightArrowIcon from "@material-ui/icons/ChevronRight";
import LeftArrowIcon from "@material-ui/icons/ChevronLeft";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/CustomToolbarStyles";
import "react-big-calendar/lib/sass/toolbar.scss";

const CustomToolbar = withStyles(theme => styles)(props => {
  const {
    classes,
    onNavigate,
    onView,
    isRTL,
    date,
    handleAddTeacherNav,
    handlePayrollNav
  } = props;
  const { teachers } = useContext(TeachersContext);
  const { dispatch } = useContext(UserContext);

  const handleLogout = e => {
    e.preventDefault();
    dispatch({ type: "LOGOUT_SUCCESS" });
    console.log("Logged out");
  };

  return (
    <div className={classes.toolbar}>
      <div className={classes.btnGroup}>
        <button
          className={classes.navBtn}
          type="button"
          onClick={() => onView("week")}
        >
          Week
        </button>
        <button
          className={classes.navBtn}
          type="button"
          onClick={() => onView("day")}
        >
          Day
        </button>
      </div>
      <div className={classes.btnGroup}>
        <IconButton
          className={classes.navBtn}
          type="button"
          onClick={props => onNavigate("PREV")}
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
          {moment(date)
            .format("dddd MM/DD")
            .toLocaleString()}
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
      <div>
        <ul className={classes.teacherList}>
          {teachers.map(t => (
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
          ))}
        </ul>
      </div>
      <div className={classes.btnGroup}>
        <button className={classes.navBtn} onClick={handleAddTeacherNav}>
          New Teacher
        </button>
      </div>
      <div className={classes.btnGroup}>
        <button className={classes.navBtn} onClick={handlePayrollNav}>
          Payroll
        </button>
      </div>
      <div className={classes.btnGroup}>
        <button className={classes.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
});

export default CustomToolbar;
