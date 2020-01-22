import React, { useState, useContext, useRef } from "react";
import moment from "moment";
import ReactToPrint from "react-to-print";
import TeachersContext from "../context/TeachersContext";
import { createPayPeriodData } from "../helperFunctions";
import PayrollSheet from "./PayrollSheet";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import DialogTitle from "@material-ui/core/DialogTitle";

import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
});

function createData(
  date,
  month,
  teachingHours,
  outsideDutyHours,
  holidayHours,
  travelAllowance,
  travelExpenses
) {
  return {
    date,
    month,
    teachingHours,
    outsideDutyHours,
    holidayHours,
    travelAllowance,
    travelExpenses
  };
}

const Payroll = props => {
  const componentRef = useRef();
  const classes = useStyles();

  const { teachers } = useContext(TeachersContext);
  const [stage, setStage] = useState("teacherSelect");
  const [rows, setRows] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState("");
  const { events } = props;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = moment(now).daysInMonth();

  const showPayrollSheet = teacher => {
    setCurrentTeacher(teacher.resourceId);
    const teachingMinsByDate = createPayPeriodData(
      events,
      teacher,
      monthStart,
      monthEnd
    );

    const rows = [];
    for (let i = 1; i <= daysInMonth; i++) {
      let newRow;
      if (teachingMinsByDate[i]) {
        newRow = createData(
          i,
          now.getMonth("MMM"),
          teachingMinsByDate[i].teachingMins,
          teachingMinsByDate[i].outsideDutyMins,
          teachingMinsByDate[i].holidayMins,
          teachingMinsByDate[i].travelAllowance,
          teachingMinsByDate[i].travelExpenses
        );
      } else {
        newRow = createData(i, now.getMonth("MMM"), 0, 0, 0, 0, 0);
      }
      rows.push(newRow);
    }
    setRows(rows);
    setStage("payrollSheet");
  };

  const hideForm = () => {
    setStage("");
  };

  return (
    <div>
      <Dialog
        onClose={hideForm}
        aria-labelledby="teacher-select-title"
        open={stage === "teacherSelect"}
      >
        <DialogTitle id="teacher-select-title">
          Payroll: Select a teacher
        </DialogTitle>
        <List>
          {teachers.map(t => (
            <ListItem
              button
              onClick={() => showPayrollSheet(t)}
              key={t.resourceId}
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>
      <Dialog
        onClose={hideForm}
        aria-labelledby="payroll-sheet-dialog"
        open={stage === "payrollSheet"}
      >
        <ReactToPrint
          trigger={() => <button>Print this out!</button>}
          content={() => componentRef.current}
        />
        <PayrollSheet
          classes={classes}
          rows={rows}
          currentTeacher={currentTeacher}
          ref={componentRef}
        />
      </Dialog>
    </div>
  );
};
export default Payroll;
