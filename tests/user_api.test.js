const mongoose = require("mongoose")
const supertest = require("supertest")

const helper = require("./user_test_helper")
const User = require("../models/users")
const app = require("../app")

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe("GET users API", () => {
  test("returns empty array if no users", async () => {
    const { body: users } = await api.get("/api/users").expect(200)
    expect(users).toEqual([])
  })
})

describe("CREATE users API", () => {
  test("returns bad request if empty params", async () => {
    await api.post("/api/users").send({}).expect(400)
  })

  test("user is added to mongo", async () => {
    const usersInDbBefore = await helper.usersInDb()
    await api.post("/api/users").send(helper.userList[0]).expect(201)
    const usersInDbAfter = await helper.usersInDb()

    expect(usersInDbAfter.length).toBe(usersInDbBefore.length + 1)
  })

  test("returns user without a password", async () => {
    const { body: user } = await api.post("/api/users").send(helper.userList[0]).expect(201)
    expect(user.password).not.toBe(helper.userList[0].password)

    const newUserInDB = await User.findById(user.id)
    expect(newUserInDB.password).not.toBe(helper.userList[0].password)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
