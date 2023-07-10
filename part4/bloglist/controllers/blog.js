const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    response.status(400).end()
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user.id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndRemove(request.params.id)
  if (!result) {
    response.status(404).end()
  } else {
    response.status(204).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
  })

  if (!updatedBlog) {
    response.status(404).end()
  } else if (!blog.title || !blog.url) {
    response.status(400).end()
  } else {
    response.json(updatedBlog)
  }
})

module.exports = blogRouter
