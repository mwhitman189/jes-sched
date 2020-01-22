import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DialogTitle from "@material-ui/core/DialogTitle";

class PayrollSheet extends Component {
  render() {
    const { classes, rows, currentTeacher } = this.props;
    return (
      <div>
        <DialogTitle id="payroll-sheet-dialog">
          Payroll for {currentTeacher}
        </DialogTitle>
        <Table className={classes.table} aria-label="simple table">
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
                <TableCell align="right">{row.teachingHours}</TableCell>
                <TableCell align="right">{row.outsideDutyHours}</TableCell>
                <TableCell align="right">{row.holidayHours}</TableCell>
                <TableCell align="right">{row.travelAllowance}</TableCell>
                <TableCell align="right">{row.travelExpenses}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
export default PayrollSheet;
