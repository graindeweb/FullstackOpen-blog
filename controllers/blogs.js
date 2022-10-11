const router = require("express").Router()
const Blog = require("../models/blogs")
const User = require("../models/users")
const jwt = require("jsonwebtoken")

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 })
  response.json(blogs)
})

router.post("/", async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.userId) {
      return response.status(401).json({ error: "token missing or invalid" })
    }

    const blog = new Blog(request.body)

    const owner = await User.findById(decodedToken.userId)
    blog.user = owner._id

    const savedBlog = await blog.save()
    owner.blogs = owner.blogs.concat(savedBlog._id)
    await owner.save()

    response.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

router.delete("/:id", async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

router.put("/:id", async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(updatedBlog)
  } catch (err) {
    next(err)
  }
})

module.exports = router
