const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const Schema = mongoose.Schema;
const StudentSchema = new Schema(
  {
    givenName: { type: String, required: true, trim: true },
    familyName: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{3}-\d{3,4}-\d{4}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number`,
      },
      required: [true, "Phone number is required"],
    },
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

const Student = mongoose.model("Student", StudentSchema);
module.exports = { Student, StudentSchema };
