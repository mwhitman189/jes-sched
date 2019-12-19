const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lessonSchema = new Schema(
  {
    groupId: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    duration: { type: Number, required: true },
    resourceId: { type: Number, required: true },
    room: { type: Number, required: true },
    hide: { type: Boolean, required: false },
    recur: { type: Boolean, required: false }
  },
  {
    timestamps: true
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
