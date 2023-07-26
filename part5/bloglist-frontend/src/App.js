import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [messageInfo, setMessageInfo] = useState({
    message: null,
    status: null,
  })

  // console.log('user', user)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedBlogappUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedBlogappUser) {
      const user = JSON.parse(loggedBlogappUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageInfo({ message: null, status: null })
    }, 5000)
    return () => clearTimeout(timer)
  }, [messageInfo])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      console.log('user in app', user)
      console.log('user.token in app', user.token)
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

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value)
  }

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

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
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
      )}
      {user === null ? (
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}
        />
      ) : (
        <BlogForm
          blogs={blogs}
          setBlogs={setBlogs}
          setMessageInfo={setMessageInfo}
        />
      )}
      {user &&
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              setBlogs={setBlogs}
              setMessageInfo={setMessageInfo}
            />
          ))}
    </div>
  )
}

export default App
