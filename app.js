const express = require("express");
const { getTopics } = require("./controllers/controller.js");

const app = express();

//GET

app.get("/api/topics", getTopics);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
