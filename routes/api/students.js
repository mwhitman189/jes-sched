const router = require("express").Router();
let { Student } = require("../../models/student.model");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  Student.find()
    .then((students) => res.json(students))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", auth, (req, res) => {
  const newStudent = new Student({});
  for (let itemFromBodyIndex in req.body) {
    newStudent[itemFromBodyIndex] = req.body[itemFromBodyIndex];
  }

  newStudent
    .save()
    .then(() => res.json("Student added!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", auth, (req, res) => {
  Student.findById(req.params.id)
    .then((student) => res.json(student))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", auth, (req, res) => {
  Student.findByIdAndDelete(req.params.id)
    .then(() => res.json("Student deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", auth, (req, res) => {
  Student.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json("Student updated!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
