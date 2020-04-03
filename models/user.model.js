const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    givenName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    familyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      default: teacher
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
