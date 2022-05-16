const db = require("../db/connection.js");
const devData = require("../db/data/development-data/index");

exports.fetchTopics = () => {
  let queryStr = "SELECT * FROM topics";
  return db.query(queryStr).then((res) => {
    // console.log(res);
    return res.rows;
  });
};
