const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => sum + item.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    return Math.max(max.likes, item.likes) === item.likes ? item : max
  }
  const favorite = blogs.reduce(reducer, blogs[0])
  return favorite === undefined ? {} : favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const authorAndNumBlogs = _.countBy(blogs, 'author')
  const authorWithMostBlogs = _.maxBy(
    Object.keys(authorAndNumBlogs),
    (author) => authorAndNumBlogs[author]
  )
  return {
    author: authorWithMostBlogs,
    blogs: authorAndNumBlogs[authorWithMostBlogs],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const blogsGroupedByAuthors = _.groupBy(blogs, 'author')
  const authorWithMostLikes = _.maxBy(
    Object.keys(blogsGroupedByAuthors),
    (author) => {
      return _.reduce(
        blogsGroupedByAuthors[author],
        (sum, blog) => sum + blog.likes,
        0
      )
    }
  )
  const mostLikes = _.reduce(
    blogsGroupedByAuthors[authorWithMostLikes],
    (totalLikes, blog) => totalLikes + blog.likes,
    0
  )
  return { author: authorWithMostLikes, likes: mostLikes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
