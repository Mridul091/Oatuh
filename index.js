const express = require("express");
const authRoutes = require("./routes/auth.js");
const bodyParser = require("body-parser");
const crypto = require("crypto");
// const { Client } = require("pg");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

function generateRandomString(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(express.json());
app.use("/", authRoutes);

module.exports.generateRandomString = generateRandomString;
