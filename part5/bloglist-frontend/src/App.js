import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
    likes: 0,
  })
  const [messageInfo, setMessageInfo] = useState({
    message: null,
    status: null,
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedBlogappUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedBlogappUser) {
      const user = JSON.parse(loggedBlogappUser)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageInfo({ message: null, status: null })
    }, 5000)
    return () => clearTimeout(timer)
  }, [messageInfo])

  const addBlog = async (event) => {
    event.preventDefault()

    if (user === null) {
      return
    }
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

  const handleBlogChange = ({ target }) => {
    const { value, name } = target
    setNewBlog((oldBlog) => ({ ...oldBlog, [name]: value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setMessageInfo({
        message: 'Wrong username or password',
        status: 'error',
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username{' '}
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
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
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      {messageInfo.message !== null && (
        <Notification
          message={messageInfo.message}
          status={messageInfo.status}
        />
      )}
      {user !== null && (
        <p>
          {user.username} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
      )}
      {user === null ? loginForm() : blogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}

export default App
