const db = require("../db/connection.js");

exports.fetchUsersByUsername = () => {
  let queryStr = "SELECT username FROM users";
  return db.query(queryStr).then((res) => {
    return res.rows;
  });
};
