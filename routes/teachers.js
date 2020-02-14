const router = require("express").Router();
let Teacher = require("../models/teacher.model");
const auth = require("../middleware/auth");

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
  const otThreshold = req.body.otThreshold;
  const contractType = req.body.contractType;
  const dependentsNum = req.body.dependentsNum;
  const isPartTime = req.body.isPartTime;

  const newTeacher = new Teacher({
    resourceId,
    resourceTitle,
    name,
    familyName,
    otThreshold,
    contractType,
    dependentsNum,
    isPartTime
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

router.delete("/delete/:id", (req, res) => {
  Teacher.findByIdAndDelete(req.params.id)
    .then(() => res.json("Teacher deleted"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", (req, res) => {
  Teacher.findById(req.params.id)
    .then(teacher => {
      for (let itemFromBodyIndex in req.body) {
        if (req.body.hasOwnProperty(itemFromBodyIndex)) {
          teacher[itemFromBodyIndex] = req.body[itemFromBodyIndex];
        }
      }

      teacher
        .save()
        .then(() => res.json("Teacher updated!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
