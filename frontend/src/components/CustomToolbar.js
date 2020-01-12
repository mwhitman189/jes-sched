import React, { Component } from "react";
import moment from "moment";
import "react-big-calendar/lib/sass/toolbar.scss";

import TeachersContext from "../context/TeachersContext";

import IconButton from "@material-ui/core/IconButton";
import RightArrowIcon from "@material-ui/icons/ChevronRight";
import LeftArrowIcon from "@material-ui/icons/ChevronLeft";

const CustomToolbar = ({ handleBtnClick }) => {
  return class CustomToolbarClass extends Component {
    static contextType = TeachersContext;

    render() {
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
          <div className="teachers-list">
            <ul>
              {teachers.map(t => (
                <li key={t.resourceId}>{`${t.name}: ${t.teachingMins}`}</li>
              ))}
            </ul>
          </div>
          <div className="rbc-btn-group">
            <button onClick={handleBtnClick}>New Teacher</button>
          </div>
        </div>
      );
    }
  };
};

// const CustomToolbar = ({ handleBtnClick, teachers }) => props => {
//   console.log(teachers);
//   return (
//     <div
//       className="rbc-toolbar"
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center"
//       }}
//     >
//       <div className="rbc-btn-group">
//         <button
//           className="toolbar-navigation-button"
//           type="button"
//           onClick={() => props.onView("week")}
//         >
//           Week
//         </button>
//         <button
//           className="toolbar-navigation-button"
//           type="button"
//           onClick={() => props.onView("day")}
//         >
//           Day
//         </button>
//       </div>
//       <div className="rbc-btn-group">
//         <IconButton
//           className="toolbar-navigation-button"
//           type="button"
//           onClick={() => props.onNavigate("PREV")}
//         >
//           <LeftArrowIcon
//             className="navigate-icon"
//             icon={props.isRTL ? "chevron-right" : "chevron-left"}
//           />
//         </IconButton>
//         <span className="today-label" onClick={() => props.onNavigate("TODAY")}>
//           {moment(props.date)
//             .format("dddd MM/DD")
//             .toLocaleString()}
//         </span>
//         <IconButton
//           className="toolbar-navigation-button"
//           type="button"
//           onClick={() => props.onNavigate("NEXT")}
//         >
//           <RightArrowIcon
//             className="navigate-icon"
//             icon={props.isRTL ? "chevron-left" : "chevron-right"}
//           />
//         </IconButton>
//       </div>
//       <div className="rbc-btn-group">
//         <button onClick={handleBtnClick}>New Teacher</button>
//       </div>
//     </div>
//   );
// };
export default CustomToolbar;
