"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const mongoose = require("mongoose");
mongoose.connect(process.env.DB);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});
db.on("error", console.error);

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/:project/").get((req, res) => {
  res.sendFile(process.cwd() + "/views/issue.html");
});

app.route("/").get((req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

fccTestingRoutes(app);
app.use("/api", apiRoutes);

app.use((req, res) => {
  res.status(404).type("text").send("Not Found");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + listener.address().port);

  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(() => {
      try {
        runner.run();
      } catch (e) {
        console.log("Tests error:", e);
      }
    }, 3500);
  }
});

module.exports = app;
