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
