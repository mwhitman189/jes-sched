const Student = require("./student.model");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const LessonSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    duration: { type: Number, required: true },
    resourceId: { type: Number, required: true },
    room: { type: Number },
    hide: { type: Boolean, default: false },
    recur: { type: Boolean, default: false },
    isHoliday: { type: Boolean, default: false },
    isNewEvent: { type: Boolean, default: false },
    isLast: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
    sameDayCancellation: { type: Boolean, default: false },
    students: [Student.StudentSchema],
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
