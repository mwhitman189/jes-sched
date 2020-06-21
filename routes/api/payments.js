const router = require("express").Router();
let Payment = require("../../models/payment.model");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  Payment.find()
    .then((payments) => res.json(payments))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", auth, (req, res) => {
  const newPayment = new Payment({});
  for (let itemFromBodyIndex in req.body) {
    newPayment[itemFromBodyIndex] = req.body[itemFromBodyIndex];
  }

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
