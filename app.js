var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cors = require("cors");

var bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

//database connection with test if it is connected or not
mongoose
  .connect("mongodb://localhost:27017/gearsdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log("MongoDb connection error:", err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${port}`);
});
