import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TableFooter } from "@material-ui/core";
import contracts from "../contracts";
import { addPayment } from "../helperFunctions";

class PayrollSheet extends Component {
  render() {
    const {
      classes,
      rows,
      currentTeacher,
      paymentPeriodStart,
      paymentPeriodEnd,
      taxRefund,
      paidVacationDays,
      unpaidVacationDays,
      paidSickDays,
      unpaidSickDays
    } = this.props;
    const contract = contracts[currentTeacher.contractType];

    const sumTeachingMins = () => {
      const sums = {
        totalTeachingHours: 0,
        overThresholdOneAllowance: 0,
        overThresholdTwoAllowance: 0,
        totalOutsideDutyHoursAllowance: 0,
        totalHolidayAllowance: 0,
        totalTravelAllowance: 0,
        totalTravelExpenses: 0
      };

      rows.forEach(r => {
        sums.totalTeachingHours +=
          Math.round((r.teachingMins / 60 + Number.EPSILON) * 100) / 100;
        if (r.overThresholdOneMins > 0) {
          sums.overThresholdOneAllowance +=
            (Math.round((r.overThresholdOneMins / 60 + Number.EPSILON) * 100) /
              100) *
            contract.otWageOne;
        }
        if (r.overThresholdTwoMins > 0) {
          sums.overThresholdTwoAllowance +=
            (Math.round((r.overThresholdTwoMins / 60 + Number.EPSILON) * 100) /
              100) *
            contract.otWageTwo;
        }
        if (r.outsideDutyMins > 0) {
          sums.totalOutsideDutyHoursAllowance +=
            (Math.round((r.outsideDutyMins / 60 + Number.EPSILON) * 100) /
              100) *
            contract.otWageOne;
        }
        if (r.holidayMins > 0) {
          sums.totalHolidayAllowance +=
            (Math.round((r.holidayMins / 60 + Number.EPSILON) * 100) / 100) *
            contract.otWageOne;
        }
        sums.totalTravelAllowance += r.travelAllowance;
        sums.totalTravelExpenses += r.travelExpenses;
      });
      return sums;
    };
    const sums = sumTeachingMins();

    const grossPayment =
      contract.baseSalary +
      sums.overThresholdOneAllowance +
      sums.overThresholdTwoAllowance +
      sums.totalOutsideDutyHoursAllowance +
      sums.totalHolidayAllowance +
      sums.totalTravelAllowance +
      sums.totalTravelExpenses;

    const incomeTaxReservation = Math.round(grossPayment * contract.taxRate);

    const payroll =
      grossPayment +
      taxRefund -
      (contract.healthInsur +
        contract.pension +
        contract.employmentInsur +
        incomeTaxReservation);
    console.log(grossPayment);

    const submitPayrollData = () => {
      const newPayment = {
        resourceId: currentTeacher.resourceId,
        paymentPeriodStart: paymentPeriodStart,
        paymentPeriodEnd: paymentPeriodEnd,
        totalTeachingHours: sums.totalTeachingHours,
        paidVacationDays: paidVacationDays,
        unpaidVacationDays: unpaidVacationDays,
        paidSickDays: paidSickDays,
        unpaidSickDays: unpaidSickDays,
        overThresholdOneAllowance: sums.overThresholdOneAllowance,
        overThresholdTwoAllowance: sums.overThresholdTwoAllowance,
        outsideDutyHoursAllowance: sums.totalOutsideDutyHoursAllowance,
        holidayAllowance: sums.totalHolidayAllowance,
        healthInsur: contract.healthInsur,
        pension: contract.pension,
        employmentInsur: contract.employmentInsur,
        travelAllowance: sums.travelAllowance,
        travelExpenses: sums.travelExpenses,
        incomeTaxReservation: incomeTaxReservation,
        taxRefund: taxRefund,
        grossPayment: grossPayment,
        payroll: payroll
      };
      addPayment(newPayment);
    };

    return (
      <div className={classes.table}>
        <DialogTitle id="payroll-sheet-dialog">
          Payroll for {currentTeacher.name}
        </DialogTitle>
        <Table className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="right">Day</TableCell>
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
                <TableCell align="right">{row.day}</TableCell>
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
              <TableCell size="medium">Base Salary</TableCell>
              <TableCell className={classes.totals}>
                ¥{contract.baseSalary.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Total Teaching Hours:</TableCell>
              <TableCell className={classes.totals}>
                {sums.totalTeachingHours}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Over Threshold One Allowance:</TableCell>
              <TableCell className={classes.totals}>
                ¥{sums.overThresholdOneAllowance.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Over Threshold Two Allowance:</TableCell>
              <TableCell className={classes.totals}>
                ¥{sums.overThresholdTwoAllowance.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Outside DH Hours Allowance:</TableCell>
              <TableCell className={classes.totals}>
                ¥{sums.totalOutsideDutyHoursAllowance.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Holiday Work Allowance:</TableCell>
              <TableCell className={classes.totals}>
                ¥{sums.totalHolidayAllowance.toLocaleString()}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell size="medium">Payroll:</TableCell>
              <TableCell className={classes.totals}>
                ¥{payroll.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}
export default PayrollSheet;
