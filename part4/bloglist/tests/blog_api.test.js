const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
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

describe('addition of a new note', () => {
  test('succeeds with valid data', async () => {
    await api
      .post('/api/blogs')
      .send(helper.singleTestBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body).toHaveLength(helper.initialBlogs.length + 1)

    const titles = getResponse.body.map((r) => r.title)
    expect(titles).toContainEqual(helper.singleTestBlog.title)
  })

  test('blog without likes are updated successfully with likes defaulted to 0', async () => {
    await api
      .post('/api/blogs')
      .send(helper.singleTestBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const getResponse = await api.get('/api/blogs')
    const addedBlog = getResponse.body.find(
      (blog) => blog.title === helper.singleTestBlogWithoutLikes.title
    )
    expect(addedBlog.likes).toBe(0)
  })

  test('fails with status code 400 if data invalid', async () => {
    const promiseArray = helper.invalidTestBlogs.map((testBlog) => {
      api.post('/api/blogs').send(testBlog).expect(400)
    })
    Promise.all(promiseArray)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogToDelete = getResponse.body[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
      .catch((error) => console.log(error))
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    const blogTitles = blogsAtEnd.map((blog) => blog.title)
    expect(blogTitles).not.toContainEqual(blogToDelete.title)
  }, 100000)

  test('fails with status code 404 if id does not exist', async () => {
    const nonExistingId = await helper.nonExistingId()
    await api.delete(`/api/blogs/${nonExistingId}`).expect(404)
  })
})

describe('update of a blog', () => {
  test('succeeds with valid data', async () => {
    const getResponse = await api.get('/api/blogs')
    const blogToUpdate = getResponse.body[1]
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
    const getResponse = await api.get('/api/blogs')
    const blogToUpdate = getResponse.body[1]
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
