const db = require("../db/connection.js");
const devData = require("../db/data/development-data/index");

exports.fetchTopics = () => {
  let queryStr = "SELECT * FROM topics";
  return db.query(queryStr).then((res) => {
    return res.rows;
  });
};

exports.fetchOneArticle = (id) => {
  let queryStr = "SELECT * FROM articles WHERE article_id = $1";
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
