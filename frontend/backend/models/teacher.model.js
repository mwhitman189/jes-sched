const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    resourceId: { type: Number, required: true },
    resourceTitle: { type: String, required: true },
    name: { type: String, required: true },
    familyName: { type: String, required: true },
    teachingMins: { type: Number, required: true },
    contract: { type: String, required: true },
    dependents: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
