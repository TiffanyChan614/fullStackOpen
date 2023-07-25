import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({ blogs, setBlogs, setMessageInfo }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0,
  })
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }

  const handleBlogChange = ({ target }) => {
    const { value, name } = target
    setNewBlog((oldBlog) => ({ ...oldBlog, [name]: value }))
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '', likes: 0 })
      setMessageInfo({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        status: 'success',
      })
    } catch (error) {
      setMessageInfo({
        message: error.response.data.error,
        status: 'error',
      })
    }
  }

  return (
    <div>
      <div>
        <button
          style={hideWhenVisible}
          onClick={() => setBlogFormVisible(true)}>
          New blog
        </button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={addBlog}>
          <h2>create new</h2>
          <div>
            title:{' '}
            <input
              type='text'
              name='title'
              value={newBlog.title}
              onChange={handleBlogChange}
            />
          </div>
          <div>
            author:{' '}
            <input
              type='text'
              name='author'
              value={newBlog.author}
              onChange={handleBlogChange}
            />
          </div>
          <div>
            url:{' '}
            <input
              type='text'
              name='url'
              value={newBlog.url}
              onChange={handleBlogChange}
            />
          </div>
          <div>
            likes:{' '}
            <input
              type='number'
              name='likes'
              value={newBlog.likes}
              onChange={handleBlogChange}
            />
          </div>
          <button type='submit'>create</button>
          <button
            type='button'
            onClick={() => setBlogFormVisible(false)}>
            cancel
          </button>
        </form>
      </div>
    </div>
  )
}

BlogForm.propTypes = {
  blogs: PropTypes.array.isRequired,
  setBlogs: PropTypes.func.isRequired,
  setMessageInfo: PropTypes.func.isRequired,
}

export default BlogForm
