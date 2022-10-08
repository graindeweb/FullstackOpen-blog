const router = require("express").Router()
const Blog = require("../models/blogs")

router.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.post("/", async (request, response, next) => {
  const blog = new Blog(request.body)

  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch(err) {
    next(err)
  }
})

module.exports = router
