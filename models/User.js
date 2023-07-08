const mongoose = require("mongoose");
const validator = require("validator");
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
    maxLength: 30,
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
    maxLength: 30,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    maxLength: 30,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    maxLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

module.exports = mongoose.model("User", UserSchema);
