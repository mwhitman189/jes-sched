import React, { Component } from "react";
import moment from "moment";
import TeachersContext from "../context/TeachersContext";

import IconButton from "@material-ui/core/IconButton";
import RightArrowIcon from "@material-ui/icons/ChevronRight";
import LeftArrowIcon from "@material-ui/icons/ChevronLeft";
import { withStyles } from "@material-ui/styles";
import styles from "../styles/CustomToolbarStyles";
import "react-big-calendar/lib/sass/toolbar.scss";

const CustomToolbar = ({ handleBtnClick }) => {
  return withStyles(styles)(
    class CustomToolbarClass extends Component {
      static contextType = TeachersContext;

      render() {
        const { classes } = this.props;

        const { teachers } = this.context;
        return (
          <div
            className="rbc-toolbar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div className="rbc-btn-group">
              <button
                className="toolbar-navigation-button"
                type="button"
                onClick={() => this.props.onView("week")}
              >
                Week
              </button>
              <button
                className="toolbar-navigation-button"
                type="button"
                onClick={() => this.props.onView("day")}
              >
                Day
              </button>
            </div>
            <div className="rbc-btn-group">
              <IconButton
                className="toolbar-navigation-button"
                type="button"
                onClick={() => this.props.onNavigate("PREV")}
              >
                <LeftArrowIcon
                  className="navigate-icon"
                  icon={this.props.isRTL ? "chevron-right" : "chevron-left"}
                />
              </IconButton>
              <span
                className="today-label"
                onClick={() => this.props.onNavigate("TODAY")}
              >
                {moment(this.props.date)
                  .format("dddd MM/DD")
                  .toLocaleString()}
              </span>
              <IconButton
                className="toolbar-navigation-button"
                type="button"
                onClick={() => this.props.onNavigate("NEXT")}
              >
                <RightArrowIcon
                  className="navigate-icon"
                  icon={this.props.isRTL ? "chevron-left" : "chevron-right"}
                />
              </IconButton>
            </div>
            <div>
              <ul className={classes.teacherList}>
                {teachers.map(t => (
                  <li
                    className={
                      t.teachingMins < 400
                        ? classes.listItem
                        : t.teachingMins < 600
                        ? classes.listItemYellow
                        : classes.listItemRed
                    }
                    key={t.resourceId}
                  >{`${t.name}: ${t.teachingMins}`}</li>
                ))}
              </ul>
            </div>
            <div className="rbc-btn-group">
              <button onClick={handleBtnClick}>New Teacher</button>
            </div>
          </div>
        );
      }
    }
  );
};

export default CustomToolbar;
