/*
 *
 * Functional Tests for Issue Tracker
 *
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

var _idTest;

suite("Functional Tests", function () {
  // =========================
  // POST TESTS
  // =========================
  suite("POST /api/issues/{project}", function () {
    test("Create issue with every field", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "tester",
          assigned_to: "dev",
          status_text: "in progress",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "tester");
          assert.equal(res.body.assigned_to, "dev");
          assert.equal(res.body.status_text, "in progress");
          assert.equal(res.body.open, true);
          assert.property(res.body, "_id");
          _idTest = res.body._id;
          done();
        });
    });

    test("Create issue with only required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title2",
          issue_text: "text2",
          created_by: "tester2",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });

    test("Create issue with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Only title",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: "required field(s) missing" });
          done();
        });
    });
  });

  // =========================
  // GET TESTS
  // =========================
  suite("GET /api/issues/{project}", function () {
    test("View issues on a project", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "_id");
          done();
        });
    });

    test("View issues with one filter", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ assigned_to: "dev" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });

    test("View issues with multiple filters", function (done) {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({
          issue_title: "Title",
          open: true,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });

  // =========================
  // PUT TESTS
  // =========================
  suite("PUT /api/issues/{project}", function () {
    test("Update one field on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: _idTest,
          status_text: "updated",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully updated",
            _id: _idTest,
          });
          done();
        });
    });

    test("Update multiple fields on an issue", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: _idTest,
          status_text: "updated again",
          assigned_to: "new dev",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });

    test("Update an issue with missing _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          status_text: "fail",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: "missing _id" });
          done();
        });
    });

    test("Update an issue with no fields to update", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: _idTest,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, {
            error: "no update field(s) sent",
            _id: _idTest,
          });
          done();
        });
    });

    // (Optional extra - many FCC solutions ignore invalid _id for PUT)
    test("Update an issue with invalid _id", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "invalidid123",
          status_text: "test",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: "could not update" });
          done();
        });
    });
  });

  // =========================
  // DELETE TESTS
  // =========================
  suite("DELETE /api/issues/{project}", function () {
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: _idTest })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully deleted",
            _id: _idTest,
          });
          done();
        });
    });

    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: "missing _id" });
          done();
        });
    });

    test("Delete an issue with invalid _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: "invalidid123" })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.deepEqual(res.body, { error: "could not delete" });
          done();
        });
    });
  });
});
