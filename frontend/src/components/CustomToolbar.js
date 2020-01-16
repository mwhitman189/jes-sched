import React, { Component } from "react";
import moment from "moment";
import TeachersContext from "../context/TeachersContext";

import IconButton from "@material-ui/core/IconButton";
import RightArrowIcon from "@material-ui/icons/ChevronRight";
import LeftArrowIcon from "@material-ui/icons/ChevronLeft";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/CustomToolbarStyles";
import "react-big-calendar/lib/sass/toolbar.scss";

const CustomToolbar = ({ handleBtnClick, handlePayrollBtnClick }) => {
  return withStyles(styles)(
    class CustomToolbarClass extends Component {
      static contextType = TeachersContext;

      render() {
        const { classes } = this.props;
        const { teachers } = this.context;

        return (
          <div className={classes.toolbar}>
            <div className={classes.btnGroup}>
              <button
                className={classes.navBtn}
                type="button"
                onClick={() => this.props.onView("week")}
              >
                Week
              </button>
              <button
                className={classes.navBtn}
                type="button"
                onClick={() => this.props.onView("day")}
              >
                Day
              </button>
            </div>
            <div className={classes.btnGroup}>
              <IconButton
                className={classes.navBtn}
                type="button"
                onClick={() => this.props.onNavigate("PREV")}
              >
                <LeftArrowIcon
                  className={classes.navIcon}
                  icon={this.props.isRTL ? "chevron-right" : "chevron-left"}
                />
              </IconButton>
              <span
                className={classes.todayLabel}
                onClick={() => this.props.onNavigate("TODAY")}
              >
                {moment(this.props.date)
                  .format("dddd MM/DD")
                  .toLocaleString()}
              </span>
              <IconButton
                className={classes.navBtn}
                type="button"
                onClick={() => this.props.onNavigate("NEXT")}
              >
                <RightArrowIcon
                  className={classes.navIcon}
                  icon={this.props.isRTL ? "chevron-left" : "chevron-right"}
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
              <button className={classes.navBtn} onClick={handleBtnClick}>
                New Teacher
              </button>
            </div>
            <div className={classes.btnGroup}>
              <button
                className={classes.navBtn}
                onClick={handlePayrollBtnClick}
              >
                Payroll
              </button>
            </div>
          </div>
        );
      }
    }
  );
};

export default CustomToolbar;
