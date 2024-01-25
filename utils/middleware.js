const logger = require('./logger')

const printBody = (request, response, next) => {
  logger.info(JSON.stringify(request.body));
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  }

  next(error);
};


module.exports = {
    printBody,
    errorHandler
}