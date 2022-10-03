const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, b) => acc + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)[0]
}

const mostBlogs = (blogs) => {
  const topBlogger = Object.entries(
    blogs.reduce((acc, blog) => {
      return {
        ...acc,
        [blog.author]: acc[blog.author] ? acc[blog.author]+1 : 1,
      }
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]

  return topBlogger ? {
    author: topBlogger[0],
    blogs: topBlogger[1],
  } : undefined
}

const mostLikes = (blogs) => {
  const topBlogger = Object.entries(blogs
    .reduce((acc, blog) => {
      return { ...acc, [blog.author]: acc[blog.author] ? acc[blog.author] + blog.likes : blog.likes } }, {}))
    .sort((a, b) => b[1] - a[1])[0]

  return topBlogger ? {
    author: topBlogger[0],
    likes: topBlogger[1]
  } : undefined
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
