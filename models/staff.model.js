const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const Schema = mongoose.Schema;

const StaffSchema = new Schema(
  {
    givenName: { type: String, trim: true, required: true },
    familyName: { type: String, trim: true, required: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Staff = mongoose.model("Staff", StaffSchema);

module.exports = Staff;
