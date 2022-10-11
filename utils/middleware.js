/** Catch all unknown endpoints */
const unknownHandler = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

/** Error Handling */
const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).send({ error: error.message })
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    request["token"] = authorization.substring(7)
  }

  next()
}

module.exports = {
  unknownHandler,
  errorHandler,
  tokenExtractor,
}
