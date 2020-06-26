import React, { Component } from "react";
import contracts from "../constants/contracts";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TableFooter } from "@material-ui/core";
import { addDbPayment } from "../dbCalls";
import { blue } from "@material-ui/core/colors";

const styles = () => ({
  table: {
    padding: "1rem",
    maxWidth: "90vw",
    overflow: "visible",
    height: "auto",
    "& th, td": {
      fontSize: ".7rem",
      padding: "0.1rem",
    },
  },
  title: {
    padding: 0,
    "& h2": {
      fontSize: ".7rem",
      margin: 0,
      padding: 0,
    },
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  btn: {
    color: "#fff",
    cursor: "pointer",
    background: "rgb(20,71,207)",
    background:
      "linear-gradient(0deg, rgba(20,71,207,1) 7%, rgba(49,119,254,1) 100%)",
    border: "none",
    borderRadius: "5px",
    padding: ".3rem .5rem",
    minWidth: "4rem",
    margin: "1rem auto",
  },
  footerRows: {
    width: "100%",
  },
  totals: {
    color: "#21942a",
    fontWeight: "800",
  },
});

class PayrollSheet extends Component {
  render() {
    const {
      classes,
      data,
      currentTeacher,
      paymentPeriodStart,
      paymentPeriodEnd,
      taxRefund,
      paidVacationDays,
      unpaidVacationDays,
      paidSickDays,
      unpaidSickDays,
      setFormType,
    } = this.props;
    const contract = contracts[currentTeacher.contractType];

    console.log(data.rows);
    const sumTeachingMins = () => {
      const sums = {
        totalTeachingHours: 0,
        overThresholdOneAllowance: 0,
        overThresholdTwoAllowance: 0,
        totalOutsideDutyHoursAllowance: 0,
        totalHolidayAllowance: 0,
        totalTravelAllowance: 0,
        totalTravelExpenses: 0,
      };

      data.rows.forEach((r) => {
        sums.totalTeachingHours +=
          Math.round((r.teachingMins / 60 + Number.EPSILON) * 100) / 100;
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
        if (r.travelAllowance > 0) {
          sums.totalTravelAllowance += r.travelAllowance;
        }
        if (r.travelExpenses) {
          sums.totalTravelExpenses += r.travelExpenses;
        }
      });
      if (data.overThresholdOneMins > 0) {
        sums.overThresholdOneAllowance =
          (Math.round((data.overThresholdOneMins / 60 + Number.EPSILON) * 100) /
            100) *
          contract.otWageOne;
      }
      if (data.overThresholdTwoMins > 0) {
        sums.overThresholdTwoAllowance =
          (Math.round((data.overThresholdTwoMins / 60 + Number.EPSILON) * 100) /
            100) *
          contract.otWageTwo;
      }
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
        travelAllowance: sums.totalTravelAllowance,
        travelExpenses: sums.totalTravelExpenses,
        incomeTaxReservation: incomeTaxReservation,
        taxRefund: taxRefund,
        grossPayment: grossPayment,
        payroll: payroll,
      };
      addDbPayment(newPayment);
      setFormType("");
    };

    return (
      <div className={classes.table}>
        <DialogTitle className={classes.title} id="payroll-sheet-dialog">
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
            {data.rows.map((row) => (
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
                {sums.totalTeachingHours.toLocaleString()}
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
        <button className={classes.btn} onClick={submitPayrollData}>
          Save Payment Data
        </button>
      </div>
    );
  }
}
export default withStyles(styles)(PayrollSheet);
