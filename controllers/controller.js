const {
  fetchOneArticle,
  fetchArticleWithUpdatedVotes,
  fetchArticlesSortedByDate,
  fetchArticleComments,
  checkArticleExists,
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

exports.getArticlesSortedByDate = (req, res) => {
  fetchArticlesSortedByDate().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    fetchArticleComments(article_id),
    checkArticleExists(article_id),
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
