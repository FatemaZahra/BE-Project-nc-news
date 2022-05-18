const {
  fetchTopics,
  fetchOneArticle,
  fetchArticleWithUpdatedVotes,
  fetchArticlesSortedByDate,
  fetchArticleComments,
} = require("../models/model.js");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

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

exports.getArticlesSortedByDate = (req, res) => {
  fetchArticlesSortedByDate().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
