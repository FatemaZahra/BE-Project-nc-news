const {
  fetchTopics,
  fetchOneArticle,
  fetchArticleWithUpdatedVotes,
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
  const parsedArticleId = parseInt(article_id);

  fetchArticleWithUpdatedVotes(parsedArticleId, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
