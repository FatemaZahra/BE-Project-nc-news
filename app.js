const express = require("express");
//Topics Controller
const { getTopics } = require("./controllers/topic.controller");
//Article Controller
const {
  getOneArticle,
  updateArticleWithVotes,
  getArticlesSortedByDate,
  postComment
  getArticleComments,
} = require("./controllers/controller.js");

//User Controller
const { getUserByUsername } = require("./controllers/users.controller.js");

//Error Controller
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalServerError,
} = require("./controllers/errors.controller.js");

const app = express();
app.use(express.json());

//TOPICS
//get
app.get("/api/topics", getTopics);

//ARTICLES
//get
app.get("/api/articles", getArticlesSortedByDate);
app.get("/api/articles/:article_id", getOneArticle);
//Patch
app.patch("/api/articles/:article_id", updateArticleWithVotes);
//getComments
app.get("/api/articles/:article_id/comments", getArticleComments);
//PostComment
app.post("/api/articles/:article_id/comments", postComment);



//USERS
//get
app.get("/api/users", getUserByUsername);

//ERROR HANDLING
app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerError);

module.exports = app;
