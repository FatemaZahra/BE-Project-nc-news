const express = require("express");
const {
  getTopics,
  getOneArticle,
  updateArticleWithVotes,
} = require("./controllers/controller.js");

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

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
