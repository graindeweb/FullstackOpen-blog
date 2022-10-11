const jwt = require("jsonwebtoken")
const User = require("../models/users")

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

const userExtractor = async (request, response, next) => {
  request.user = null
  try {
    const { userId } = await jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(userId)
  } catch(err) {
    console.log(err)
  }

  next()
}

module.exports = {
  unknownHandler,
  errorHandler,
  tokenExtractor,
  userExtractor,
}
