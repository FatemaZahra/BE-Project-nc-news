exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required fields" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Username not found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleInternalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
