import React from "react";
import moment from "moment";

import "react-big-calendar/lib/sass/toolbar.scss";

import IconButton from "@material-ui/core/IconButton";
import RightArrowIcon from "@material-ui/icons/ChevronRight";
import LeftArrowIcon from "@material-ui/icons/ChevronLeft";

const CustomToolbar = ({ handleBtnClick }) => props => {
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
          onClick={() => props.onView("week")}
        >
          Week
        </button>
        <button
          className="toolbar-navigation-button"
          type="button"
          onClick={() => props.onView("day")}
        >
          Day
        </button>
      </div>
      <div className="rbc-btn-group">
        <IconButton
          className="toolbar-navigation-button"
          type="button"
          onClick={() => props.onNavigate("PREV")}
        >
          <LeftArrowIcon
            className="navigate-icon"
            icon={props.isRTL ? "chevron-right" : "chevron-left"}
          />
        </IconButton>
        <span className="today-label" onClick={() => props.onNavigate("TODAY")}>
          {moment(props.date)
            .format("dddd MM/DD")
            .toLocaleString()}
        </span>
        <IconButton
          className="toolbar-navigation-button"
          type="button"
          onClick={() => props.onNavigate("NEXT")}
        >
          <RightArrowIcon
            className="navigate-icon"
            icon={props.isRTL ? "chevron-left" : "chevron-right"}
          />
        </IconButton>
      </div>
      <div className="rbc-btn-group">
        <button onClick={handleBtnClick}>New Teacher</button>
      </div>
    </div>
  );
};
export default CustomToolbar;
