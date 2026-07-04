"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;

const server = require("../server");

chai.use(chaiHttp);

let testId = "";

suite("Functional Tests", function () {
  const project = "test-project";

  suite("POST /api/issues/{project}", function () {
    test("Create an issue with every field", function (done) {
      chai
        .request(server)
        .post("/api/issues/" + project)
        .send({
          issue_title: "Bug 1",
          issue_text: "Something is broken",
          created_by: "Ahmed",
          assigned_to: "Dev",
          status_text: "In Progress",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);

          assert.property(res.body, "_id");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");

          assert.equal(res.body.issue_title, "Bug 1");
          assert.equal(res.body.issue_text, "Something is broken");
          assert.equal(res.body.created_by, "Ahmed");
          assert.equal(res.body.assigned_to, "Dev");
          assert.equal(res.body.status_text, "In Progress");
          assert.equal(res.body.open, true);

          testId = res.body._id;

          done();
        });
    });

    test("Create an issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/" + project)
        .send({
          issue_title: "Bug 2",
          issue_text: "Only required fields",
          created_by: "Ahmed",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);

          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);

          done();
        });
    });

    test("Create an issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/" + project)
        .send({
          issue_title: "Missing",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);

          assert.deepEqual(res.body, {
            error: "required field(s) missing",
          });

          done();
        });
    });
  });

  suite("GET /api/issues/{project}", function () {
    test("View issues", function (done) {
      chai
        .request(server)
        .get("/api/issues/" + project)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test("Filter one field", function (done) {
      chai
        .request(server)
        .get("/api/issues/" + project)
        .query({ created_by: "Ahmed" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test("Filter multiple fields", function (done) {
      chai
        .request(server)
        .get("/api/issues/" + project)
        .query({ created_by: "Ahmed", open: true })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  suite("PUT /api/issues/{project}", function () {
    test("Update one field", function (done) {
      chai
        .request(server)
        .put("/api/issues/" + project)
        .send({
          _id: testId,
          issue_text: "Updated text",
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            result: "successfully updated",
            _id: testId,
          });

          done();
        });
    });

    test("Update multiple fields", function (done) {
      chai
        .request(server)
        .put("/api/issues/" + project)
        .send({
          _id: testId,
          issue_title: "Updated title",
          assigned_to: "New Dev",
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            result: "successfully updated",
            _id: testId,
          });

          done();
        });
    });

    test("Update missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/" + project)
        .send({
          issue_text: "No ID",
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: "missing _id",
          });

          done();
        });
    });

    test("Update no fields", function (done) {
      chai
        .request(server)
        .put("/api/issues/" + project)
        .send({
          _id: testId,
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: "no update field(s) sent",
            _id: testId,
          });

          done();
        });
    });

    test("Update invalid _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/" + project)
        .send({
          _id: "507f191e810c19729de860ea",
          issue_text: "Invalid",
        })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: "could not update",
            _id: "507f191e810c19729de860ea",
          });

          done();
        });
    });
  });

  suite("DELETE /api/issues/{project}", function () {
    test("Delete issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/" + project)
        .send({ _id: testId })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            result: "successfully deleted",
            _id: testId,
          });

          done();
        });
    });

    test("Delete invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/" + project)
        .send({ _id: "507f191e810c19729de860ea" })
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: "could not delete",
            _id: "507f191e810c19729de860ea",
          });

          done();
        });
    });

    test("Delete missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/" + project)
        .send({})
        .end((err, res) => {
          assert.deepEqual(res.body, {
            error: "missing _id",
          });

          done();
        });
    });
  });
});
