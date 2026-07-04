"use strict";

const { Issue, Project } = require("../models/models");
const Helper = require("../utils/helpers");

const issueController = {
  async viewIssues(req, res) {
    try {
      const projectName = req.params.project;

      const project = await Project.findOne({ projectName });

      if (!project) return res.json([]);

      let issues = project.issues;

      Object.keys(req.query).forEach((key) => {
        let value = req.query[key];

        if (key === "open") value = value === "true";

        if (key === "_id") {
          issues = issues.filter((i) => i._id.toString() === value);
        } else {
          issues = issues.filter((i) => i[key] == value);
        }
      });

      return res.json(issues);
    } catch {
      return res.json([]);
    }
  },

  async createIssue(req, res) {
    try {
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to = "",
        status_text = "",
      } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({
          error: "required field(s) missing",
        });
      }

      let project = await Project.findOne({
        projectName: req.params.project,
      });

      if (!project) {
        project = new Project({
          projectName: req.params.project,
          issues: [],
        });
      }

      project.issues.push({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      });

      await project.save();

      const savedIssue = project.issues[project.issues.length - 1];

      return res.json(savedIssue);
    } catch (err) {
      console.log(err);
      return res.json({
        error: "server error",
      });
    }
  },

  async editIssue(req, res) {
    try {
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: "missing _id" });
      }

      const update = { ...req.body };
      delete update._id;

      Helper.removeUndefinedAndEmptyStringValuesFromObj(update);

      if (Object.keys(update).length === 0) {
        return res.json({
          error: "no update field(s) sent",
          _id,
        });
      }

      const project = await Project.findOne({
        projectName: req.params.project,
      });

      if (!project) {
        return res.json({ error: "could not update", _id });
      }

      const issue = project.issues.id(_id);

      if (!issue) {
        return res.json({ error: "could not update", _id });
      }

      Object.assign(issue, update);
      issue.updated_on = new Date();

      await project.save();

      return res.json({
        result: "successfully updated",
        _id,
      });
    } catch {
      return res.json({
        error: "could not update",
        _id: req.body._id,
      });
    }
  },

  async deleteIssue(req, res) {
    try {
      const { _id } = req.body;

      if (!_id) {
        return res.json({
          error: "missing _id",
        });
      }

      const project = await Project.findOne({
        projectName: req.params.project,
      });

      if (!project) {
        return res.json({
          error: "could not delete",
          _id,
        });
      }

      const issue = project.issues.id(_id);

      if (!issue) {
        return res.json({
          error: "could not delete",
          _id,
        });
      }

      project.issues.pull({ _id });

      await project.save();

      return res.json({
        result: "successfully deleted",
        _id,
      });
    } catch (err) {
      return res.json({
        error: "could not delete",
        _id: req.body._id,
      });
    }
  },
};

module.exports = issueController;
