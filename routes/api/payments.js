const router = require("express").Router();
let Payment = require("../../models/payment.model");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  Payment.find()
    .then((payments) => res.json(payments))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", auth, (req, res) => {
  const resourceId = req.body.resourceId;
  const paymentPeriodStart = req.body.paymentPeriodStart;
  const paymentPeriodEnd = req.body.paymentPeriodEnd;
  const totalTeachingHours = req.body.totalTeachingHours;
  const paidVacationDays = req.body.paidVacationDays;
  const unpaidVacationDays = req.body.unpaidVacationDays;
  const paidSickDays = req.body.paidSickDays;
  const unpaidSickDays = req.body.unpaidSickDays;
  const overThresholdOneAllowance = req.body.overThresholdOneAllowance;
  const overThresholdTwoAllowance = req.body.overThresholdTwoAllowance;
  const outsideDutyHoursAllowance = req.body.outsideDutyHoursAllowance;
  const holidayAllowance = req.body.holidayAllowance;
  const healthInsur = req.body.healthInsur;
  const pension = req.body.pension;
  const employmentInsur = req.body.employmentInsur;
  const travelAllowance = req.body.travelAllowance;
  const travelExpenses = req.body.travelExpenses;
  const incomeTaxReservation = req.body.incomeTaxReservation;
  const taxRefund = req.body.taxRefund;
  const grossPayment = req.body.grossPayment;
  const payroll = req.body.payroll;

  const newPayment = new Payment({
    resourceId,
    paymentPeriodStart,
    paymentPeriodEnd,
    totalTeachingHours,
    paidVacationDays,
    unpaidVacationDays,
    paidSickDays,
    unpaidSickDays,
    overThresholdOneAllowance,
    overThresholdTwoAllowance,
    outsideDutyHoursAllowance,
    holidayAllowance,
    healthInsur,
    pension,
    employmentInsur,
    travelAllowance,
    travelExpenses,
    incomeTaxReservation,
    taxRefund,
    grossPayment,
    payroll,
  });

  newPayment
    .save()
    .then(() => res.json("Payment added!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", auth, (req, res) => {
  Payment.findById(req.params.id)
    .then((payment) => res.json(payment))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", auth, (req, res) => {
  Payment.findByIdAndDelete(req.params.id)
    .then(() => res.json("Payment deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", auth, (req, res) => {
  Payment.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json("Payment updated!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
