const {
  insertComment,
  fetchArticleComments,
  checkArticleExists,
  removeCommentByCommentID,
  checkCommentExists,
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

exports.deleteCommentbyCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return removeCommentByCommentID(comment_id);
    })
    .then((result) => {
      res.status(204).send({ result });
    })
    .catch(next);
};
