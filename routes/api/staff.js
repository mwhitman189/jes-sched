const router = require("express").Router();
let Staff = require("../../models/staff.model");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  Staff.find()
    .then((staff) => res.json(staff))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", auth, (req, res) => {
  const newStaff = new Staff({ role: "staff" });
  for (let itemFromBodyIndex in req.body) {
    newStaff[itemFromBodyIndex] = req.body[itemFromBodyIndex];
  }

  newStaff
    .save()
    .then(() => res.json("Staff member added!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", auth, (req, res) => {
  Staff.findById(req.params.id)
    .then((staff) => res.json(staff))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", auth, (req, res) => {
  Staff.findByIdAndDelete(req.params.id)
    .then(() => res.json("Staff member deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", auth, (req, res) => {
  Staff.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json("Staff updated!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
