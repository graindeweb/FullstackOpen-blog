const mongoose = require("mongoose")
const Blog = require("../models/blogs")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./blog_test_helper")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

  test("title and url are mandatory", async () => {
    const { title, url, ...newBlogWithoutMandatory } = newBlog
    await api.post("/api/blogs").send(newBlogWithoutMandatory).expect(400)
  })
})

describe("DELETE blog API", () => {
  test("unknown id returns 204 (idempotence)", async () => {
    await api.delete("/api/blogs/6341fe8b95fa89979e0136d7").expect(204)
  })

  test("blog is removed from initial List of blogs", async () => {
    const blogList = await helper.blogsInDb()
    const blogToDelete = blogList[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const newBlogList = await helper.blogsInDb()
    expect(newBlogList).toHaveLength(helper.initialBlogs.length - 1)
    expect(newBlogList.map((n) => n.title)).not.toContain(blogToDelete.title)
  })
})

describe("UPDATE blog API", () => {
  test("bad id format returns 400", async () => {
    const response = await api.put(`/api/blogs/${helper.unknownId}`)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Malformatted id")
  })

  test("fails with status code 400 if data invalid", async () => {
    const blogList = await helper.blogsInDb()
    const blogToUpdate = blogList[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({
        likes: "10a",
      })
      .expect(400)

    const blogListAfterUpdate = await helper.blogsInDb()
    expect(blogListAfterUpdate[0].likes).toBe(blogToUpdate.likes)
  })

  test("blog is updated", async () => {
    const blogList = await helper.blogsInDb()
    const blogToUpdate = blogList[0]
    const { body: updatedBlog } = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({
        likes: blogList[0].likes + 1,
      })
      .expect(200)

    expect(updatedBlog.likes).toBe(blogList[0].likes + 1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
