const router = require("express").Router();
const Teacher = require("../../models/teacher.model");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  Teacher.find()
    .then((teachers) => res.json(teachers))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", auth, (req, res) => {
  const newTeacher = new Teacher({});
  for (let itemFromBodyIndex in req.body) {
    newTeacher[itemFromBodyIndex] = req.body[itemFromBodyIndex];
  }

  newTeacher
    .save()
    .then(() => res.json("Teacher added!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", auth, (req, res) => {
  Teacher.findById(req.params.id)
    .then((teacher) => res.json(teacher))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", auth, (req, res) => {
  Teacher.findByIdAndDelete(req.params.id)
    .then(() => res.json("Teacher deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", auth, (req, res) => {
  Teacher.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json("Teacher updated!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
