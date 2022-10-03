const listHelper = require("../utils/list_helper")

test("dummy should always return 1", () => {
  const blogs = []

  expect(listHelper.dummy(blogs)).toBe(1)
})
