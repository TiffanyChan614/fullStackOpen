import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, setBlogs, setMessageInfo }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  const updateLikes = async () => {
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs((prevBlogs) =>
        prevBlogs.map((prevBlog) =>
          prevBlog.id === blog.id ? returnedBlog : prevBlog
        )
      )
      setMessageInfo({
        message: `blog ${returnedBlog.title} by ${returnedBlog.author} updated`,
        status: 'success',
      })
    } catch (error) {
      setMessageInfo({
        message: error.response.data.error,
        status: 'error',
      })
    }
  }

  const removeBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs((prevBlogs) =>
          prevBlogs.filter((prevBlogs) => prevBlogs.id !== blog.id)
        )
        setMessageInfo({
          message: `blog ${blog.title} by ${blog.author} removed`,
          status: 'success',
        })
      } catch (error) {
        setMessageInfo({
          message: error.response.data.error,
          status: 'error',
        })
      }
    }
  }

  console.log(blog.title, blog.user)

  return (
    <div
      style={blogStyle}
      className='blog'>
      {blog.title} {blog.author}
      <button onClick={() => setDetailsVisible((prevShow) => !prevShow)}>
        {detailsVisible ? 'hide' : 'view'}
      </button>
      <div
        style={showWhenVisible}
        className='details'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={updateLikes}>like</button>
        </div>
        <div>{blog.user.username}</div>
        <button onClick={removeBlog}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  setBlogs: PropTypes.func.isRequired,
  setMessageInfo: PropTypes.func.isRequired,
}

export default Blog
