const Student = require("./student.model");
const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const Schema = mongoose.Schema;
const EventSchema = new Schema(
  {
    id: { type: String },
    title: { type: String },
    type: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    duration: { type: Number, required: true },
    resourceId: { type: Number, required: true },
    room: { type: Number },
    isHidden: { type: Boolean, default: false },
    isRecurring: { type: Boolean, default: false },
    isHoliday: { type: Boolean, default: false },
    isNewEvent: { type: Boolean, default: false },
    isLast: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    isSameDayCancellation: { type: Boolean, default: false },
    students: { type: [Student.StudentSchema] },
    absentees: { type: [Student.StudentSchema] },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
