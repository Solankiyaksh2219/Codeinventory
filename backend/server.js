const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/warehouse", require("./routes/warehouse.routes"));
app.use("/api/product", require("./routes/product.routes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});