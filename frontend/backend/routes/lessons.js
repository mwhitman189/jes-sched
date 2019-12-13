const router = require("express").Router();
let Lesson = require("../models/lesson.model");

router.get("/", (req, res) => {
  Lesson.find()
    .then(lessons => res.json(lessons))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post("/add", (req, res) => {
  const groupId = req.body.groupId;
  const title = req.body.title;
  const type = req.body.type;
  const start = Date.parse(req.body.start);
  const end = Date.parse(req.body.end);
  const duration = Number(req.body.duration);
  const resourceId = Number(req.body.resourceId);
  const room = Number(req.body.room);
  const hide = req.body.hide;

  const newLesson = new Lesson({
    groupId,
    title,
    type,
    start,
    end,
    duration,
    resourceId,
    room,
    hide
  });

  newLesson
    .save()
    .then(() => res.json("Lesson added!"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/:id").get((req, res) => {
  Lesson.findById(req.params.id)
    .then(lesson => res.json(lesson))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/:id").delete((req, res) => {
  Lesson.findByIdAndDelete(req.params.id)
    .then(() => res.json("Lesson deleted"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.route("/update/:id").post((req, res) => {
  Lesson.findById(req.params.id)
    .then(lesson => {
      lesson.groupId = req.body.groupId;
      lesson.title = req.body.title;
      lesson.type = req.body.type;
      lesson.start = req.body.start;
      lesson.end = req.body.end;
      lesson.duration = req.body.duration;
      lesson.resourceId = req.body.resourceId;
      lesson.room = req.body.room;
      lesson.hide = req.body.hide;

      lesson
        .save()
        .then(() => res.json("Lesson updated!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
