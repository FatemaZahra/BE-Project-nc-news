const db = require("../db/connection.js");
exports.checkArticleExists = (article_id) => {
  const queryStr = "SELECT * FROM articles WHERE article_id = $1;";
  return db.query(queryStr, [article_id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article ID:${article_id} ID doesn't exist`,
      });
    }
    return article.rows[0];
  });
};
exports.fetchArticleComments = (article_id) => {
  const queryStr = "SELECT * FROM comments WHERE article_id=$1 ";
  return db.query(queryStr, [article_id]).then((articleComments) => {
    return articleComments.rows;
  });
};

exports.insertComment = (id, newComment) => {
  const { username, body } = newComment;
  if (username && body) {
    if (typeof username !== "string" || typeof body !== "string") {
      return Promise.reject({
        status: 400,
        msg: "Invalid type of values",
      });
    }
  }
  queryStr =
    "INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;";

  return db.query(queryStr, [username, body, id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.checkCommentExists = (comment_id) => {
  const queryStr = "SELECT * FROM comments WHERE comment_id = $1;";
  return db.query(queryStr, [comment_id]).then((comment) => {
    if (comment.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Comment ID:${comment_id} doesn't exist`,
      });
    }
    return comment.rows[0];
  });
};

exports.removeCommentByCommentID = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
    .then((result) => {
      console.log(result.rows);
      return result.rows[0];
    });
};
