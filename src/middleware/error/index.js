const errorCatcher = (err, req, res, next) => {
    err.statusCode
        ? res.status(err.statusCode).send({
              name: err.name,
              message: err.message,
              statusCode: err.statusCode,
          })
        : res.status(500).send({
              name: err.name,
              message: err.message,
              statusCode: 500,
          });
};

module.exports = errorCatcher;
