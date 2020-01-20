import React, { useContext } from "react";
import TeachersContext from "../context/TeachersContext";
import { createPayPeriodData } from "../helperFunctions";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { blue } from "@material-ui/core/colors";
import moment from "moment";

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

const PayrollSheet = props => {
  const classes = useStyles();
  const { teachers } = useContext(TeachersContext);
  const { currentTeacher, stage, hideForm, events } = props;

  const teacher = teachers.filter(t => t.resourceId === currentTeacher)[0];
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysInMonth = moment(now).daysInMonth();
  const teachingHoursByDate = createPayPeriodData(
    events,
    teacher,
    monthStart,
    monthEnd
  );
  console.log(teachingHoursByDate);

  const rows = [];
  for (let i = 1; i <= daysInMonth; i++) {
    let newRow;
    if (teachingHoursByDate[i]) {
      newRow = createData(
        i,
        now.getMonth("MMM"),
        teachingHoursByDate[i].teachingHours,
        teachingHoursByDate[i].outsideDutyHours,
        teachingHoursByDate[i].holidayHours,
        teachingHoursByDate[i].travelAllowance,
        teachingHoursByDate[i].travelExpenses
      );
    } else {
      newRow = createData(i, now.getMonth("MMM"), 0, 0, 0, 0, 0);
    }
    rows.push(newRow);
  }

  return (
    <Dialog
      onClose={hideForm}
      aria-labelledby="payroll-sheet-dialog"
      open={stage === "payrollSheet"}
    >
      <DialogTitle id="payroll-sheet-dialog">
        Payroll for {currentTeacher}
      </DialogTitle>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))} */}
        </TableBody>
      </Table>
    </Dialog>
  );
};
export default PayrollSheet;
