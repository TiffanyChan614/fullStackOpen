const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'The Rise of Agile Software Development',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/articles/agile-aus-2018.html',
    likes: 8,
  },
]

const initialUsers = [
  {
    username: 'root',
    name: 'root',
    password: 'password',
    blogs: [],
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'http://www.test.com',
  })
  await blog.save()
  await Blog.deleteOne({ _id: blog._id })
  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  nonExistingId,
  usersInDb,
}
