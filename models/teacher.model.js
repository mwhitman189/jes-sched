const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

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
    minsByDate: {
      1: { type: Number, trim: true, default: 0 },
      2: { type: Number, trim: true, default: 0 },
      3: { type: Number, trim: true, default: 0 },
      4: { type: Number, trim: true, default: 0 },
      5: { type: Number, trim: true, default: 0 },
      6: { type: Number, trim: true, default: 0 },
      7: { type: Number, trim: true, default: 0 },
      8: { type: Number, trim: true, default: 0 },
      9: { type: Number, trim: true, default: 0 },
      10: { type: Number, trim: true, default: 0 },
      11: { type: Number, trim: true, default: 0 },
      12: { type: Number, trim: true, default: 0 },
      13: { type: Number, trim: true, default: 0 },
      14: { type: Number, trim: true, default: 0 },
      15: { type: Number, trim: true, default: 0 },
      16: { type: Number, trim: true, default: 0 },
      17: { type: Number, trim: true, default: 0 },
      18: { type: Number, trim: true, default: 0 },
      19: { type: Number, trim: true, default: 0 },
      20: { type: Number, trim: true, default: 0 },
      21: { type: Number, trim: true, default: 0 },
      22: { type: Number, trim: true, default: 0 },
      23: { type: Number, trim: true, default: 0 },
      24: { type: Number, trim: true, default: 0 },
      25: { type: Number, trim: true, default: 0 },
      26: { type: Number, trim: true, default: 0 },
      27: { type: Number, trim: true, default: 0 },
      28: { type: Number, trim: true, default: 0 },
      29: { type: Number, trim: true, default: 0 },
      30: { type: Number, trim: true, default: 0 },
      31: { type: Number, trim: true, default: 0 },
    },
    outsideDutyMins: { type: Number, trim: true, required: true, default: 0 },
    holidayMins: { type: Number, trim: true, required: true, default: 0 },
    travelAllowance: { type: Number, trim: true, required: true, default: 0 },
    travelExpenses: { type: Number, trim: true, required: true, default: 0 },
    overThresholdOneMins: {
      type: Number,
      trim: true,
      default: 0,
    },
    overThresholdTwoMins: {
      type: Number,
      trim: true,
      default: 0,
    },
    contractType: { type: String, trim: true, required: true },
    dependentsNum: { type: Number, trim: true, default: 0 },
    isPartTime: { type: Boolean, trim: true, default: false },
    isSub: { type: Boolean, trim: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", TeacherSchema);

module.exports = Teacher;
