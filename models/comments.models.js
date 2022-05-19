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
