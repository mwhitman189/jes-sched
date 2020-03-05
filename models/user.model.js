const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
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
    is_admin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
