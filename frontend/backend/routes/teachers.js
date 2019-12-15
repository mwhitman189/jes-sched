const router = require("express").Router();
let Teacher = require("../models/teacher.model");

router.get("/", (req, res) => {
  Teacher.find()
    .then(teachers => res.json(teachers))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post("/add", (req, res) => {
  const resourceId = req.body.resourceId;
  const resourceTitle = req.body.resourceTitle;
  const name = req.body.name;
  const familyName = req.body.familyName;
  const teachingMins = req.body.teachingMins;

  const newTeacher = new Teacher({
    resourceId,
    resourceTitle,
    name,
    familyName,
    teachingMins
  });

  newTeacher
    .save()
    .then(() => res.json("Teacher added!"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.get("/:id", (req, res) => {
  Teacher.findById(req.params.id)
    .then(teacher => res.json(teacher))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.delete("/:id", (req, res) => {
  Teacher.findByIdAndDelete(req.params.id)
    .then(() => res.json("Teacher deleted"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", (req, res) => {
  Teacher.findById(req.params.id)
    .then(teacher => {
      if (req.body.resourceId) {
        teacher.resourceId = req.body.resourceId;
      }
      if (req.body.resourceTitle) {
        teacher.resourceTitle = req.body.resourceTitle;
      }
      if (req.body.name) {
        teacher.name = req.body.name;
      }
      if (req.body.familyName) {
        teacher.familyName = req.body.familyName;
      }
      if (req.body.teachingMins) {
        teacher.teachingMins = req.body.teachingMins;
      }

      teacher
        .save()
        .then(() => res.json("Teacher updated!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
