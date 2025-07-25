const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  roll_no: String,
  name: String,
  age: Number,
  address: String,
  pin_code: String,
  degree: String
});

module.exports = mongoose.model("User", userSchema);
