const User = require("../models/users")
const bcrypt = require("bcrypt")

const userList = [
  {
    name: "John Doe",
    username: "johndoe@xcorp.com",
    password: "123456789",
  },
  {
    name: "Jane Fonda",
    username: "janefonda@xcorp.com",
    password: "6655474854",
  },
  {
    name: "Calamity Jane",
    username: "cjane@xcorp.com",
    password: "6+6666+",
  },
  {
    name: "Carl Zeiss",
    username: "carlzeiss@objo.com",
    password: "qsdf4!684qsf",
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const addUserInDb = async (user) => {
  const newUser = new User({
    ...user,
    password: await bcrypt.hash(user.password, 10),
  })
  return await newUser.save()
}

module.exports = { userList, usersInDb, addUserInDb }