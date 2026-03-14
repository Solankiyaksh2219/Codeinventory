const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: String,
  email: String,
  address: String
});

module.exports = mongoose.model("Customer", customerSchema);