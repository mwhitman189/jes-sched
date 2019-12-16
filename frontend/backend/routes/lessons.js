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

router.get("/:id", (req, res) => {
  Lesson.findById(req.params.id)
    .then(lesson => res.json(lesson))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.delete("/:id", (req, res) => {
  Lesson.findByIdAndDelete(req.params.id)
    .then(() => res.json("Lesson deleted"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", (req, res) => {
  Lesson.findById(req.params.id).then(lesson => {
    if (req.body.hasOwnProperty("groupId")) {
      lesson.groupId = req.body.groupId;
    }
    if (req.body.hasOwnProperty("title")) {
      lesson.title = req.body.title;
    }
    if (req.body.hasOwnProperty("type")) {
      lesson.type = req.body.type;
    }
    if (req.body.hasOwnProperty("start")) {
      lesson.start = Date.parse(req.body.start);
      console.log(lesson.start);
    }
    if (req.body.hasOwnProperty("end")) {
      lesson.end = Date.parse(req.body.end);
      console.log(lesson.end);
    }
    if (req.body.hasOwnProperty("duration")) {
      lesson.duration = Number(req.body.duration);
      console.log(lesson.duration);
    }
    if (req.body.hasOwnProperty("resourceId")) {
      lesson.resourceId = Number(req.body.resourceId);
    }
    if (req.body.hasOwnProperty("room")) {
      lesson.room = Number(req.body.room);
    }
    if (req.body.hasOwnProperty("hide")) {
      lesson.hide = req.body.hide;
    }

    lesson
      .save()
      .then(() => res.json("Lesson updated!"))
      .catch(err => res.status(400).json(`Error: ${err}`));
  });
});

module.exports = router;
