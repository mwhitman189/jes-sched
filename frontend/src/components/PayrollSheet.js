import React from "react";
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
  TravelAllowance,
  TravelExpenses
) {
  return {
    date,
    month,
    teachingHours,
    outsideDutyHours,
    holidayHours,
    TravelAllowance,
    TravelExpenses
  };
}
const now = new Date();
const month_start = new Date(now.getFullYear(), now.getMonth(), 1);
const month_end = new Date(now.getFullYear(), now.getMonth() + 2, 0);

// const rows = days.map(d =>
//   createData(
//     d.date,
//     d.month,
//     d.teachingHours,
//     d.outsideDutyHours,
//     d.holidayHours,
//     d.TravelAllowance,
//     d.TravelExpenses
//   )
// );

const PayrollSheet = props => {
  const classes = useStyles();
  const { currentTeacher, stage, hideForm } = props;

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
