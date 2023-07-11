const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  const saltround = 10
  const encryptionPromises = helper.initialUsers.map(async (user) => {
    const encryptedPW = await bcrypt.hash(user.password, saltround)
    return {
      username: user.username,
      name: user.name,
      passwordHash: encryptedPW,
      blogs: user.blogs,
    }
  })
  const userEncrypted = await Promise.all(encryptionPromises)
  const userObjects = userEncrypted.map((user) => new User(user))
  const promiseArray = userObjects.map((user) => user.save())
  await Promise.all(promiseArray)
})

beforeEach(async () => {
  const user = await User.findOne({
    username: helper.initialUsers[0].username,
  })

  const blogObjects = helper.initialBlogs.map(
    (blog) =>
      new Blog({
        ...blog,
        user: user.id.toString(),
        likes: blog.likes ? blog.likes : 0,
      })
  )
  const promiseArray = blogObjects.map(async (blog) => {
    await blog.save()
    user.blogs = user.blogs.concat(blog._id)
  })
  await Promise.all(promiseArray)
  await user.save()
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs/')
    response.body.map((r) => expect(r.id).toBeDefined())
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map((r) => r.title)
    expect(titles).toContain('Go To Statement Considered Harmful')
  })
})

describe('addition of a new blog', () => {
  let header

  beforeEach(async () => {
    const userLogin = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    }
    const response = await api.post('/api/login').send(userLogin)
    header = { authorization: `bearer ${response.body.token}` }
  })

  test('succeeds with valid data', async () => {
    const testBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://www.test.com',
      likes: 5,
    }
    await api
      .post('/api/blogs')
      .set(header)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

    const titles = response.body.map((r) => r.title)
    expect(titles).toContainEqual(testBlog.title)
  })

  test('blog without likes are updated successfully with likes defaulted to 0', async () => {
    const testBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://www.test.com',
    }

    await api
      .post('/api/blogs')
      .set(header)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find(
      (blog) => blog.title === testBlog.title
    )
    expect(addedBlog.likes).toBe(0)
  })

  test('fails with status code 400 if data invalid', async () => {
    const testBlogs = [
      {
        author: 'Test Author',
        url: 'http://www.test.com',
        likes: 5,
      },
      {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 5,
      },
      {
        author: 'Test Author',
        likes: 5,
      },
    ]
    const promiseArray = testBlogs.map((testBlog) => {
      api.post('/api/blogs').set(header).send(testBlog).expect(400)
    })
    Promise.all(promiseArray)
  })

  test('fails with status code 401 if token is not provided', async () => {
    const testBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://www.test.com',
      likes: 5,
    }
    await api.post('/api/blogs').send(testBlog).expect(401)
  })
})

describe('deletion of a blog', () => {
  let header

  beforeEach(async () => {
    const userLogin = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    }
    const response = await api.post('/api/login').send(userLogin)
    header = { authorization: `bearer ${response.body.token}` }
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const currentBlogs = await helper.blogsInDb()
    const blogToDelete = currentBlogs[0]
    await api.delete(`/api/blogs/${blogToDelete.id}`).set(header).expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    const blogTitles = blogsAtEnd.map((blog) => blog.title)
    expect(blogTitles).not.toContainEqual(blogToDelete.title)
  }, 100000)

  test('fails with status code 404 if id does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()
    await api.delete(`/api/blogs/${nonExistingId}`).set(header).expect(404)
  })
})

describe('update of a blog', () => {
  test('succeeds with valid data', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[1]
    const updatedBlog = {
      ...blogToUpdate,
      likes: 100,
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogAtEnd = blogsAtEnd.find(
      (blog) => blog.title === blogToUpdate.title
    )
    expect(updatedBlogAtEnd.likes).toBe(updatedBlog.likes)
  })

  test('fails with statuscode 400 if data invalid', async () => {
    const response = await api.get('/api/blogs')
    const blogToUpdate = response.body[1]
    const updatedBlog = {
      ...blogToUpdate,
      title: '',
      url: '',
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(400)
  })

  test('fails with status code 404 if id does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()
    await api.put(`/api/blogs/${nonExistingId}`).expect(404)
  })
})
