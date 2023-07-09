const blogRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    response.status(400).end()
  }
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
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
