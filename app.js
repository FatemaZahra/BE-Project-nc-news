const express = require("express");
const {
  getTopics,
  getOneArticle,
  updateArticleWithVotes,
} = require("./controllers/controller.js");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerError,
} = require("./controllers/errors.controller.js");

const app = express();
app.use(express.json());

//GET

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getOneArticle);

//PATCH
app.patch("/api/articles/:article_id", updateArticleWithVotes);

//ERROR HANDLING
app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerError);

module.exports = app;
