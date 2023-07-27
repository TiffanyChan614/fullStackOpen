const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs.map((blog) => blog.toJSON()))
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  console.log('token', request.token)
  console.log('user in post', user)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user.id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', { username: 1, name: 1 })

  return response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!request.user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const result = await Blog.findByIdAndRemove(request.params.id)

  if (!result) {
    return response.status(404).end()
  }

  if (user.id.toString() !== result.user.toString()) {
    return response
      .status(401)
      .json({ error: 'blog can only be deleted by the user who created it' })
  }

  user.blogs = user.blogs.filter(
    (blog) => blog.id.toString() !== result.id.toString()
  )
  await user.save()
  return response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = request.user

  console.log('user in put', user)

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = {
    title: body?.title,
    author: body?.author,
    url: body?.url,
    likes: body?.likes,
    user: body?.user?.id,
  }

  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
  })

  updatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 })

  console.log('updatedBlog', updatedBlog)

  if (!updatedBlog) {
    return response.status(404).end()
  } else if (!blog.title || !blog.url) {
    return response.status(400).end()
  } else {
    return response.json(updatedBlog)
  }
})

module.exports = blogRouter
