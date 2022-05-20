const {
  fetchOneArticle,
  fetchArticleWithUpdatedVotes,
  fetchArticles,
  checkTopicExists,
} = require("../models/model.js");

exports.getOneArticle = (req, res, next) => {
  const { article_id } = req.params;
  const parsedArticleId = parseInt(article_id);
  fetchOneArticle(parsedArticleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleWithVotes = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleWithUpdatedVotes(article_id, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { topic } = req.query;
  if (topic) {
    checkTopicExists(topic)
      .then(() => {
        return fetchArticles(sort_by, order, topic);
      })
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    fetchArticles(sort_by, order)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};
