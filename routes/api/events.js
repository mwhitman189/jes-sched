const router = require("express").Router();
const Event = require("../../models/event.model");
const auth = require("../../middleware/auth");

router.get("/", auth, (req, res) => {
  Event.find()
    .then((events) => res.json(events))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/add", auth, (req, res) => {
  // Loop through events if recurrences are present
  req.body.map((item) => {
    const newEvent = new Event({});
    for (let itemFromBodyIndex in item) {
      newEvent[itemFromBodyIndex] = item[itemFromBodyIndex];
    }

    newEvent
      .save()
      .then(() => res.json("Event added!"))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
});

router.get("/:id", auth, (req, res) => {
  Event.findById(req.params.id)
    .then((event) => res.json(event))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/one/:id", auth, (req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json("Event deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/delete/all/:id", auth, (req, res) => {
  const today = new Date().setHours(24);

  Event.deleteMany({ id: req.params.id, start: { $gt: today } })
    .then(() => res.json("Event deleted"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.put("/update/:id", auth, (req, res) => {
  Event.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(() => res.json("Event updated!"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
