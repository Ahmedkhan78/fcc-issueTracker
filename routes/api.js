"use strict";

const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  project: String,
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_by: { type: String, required: true },
  assigned_to: { type: String, default: "" },
  status_text: { type: String, default: "" },
  open: { type: Boolean, default: true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = function (app) {
  // ================= POST =================
  app.post("/api/issues/:project", async (req, res) => {
    const { issue_title, issue_text, created_by } = req.body;

    if (!issue_title || !issue_text || !created_by) {
      return res.status(400).json({
        error: "required field(s) missing",
      });
    }

    const issue = new Issue({
      project: req.params.project,
      issue_title,
      issue_text,
      created_by,
      assigned_to: req.body.assigned_to || "",
      status_text: req.body.status_text || "",
      open: true,
    });

    const saved = await issue.save();
    return res.json(saved);
  });

  // ================= GET =================
  app.get("/api/issues/:project", async (req, res) => {
    const filter = { project: req.params.project };

    Object.keys(req.query).forEach((key) => {
      if (key === "open") {
        filter.open = req.query.open === "true";
      } else {
        filter[key] = req.query[key];
      }
    });

    const issues = await Issue.find(filter).select("-__v");
    return res.json(issues);
  });

  // ================= PUT =================
  app.put("/api/issues/:project", async (req, res) => {
    const { _id, ...updates } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: "missing _id",
      });
    }

    const clean = {};

    Object.keys(updates).forEach((k) => {
      if (updates[k] !== "" && updates[k] !== undefined) {
        clean[k] = updates[k];
      }
    });

    if (Object.keys(clean).length === 0) {
      return res.status(400).json({
        error: "no update field(s) sent",
        _id,
      });
    }

    clean.updated_on = new Date();

    try {
      const updated = await Issue.findByIdAndUpdate(_id, clean, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(400).json({
          error: "could not update",
          _id,
        });
      }

      return res.json({
        result: "successfully updated",
        _id,
      });
    } catch (err) {
      return res.status(400).json({
        error: "could not update",
        _id,
      });
    }
  });

  // ================= DELETE =================
  app.delete("/api/issues/:project", async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: "missing _id",
      });
    }

    try {
      const deleted = await Issue.findByIdAndDelete(_id);

      if (!deleted) {
        return res.status(400).json({
          error: "could not delete",
          _id,
        });
      }

      return res.json({
        result: "successfully deleted",
        _id,
      });
    } catch (err) {
      return res.status(400).json({
        error: "could not delete",
        _id,
      });
    }
  });
};
