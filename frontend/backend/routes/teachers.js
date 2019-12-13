const router = require("express").Router();
let Teacher = require("../models/teacher.model");

router.get("/", (req, res) => {
  Teacher.find()
    .then(teachers => res.json(teachers))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post("/add", (req, res) => {
  const name = req.body.name;
  const teachingMins = req.body.teachingMins;

  const newTeacher = new Teacher({ name, teachingMins });

  newTeacher
    .save()
    .then(() => res.json("Teacher added!"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
