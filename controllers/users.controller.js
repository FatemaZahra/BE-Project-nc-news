const { fetchUsersByUsername } = require("../models/user.models.js");

exports.getUserByUsername = (req, res) => {
  fetchUsersByUsername().then((users) => {
    res.status(200).send({ users });
  });
};
