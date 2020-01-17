const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    resourceId: { type: Number, required: true },
    resourceTitle: { type: String, required: true },
    name: { type: String, required: true },
    familyName: { type: String, required: true },
    otThreshold: { type: Number, required: true },
    teachingMins: { type: Number, required: true, default: 0 },
    outsideDutyMins: { type: Number, required: true, default: 0 },
    holidayMins: { type: Number, required: true, default: 0 },
    travelAllowance: { type: Number, required: true, default: 0 },
    travelExpenses: { type: Number, required: true, default: 0 },
    overThresholdOneMins: { type: Number, required: true, default: 0 },
    overThresholdTwoMins: { type: Number, required: true, default: 0 },
    contractType: { type: String, required: true },
    dependentsNum: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
