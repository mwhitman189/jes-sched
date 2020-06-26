import React, { useState, useContext, useRef } from "react";
import moment from "moment";
import ReactToPrint from "react-to-print";
import useToggleState from "../hooks/useToggleState";
import { EventsContext } from "../context/EventsContext";
import { TeachersContext } from "../context/TeachersContext";
import { createPayPeriodData } from "../helpers/payroll";
import PayrollSheet from "./PayrollSheet";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import DialogTitle from "@material-ui/core/DialogTitle";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  btn: {
    color: "#fff",
    background: "rgb(20,71,207)",
    background:
      "linear-gradient(0deg, rgba(20,71,207,1) 7%, rgba(49,119,254,1) 100%)",
    border: "none",
    borderRadius: "5px",
    padding: ".3rem .5rem",
    minWidth: "4rem",
    margin: ".2rem auto .1rem",
  },
}));

function createData(
  date,
  day,
  teachingMins,
  outsideDutyMins,
  holidayMins,
  travelAllowance,
  travelExpenses
) {
  return {
    date,
    day,
    teachingMins,
    outsideDutyMins,
    holidayMins,
    travelAllowance,
    travelExpenses,
  };
}

const Payroll = (props) => {
  const componentRef = useRef();
  const classes = useStyles();

  const { teachers } = useContext(TeachersContext);
  const { events } = useContext(EventsContext);
  const [stage, setStage] = useState("teacherSelect");
  const [data, setData] = useState({});
  const [currentTeacher, setCurrentTeacher] = useState("");
  const [isLoading, toggleIsLoading] = useToggleState(false);
  const { setFormType } = props;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = moment(now).daysInMonth();

  const showPayrollSheet = (teacher) => {
    setCurrentTeacher(teacher);
    toggleIsLoading(true);
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
          moment(new Date(now.getFullYear(), now.getMonth()))
            .set("date", i)
            .format("ddd"),
          teachingMinsByDate[i].teachingMins,
          teachingMinsByDate[i].outsideDutyMins,
          teachingMinsByDate[i].holidayMins,
          teachingMinsByDate[i].travelAllowance,
          teachingMinsByDate[i].travelExpenses
        );
      } else {
        newRow = createData(
          i,
          moment(new Date(now.getFullYear(), now.getMonth()))
            .set("date", i)
            .format("ddd"),
          0,
          0,
          0,
          0,
          0,
          0,
          0
        );
      }
      rows.push(newRow);
    }
    setData({
      rows: rows,
      overThresholdOneMins: teachingMinsByDate.overThresholdOneMins,
      overThresholdTwoMins: teachingMinsByDate.overThresholdTwoMins,
    });
    setStage("payrollSheet");
    toggleIsLoading(false);
  };

  const hideForm = () => {
    setStage("");
    setFormType("");
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
          {teachers.map((t) => (
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
        <PayrollSheet
          classes={classes}
          data={data}
          currentTeacher={currentTeacher}
          ref={componentRef}
          paymentPeriodStart={monthStart}
          paymentPeriodEnd={monthEnd}
          paidVacationDays={0}
          unpaidVacationDays={0}
          paidSickDays={0}
          unpaidSickDays={0}
          taxRefund={0}
          travelAllowance={0}
          travelExpenses={0}
          setFormType={setFormType}
        />
        <ReactToPrint
          trigger={() => <button className={classes.btn}>Print</button>}
          content={() => componentRef.current}
        />
      </Dialog>
    </div>
  );
};
export default Payroll;
