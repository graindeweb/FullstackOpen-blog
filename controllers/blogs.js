const router = require("express").Router()
const Blog = require("../models/blogs")

router.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.post("/", (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = router
