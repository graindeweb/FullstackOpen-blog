const config = require("./utils/config.js")
const express = require("express")
const app = express()
const mongoose = require("mongoose")
require("express-async-errors")
const middleware = require("./utils/middleware")

const blogRouter = require("./controllers/blogs")
const userRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

mongoose.connect(config.MONGO_URL)
  .then(() => {
    console.log("connected to mongodb")
  })
  .catch(err => {
    console.log("Error connecting mongodb: ", err.message)
  })

app.use("/api/blogs", middleware.userExtractor, blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

app.use(middleware.unknownHandler)
app.use(middleware.errorHandler)

module.exports = app
