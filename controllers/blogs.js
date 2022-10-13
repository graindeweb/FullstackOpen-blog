const router = require("express").Router()
const Blog = require("../models/blogs")
const User = require("../models/users")

router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 })
  response.json(blogs)
})

router.post("/", async (request, response) => {
  const user = request.user

  if (null === user) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

  const blog = new Blog(request.body)

  const owner = await User.findById(user._id.toString())
  blog.user = owner._id

  const savedBlog = await blog.save()
  owner.blogs = owner.blogs.concat(savedBlog._id)
  await owner.save()

  response.status(201).json(savedBlog)
})

router.delete("/:id", async (request, response) => {
  const user = request.user
  if (null === user) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

  const blog = await Blog.findById(request.params.id)
  if (blog) {
    if (null === user) {
      return response.status(401).json({ error: "token missing or invalid" })
    } else if (blog.user?._id.toString() !== user._id.toString()) {
      return response.status(403).json({ error: "this blog does not belong to you!" })
    }
    blog.delete()
  }

  response.status(204).end()
})

router.put("/:id", async (request, response) => {
  const user = request.user

  if (null === user) {
    return response.status(401).json({ error: "token missing or invalid" })
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.json(updatedBlog)
})

module.exports = router
