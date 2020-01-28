import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TableFooter } from "@material-ui/core";

class PayrollSheet extends Component {
  render() {
    const { classes, rows, currentTeacher } = this.props;

    const sumTeachingMins = () => {
      const sums = {
        totalTeachingHours: 0,
        totalOutsideDutyHours: 0,
        totalHolidayHours: 0,
        totalTravelAllowance: 0,
        totalTravelExpenses: 0
      };
      rows.forEach(r => {
        sums.totalTeachingHours += r.teachingMins / 60;
        sums.totalOutsideDutyHours += r.outsideDutyMins / 60;
        sums.totalHolidayHours += r.holidayMins / 60;
        sums.totalTravelAllowance += r.travelAllowance;
        sums.totalTravelExpenses += r.travelExpenses;
      });
      return sums;
    };
    const sums = sumTeachingMins();

    console.log(sums);
    return (
      <div className={classes.table}>
        <DialogTitle id="payroll-sheet-dialog">
          Payroll for {currentTeacher}
        </DialogTitle>
        <Table className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Month</TableCell>
              <TableCell align="right">Teaching Mins</TableCell>
              <TableCell align="right">Outside DH</TableCell>
              <TableCell align="right">Holiday Work</TableCell>
              <TableCell align="right">Travel Allowance</TableCell>
              <TableCell align="right">Travel Expenses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.date}>
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="right">{row.month}</TableCell>
                <TableCell align="right">{row.teachingMins}</TableCell>
                <TableCell align="right">{row.outsideDutyMins}</TableCell>
                <TableCell align="right">{row.holidayMins}</TableCell>
                <TableCell align="right">{row.travelAllowance}</TableCell>
                <TableCell align="right">{row.travelExpenses}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell size="medium">Total Teaching Hours:</TableCell>
              <TableCell className={classes.totals}>
                {sums.totalTeachingHours}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Over Threshold One Hours:</TableCell>
              <TableCell className={classes.totals}>Placeholder</TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Over Threshold Two Hours:</TableCell>
              <TableCell className={classes.totals}>Placeholder</TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Outside DH Hours:</TableCell>
              <TableCell className={classes.totals}>
                {sums.totalOutsideDutyHours}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Holiday Work Hours:</TableCell>
              <TableCell className={classes.totals}>
                {sums.totalHolidayHours}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}
export default PayrollSheet;
