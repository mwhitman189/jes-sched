const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    resourceId: { type: Number, required: true },
    paymentPeriodStart: { type: Date, required: true },
    paymentPeriodEnd: { type: Date, required: true },
    totalTeachingHours: { type: Number, required: true },
    paidVacationDays: { type: Number, required: true },
    unpaidVacationDays: { type: Number, required: true },
    paidSickDays: { type: Number, required: true },
    unpaidSickDays: { type: Number, required: true },
    overThresholdOneAllowance: { type: Number, required: true },
    overThresholdTwoAllowance: { type: Number, required: true },
    outsideDutyHoursAllowance: { type: Number, required: true },
    holidayAllowance: { type: Number, required: true },
    healthInsur: { type: Number, required: true },
    pension: { type: Number, required: true },
    employmentInsur: { type: Number, required: true },
    travelAllowance: { type: Number, required: true },
    travelExpenses: { type: Number, required: true },
    incomeTaxReservation: { type: Number, required: true },
    taxRefund: { type: Number, required: true },
    grossPayment: { type: Number, required: true },
    payroll: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
