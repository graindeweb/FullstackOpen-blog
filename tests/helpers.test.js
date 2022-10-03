const listHelper = require("../utils/list_helper")

test("dummy should always return 1", () => {
  const blogs = []

  expect(listHelper.dummy(blogs)).toBe(1)
})

describe("total Likes", () => {
  const blog = {
    id: "5a422aa71b54a676234d17f8",
    title: "Adipisicing veniam eu veniam ad.",
    author: "John Doe",
    url: "http://www.faker.url.com/9684684",
    likes: 6,
  }

  test("of empty list is zero", () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test("when list has only one blog equals the likes of that", () => {
    expect(listHelper.totalLikes([blog])).toBe(6)
  })

  test("of a bigger list is calculated right", () => {
    expect(listHelper.totalLikes([blog, blog, { ...blog, likes: 3 }])).toBe(6 * 2 + 3)
  })
})
