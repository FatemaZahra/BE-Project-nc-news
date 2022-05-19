const {
  insertComment,
  fetchArticleComments,
  checkArticleExists,
} = require("../models/comments.models");

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

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  checkArticleExists(article_id)
    .then(() => {
      return insertComment(article_id, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
