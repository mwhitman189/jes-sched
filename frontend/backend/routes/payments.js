const router = require("express").Router();
let Payment = require("../models/payment.model");

router.get("/", (req, res) => {
  Payment.find()
    .then(payments => res.json(payments))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post("/add", (req, res) => {
  const resourceId = req.body.resourceId;
  const paymentPeriodStart = req.body.paymentPeriodStart;
  const paymentPeriodEnd = req.body.paymentPeriodEnd;
  const totalTeachingHours = req.body.totalTeachingHours;
  const paidVacationDays = req.body.paidVacationDays;
  const unpaidVacationDays = req.body.unpaidVacationDays;
  const paidSickDays = req.body.paidSickDays;
  const unpaidSickDays = req.body.unpaidSickDays;
  const overThresholdOneHours = req.body.overThresholdOneHours;
  const overThresholdTwoHours = req.body.overThresholdTwoHours;
  const outsideDutyTimeHours = req.body.outsideDutyTimeHours;
  const holidayHours = req.body.holidayHours;
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
    overThresholdOneHours,
    overThresholdTwoHours,
    outsideDutyTimeHours,
    holidayHours,
    healthInsur,
    pension,
    employmentInsur,
    travelAllowance,
    travelExpenses,
    incomeTaxReservation,
    taxRefund,
    grossPayment,
    payroll
  });

  newPayment
    .save()
    .then(() => res.json("Payment added!"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", (req, res) => {
  Payment.findById(req.params.id)
    .then(payment => res.json(payment))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", (req, res) => {
  Payment.findByIdAndDelete(req.params.id)
    .then(() => res.json("Payment deleted"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", (req, res) => {
  Payment.findById(req.params.id)
    .then(payment => {
      for (let itemFromBodyIndex in req.body) {
        if (req.body.hasOwnProperty(itemFromBodyIndex)) {
          payment[itemFromBodyIndex] = req.body[itemFromBodyIndex];
        }
      }

      payment
        .save()
        .then(() => res.json("Payment updated!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
