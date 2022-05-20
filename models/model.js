const db = require("../db/connection.js");
const articles = require("../db/data/development-data/articles.js");
const comments = require("../db/data/development-data/comments.js");
const devData = require("../db/data/development-data/index");

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

exports.fetchArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const sortByArray = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderArray = ["ASC", "DESC"];
  let queryStr =
    "SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id";

  if (topic) {
    queryStr += ` WHERE articles.topic = '${topic}'`;
  }

  queryStr += ` GROUP BY articles.article_id`;
  if (sortByArray.includes(sort_by) && orderArray.includes(order)) {
    if (sort_by === "comment_count") {
      queryStr += ` ORDER BY comment_count ${order};`;
    } else {
      queryStr += ` ORDER BY articles.${sort_by} ${order};`;
    }
  }
  if (!sortByArray.includes(sort_by) || !orderArray.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid data" });
  }
  return db.query(queryStr).then((article) => {
    if (article.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Not found",
      });
    }
    return article.rows;
  });
};
