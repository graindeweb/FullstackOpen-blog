const User = require("../models/users")

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

module.exports = { userList, usersInDb }