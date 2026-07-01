"use strict";

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const app = express();

// ✅ FIX: clean MongoDB connect (NO OPTIONS)
mongoose
  .connect(process.env.DB)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// middleware
app.use("/public", express.static(process.cwd() + "/public"));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.route("/:project/").get((req, res) => {
  res.sendFile(process.cwd() + "/views/issue.html");
});

app.route("/").get((req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

fccTestingRoutes(app);
apiRoutes(app);

// 404
app.use((req, res) => {
  res.status(404).type("text").send("Not Found");
});

// start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + listener.address().port);

  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(() => runner.run(), 3000);
  }
});

module.exports = app;
