const router = require("express").Router();
const Lesson = require("../models/lesson.model");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  Lesson.find()
    .then(lessons => res.json(lessons))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.post("/add", (req, res) => {
  req.body.map(item => {
    const title = item.title;
    const type = item.type;
    const start = Date.parse(item.start);
    const end = Date.parse(item.end);
    const duration = Number(item.duration);
    const resourceId = Number(item.resourceId);
    const room = Number(item.room);
    const hide = item.hide;
    const recur = item.recur;
    const isHoliday = item.isHoliday;
    const isNewEvent = item.isNewEvent;
    const isLast = item.isLast;

    const newLesson = new Lesson({
      title,
      type,
      start,
      end,
      duration,
      resourceId,
      room,
      hide,
      recur,
      isHoliday,
      isNewEvent,
      isLast
    });

    return newLesson
      .save()
      .then(() => res.json("Lesson added!"))
      .catch(err => res.status(400).json(`Error: ${err}`));
  });
});

router.get("/:id", (req, res) => {
  Lesson.findById(req.params.id)
    .then(lesson => res.json(lesson))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/:id", (req, res) => {
  Lesson.findByIdAndDelete(req.params.id)
    .then(() => res.json("Lesson deleted"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", (req, res) => {
  Lesson.findById(req.params.id).then(lesson => {
    for (let itemFromBodyIndex in req.body) {
      if (req.body.hasOwnProperty(itemFromBodyIndex)) {
        lesson[itemFromBodyIndex] = req.body[itemFromBodyIndex];
      }
    }

    lesson
      .save()
      .then(() => res.json("Lesson updated!"))
      .catch(err => res.status(400).json(`Error: ${err}`));
  });
});

module.exports = router;
