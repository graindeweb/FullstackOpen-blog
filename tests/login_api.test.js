const supertest = require("supertest")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const app = require("../app")
const User = require("../models/users")
const helper = require("./user_test_helper")

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe("LOGIN", () => {
  test("jwt and user infos are return successful login", async () => {
    const newUser = helper.userList[0]
    const userInDB = await helper.addUserInDb(newUser)

    const response = await api
      .post("/api/login")
      .send({
        username: newUser.username,
        password: newUser.password,
      })
      .expect(200)

    const bodyKeys = Object.keys(response.body)
    expect(bodyKeys).toContain("jwtToken")
    expect(bodyKeys).toContain("username")
    expect(bodyKeys).toContain("name")

    const decodedToken = await jwt.verify(response.body.jwtToken, process.env.SECRET)
    expect(decodedToken.userId).toBe(userInDB._id.toString())
  })

  test("401 on wrong login or password", async () => {
    const newUser = helper.userList[0]
    await helper.addUserInDb(newUser)

    await api
      .post("/api/login")
      .send({
        username: newUser.username,
        password: "badpassword",
      })
      .expect(401)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
