const mongoose = require("mongoose")
const Blog = require("../models/blogs")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const { text } = require("express")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Promise.all(
    helper.initialBlogs.map((blog) => {
      const blogEntry = new Blog(blog)
      return blogEntry.save()
    })
  )
})

describe("GET blogs API", () => {
  test("blogs are returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("blogs are all returned", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test("blog is identified by property id", async () => {
    const response = await api.get("/api/blogs")

    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
  })
})

describe("CREATE blog API", () => {
  const newBlog = {
    title: "Just a new empty blog",
    author: "Baptiste PFEFFERKORN",
    likes: 22,
    url: "https://www.whatever.com/",
  }

  test("new blog is return as JSON", async () => {
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  })

  test("new blog is added to blog list", async () => {
    await api.post("/api/blogs").send(newBlog)
    const { body: blogList } = await api.get("/api/blogs")

    expect(blogList).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogList.map((b) => b.title)).toContain(newBlog.title)
  })

  test("new blog have correct values", async () => {
    const { body: result } = await api.post("/api/blogs").send(newBlog)
    const { author, url, title, likes } = await Blog.findById(result.id)

    expect(author).toBe(newBlog.author)
    expect(title).toBe(newBlog.title)
    expect(url).toBe(newBlog.url)
    expect(likes).toBe(newBlog.likes)
  })

  test("new blog without likes has default 0", async () => {
    const { likes, ...newBlogWithoutLikes } = newBlog
    const { body: newBlogInDB } = await api.post("/api/blogs").send(newBlogWithoutLikes)

    expect(newBlogInDB.likes).toBe(0)

  })
})

afterAll(() => {
  mongoose.connection.close()
})
