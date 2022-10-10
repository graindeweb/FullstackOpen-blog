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
  const topBlogger = blogs
    .reduce((acc, blog) => {
      const i = acc.findIndex(stat => stat.author === blog.author)
      if (i > -1) {
        acc[i] = { author: blog.author, blogs: acc[i].blogs + 1 }
      } else {
        acc.push({ author: blog.author, blogs: 1 })
      }

      return acc
    }, [])
    .sort((a, b) => b.blogs - a.blogs)[0]

  return topBlogger || undefined
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) { return undefined }

  const [author, likes] = Object.entries(
    blogs.reduce((acc, blog) => {
      return {
        ...acc,
        [blog.author]: acc[blog.author] ? acc[blog.author] + blog.likes : blog.likes,
      }
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]

  return { author, likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
