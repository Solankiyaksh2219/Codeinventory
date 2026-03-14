const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: String,
  name: String,
  category: String,
  price: Number,
  quantity: Number
});

// 👇 third parameter = EXACT collection name
module.exports = mongoose.model("Product", productSchema, "Oddo");