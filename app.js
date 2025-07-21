var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

var bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

//database connection with test if it is connected or not
mongoose
  .connect("mongodb://localhost:27017/gearsdb")
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log("MongoDb connection error:", err));

app.use("/api/user", userRoutes);

app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});
