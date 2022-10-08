const mongoose = require("mongoose")
const Blog = require("../models/blogs")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")

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
})

afterAll(() => {
  mongoose.connection.close()
})
