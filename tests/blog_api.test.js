const mongoose = require("mongoose")
const Blog = require("../models/blogs")
const User = require("../models/users")
const supertest = require("supertest")
const bcrypt = require("bcrypt")
const app = require("../app")
const helper = require("./blog_test_helper")
const userHelper = require("./user_test_helper")

const api = supertest(app)
let jwtToken = null
let owners = []

beforeEach(async () => {
  await User.deleteMany({})
  // First add some users in DB
  const newUsers = await Promise.all(
    userHelper.userList.slice(0, 2).map(async (user) => {
      return {
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }
    })
  )
  owners = await User.insertMany(newUsers)

  // Log the first user in
  const response = await api.post("/api/login").send({
    username: userHelper.userList[0].username,
    password: userHelper.userList[0].password,
  })
  jwtToken = response.body.jwtToken

  await Blog.deleteMany({})
  await Blog.insertMany(
    helper.initialBlogs.map((blog) => {
      return { ...blog, user: owners[0] }
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

  test("unauthentified access gives a 401", async () => {
    await api.post("/api/blogs").send(newBlog).expect(401)
  })

  test("new blog is return as JSON", async () => {
    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${jwtToken}` })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)
  })

  test("new blog is added to blog list", async () => {
    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${jwtToken}` })
      .send(newBlog)
      .expect(201)
    const { body: blogList } = await api.get("/api/blogs")

    expect(blogList).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogList.map((b) => b.title)).toContain(newBlog.title)
  })

  test("new blog have correct values", async () => {
    const { body: result } = await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${jwtToken}` })
      .send(newBlog)
      .expect(201)
    const { author, url, title, likes } = await Blog.findById(result.id)

    expect(author).toBe(newBlog.author)
    expect(title).toBe(newBlog.title)
    expect(url).toBe(newBlog.url)
    expect(likes).toBe(newBlog.likes)
  })

  test("new blog without likes has default 0", async () => {
    const { likes, ...newBlogWithoutLikes } = newBlog
    const { body: newBlogInDB } = await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${jwtToken}` })
      .send(newBlogWithoutLikes)
      .expect(201)

    expect(newBlogInDB.likes).toBe(0)
  })

  test("title and url are mandatory", async () => {
    const { title, url, ...newBlogWithoutMandatory } = newBlog
    await api
      .post("/api/blogs")
      .set({ authorization: `Bearer ${jwtToken}` })
      .send(newBlogWithoutMandatory)
      .expect(400)
  })
})

describe("DELETE blog API", () => {
  test("unauthentified access gives a 401", async () => {
    await api.delete("/api/blogs/6341fe8b95fa89979e0136d7").expect(401)
  })

  test("unknown id returns 204 (idempotence)", async () => {
    await api
      .delete("/api/blogs/6341fe8b95fa89979e0136d7")
      .set({ authorization: `Bearer ${jwtToken}` })
      .expect(204)
  })

  test("blog is removed from initial List of blogs", async () => {
    const blogList = await helper.blogsInDb()
    const blogToDelete = blogList[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ authorization: `Bearer ${jwtToken}` })
      .expect(204)

    const newBlogList = await helper.blogsInDb()
    expect(newBlogList).toHaveLength(helper.initialBlogs.length - 1)
    expect(newBlogList.map((n) => n.title)).not.toContain(blogToDelete.title)
  })
})

describe("UPDATE blog API", () => {
  test("unauthentified access gives a 401", async () => {
    await api.put(`/api/blogs/${helper.unknownId}`).expect(401)
  })

  test("bad id format returns 400", async () => {
    const response = await api
      .put(`/api/blogs/${helper.unknownId}`)
      .set({ authorization: `Bearer ${jwtToken}` })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe("Malformatted id")
  })

  test("fails with status code 400 if data invalid", async () => {
    const blogList = await helper.blogsInDb()
    const blogToUpdate = blogList[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set({ authorization: `Bearer ${jwtToken}` })
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
      .set({ authorization: `Bearer ${jwtToken}` })
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
