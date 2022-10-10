const listHelper = require("../utils/list_helper")
const testHelper = require("./blog_test_helper")

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

describe("Favorite blog", () => {
  test("of empty list is undefined", () => {
    expect(listHelper.favoriteBlog([])).toBe(undefined)
  })
  test("when list has only one blog equals this blog", () => {
    expect(listHelper.favoriteBlog([testHelper.initialBlogs[0]])).toEqual(testHelper.initialBlogs[0])
  })
  test("of a bigger list is the blog with the higher number of likes", () => {
    expect(listHelper.favoriteBlog([...testHelper.initialBlogs])).toEqual(testHelper.initialBlogs[2])
  })
})

describe("Top Blogger", () => {
  test("of empty list is undefined", () => {
    expect(listHelper.mostBlogs([])).toBe(undefined)
  })
  test("when list has only one blog equals this blog", () => {
    expect(listHelper.mostBlogs([testHelper.initialBlogs[1]])).toEqual({
      author: testHelper.initialBlogs[1].author,
      blogs: 1,
    })
  })
  test("of a bigger list is the blog with the higher number of likes", () => {
    expect(listHelper.mostBlogs([...testHelper.initialBlogs])).toEqual({
      author: testHelper.initialBlogs[3].author,
      blogs: testHelper.initialBlogs.filter((b) => b.author === testHelper.initialBlogs[3].author).length,
    })
  })
})

describe("Top Like Blogger", () => {
  test("of empty list is undefined", () => {
    expect(listHelper.mostLikes([])).toBe(undefined)
  })
  test("when list has only one blog equals this blog", () => {
    expect(listHelper.mostLikes([testHelper.initialBlogs[3]])).toEqual({
      author: testHelper.initialBlogs[3].author,
      likes: testHelper.initialBlogs[3].likes,
    })
  })
  test("of a bigger list is the blog with the higher number of likes", () => {
    expect(listHelper.mostLikes([...testHelper.initialBlogs])).toEqual({
      author: testHelper.initialBlogs[1].author,
      likes: testHelper.initialBlogs
        .filter((b) => b.author === testHelper.initialBlogs[1].author)
        .reduce((acc, blog) => acc + blog.likes, 0),
    })
  })
})
