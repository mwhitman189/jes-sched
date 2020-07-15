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

    newLesson
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

router.delete("/delete/one/:id", auth, (req, res) => {
  Lesson.findByIdAndDelete(req.params.id)
    .then(() => res.json("Lesson deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/all/:id", auth, (req, res) => {
  const today = new Date().setHours(24);

  Lesson.deleteMany({ id: req.params.id, start: { $gt: today } })
    .then(() => res.json("Lesson deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", auth, (req, res) => {
  Lesson.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json("Lesson updated!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
