const router = require("express").Router();
const Lesson = require("../../models/lesson.model");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  Lesson.find()
    .then((lessons) => res.json(lessons))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", auth, (req, res) => {
  // Loop through lessons if recurrences are present
  req.body.map((item) => {
    const newLesson = new Lesson({});
    for (let itemFromBodyIndex in item) {
      newLesson[itemFromBodyIndex] = item[itemFromBodyIndex];
    }

    return newLesson
      .save()
      .then(() => res.json("Lesson added!"))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
});

router.get("/:id", auth, (req, res) => {
  Lesson.findById(req.params.id)
    .then((lesson) => res.json(lesson))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", auth, (req, res) => {
  const now = new Date();
  Lesson.deleteMany({ id: req.params.id, start: { $gte: now } }, function (
    err,
    result
  ) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
    .then(() => res.json("Lesson deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", auth, (req, res) => {
  Lesson.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json("Lesson updated!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
