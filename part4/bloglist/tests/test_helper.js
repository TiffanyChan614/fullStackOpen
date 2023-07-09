const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'The Rise of Agile Software Development',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/articles/agile-aus-2018.html',
    likes: 8,
    __v: 0,
  },
]

const singleTestBlog = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'http://www.test.com',
  likes: 1,
}

const singleTestBlogWithoutLikes = {
  title: 'Test Blog',
  author: 'Test Author',
  url: 'http://www.test.com',
}

const invalidTestBlogs = [
  {
    author: 'Test Author 1',
    url: 'http://www.test.com',
    likes: 1,
  },
  {
    title: 'Test Blog',
    author: 'Test Author 2',
    likes: 2,
  },
  {
    author: 'Test Author 3',
    likes: 3,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await Blog.deleteOne({ _id: blog._id })
  return blog._id.toString()
}

module.exports = {
  initialBlogs,
  singleTestBlog,
  singleTestBlogWithoutLikes,
  invalidTestBlogs,
  blogsInDb,
  nonExistingId,
}
