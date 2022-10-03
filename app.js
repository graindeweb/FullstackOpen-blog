const config = require("./utils/config.js")
const express = require("express")
const app = express()
const mongoose = require("mongoose")

const blogRouter = require("./controllers/blogs")
const cors = require("cors")

app.use(cors())
app.use(express.json())

mongoose.connect(config.MONGO_URL)
  .then(() => {
    console.log("connected to mongodb")
  })
  .catch(err => {
    console.log("Error connecting mongodb: ", err.message)
  })

app.use("/api/blogs", blogRouter)

module.exports = app
