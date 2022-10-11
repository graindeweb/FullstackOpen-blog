const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/users")

router.post("/", async (request, response, next) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).json({
      error: "Wrong username or password",
    })
  }

  const jwtToken = jwt.sign({ username: user.username, userId: user._id }, process.env.SECRET)
  response.status(200).json({ jwtToken, username: user.username, name: user.name })
})

module.exports = router
