const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeacherSchema = new Schema(
  {
    resourceId: { type: Number, trim: true, required: true },
    resourceTitle: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    familyName: { type: String, trim: true, required: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      required: true,
    },
    otThreshold: { type: Number, trim: true },
    teachingMins: { type: Number, trim: true, required: true, default: 0 },
    outsideDutyMins: { type: Number, trim: true, required: true, default: 0 },
    holidayMins: { type: Number, trim: true, required: true, default: 0 },
    travelAllowance: { type: Number, trim: true, required: true, default: 0 },
    travelExpenses: { type: Number, trim: true, required: true, default: 0 },
    overThresholdOneMins: {
      type: Number,
      trim: true,
      required: true,
      default: 0,
    },
    overThresholdTwoMins: {
      type: Number,
      trim: true,
      required: true,
      default: 0,
    },
    contractType: { type: String, trim: true, required: true },
    dependentsNum: { type: Number, trim: true, default: 0 },
    isPartTime: { type: Boolean, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;
