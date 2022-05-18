const db = require("../db/connection.js");
const comments = require("../db/data/development-data/comments.js");
const devData = require("../db/data/development-data/index");

exports.fetchTopics = () => {
  let queryStr = "SELECT * FROM topics";
  return db.query(queryStr).then((res) => {
    return res.rows;
  });
};

exports.fetchOneArticle = (id) => {
  let queryStr =
    "SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id";

  return db.query(queryStr, [id]).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article with ${id} ID doesn't exist`,
      });
    }
    return article.rows[0];
  });
};

exports.fetchArticleWithUpdatedVotes = (id, obj) => {
  const { inc_votes } = obj;

  let queryStr = `UPDATE articles SET votes = votes+ $2 WHERE article_id = $1 RETURNING *`;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields",
    });
  }

  return db.query(queryStr, [id, inc_votes]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Article with ${id} ID doesn't exist`,
      });
    }
    return result.rows[0];
  });
};

exports.fetchArticlesSortedByDate = (order) => {
  let queryStr =
    "SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;";

  return db.query(queryStr).then((article) => {
    return article.rows;
  });
};

exports.fetchArticleComments = (article_id) => {
  return db
    .query("SELECT * FROM comments WHERE comments.article_id=$1", [article_id])
    .then((articleComments) => {
      if (articleComments.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Comments with article ID:${article_id} ID doesn't exist`,
        });
      }
      return articleComments.rows;
    });
};
