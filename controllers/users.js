const bcrypt = require("bcrypt")
const router = require("express").Router()
const User = require("../models/users")

router.get("/", async (request, response) => {
  const users = await User.find({}, { password: 0 })
  response.json(users)
})

router.post("/", async (request, response, next) => {
  const user = request.body
  if (!(user.name && user.username && user.password)) {
    return response.status(400).json({
      error: "name, username and password must be defined",
    })
  } else if (user.password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    })
  }

  const existingUser = await User.findOne({ username: user.username })
  if (existingUser) {
    return response.status(409).json({
      error: "username must be unique",
    })
  }

  const pwdHash = await bcrypt.hash(user.password, 10)

  try {
    const newUser = new User({ ...user, password: pwdHash })
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (err) {
    next(err)
  }
})

module.exports = router
