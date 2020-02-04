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
    overThresholdOneHours: { type: Number, required: true },
    overThresholdTwoHours: { type: Number, required: true },
    outsideDutyTimeHours: { type: Number, required: true },
    holidayHours: { type: Number, required: true },
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
paymentSchema.createIndex({
  expire_at: { type: Date, default: Date.now, expires: 525960 }
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;