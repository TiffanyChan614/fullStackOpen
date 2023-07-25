import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import BlogForm from './BlogForm'

jest.mock('../services/blogs')

describe('<Blog />', () => {
  let container

  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test URL',
    likes: 0,
    user: {
      username: 'Test Username',
      name: 'Test Name',
    },
  }

  const mockBlogsHandler = jest.fn()
  const mockMessageHandler = jest.fn()

  beforeEach(() => {
    blogService.update.mockResolvedValue(blog)
    container = render(
      <Blog
        blog={blog}
        setBlogs={mockBlogsHandler}
        setMessageInfo={mockMessageHandler}
      />
    ).container
  })

  test("renders blog's title and author only by default", () => {
    const detailsDiv = container.querySelector('.details')
    expect(detailsDiv).toHaveStyle('display: none')
  })

  test('details are shown when view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const detailsDiv = container.querySelector('.details')

    expect(detailsDiv).toHaveStyle('display: block')
  })

  test('if like button is clicked twice, the event handler is called twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockBlogsHandler.mock.calls).toHaveLength(2)
  })
})

describe('<BlogForm />', () => {
  test('calls the event handler prop with the right details', async () => {
    const mockBlogsHandler = jest.fn()
    const mockMessageHandler = jest.fn()
    const blogs = [
      {
        title: 'Test Title',
        author: 'Test Author',
        url: 'Test URL',
        likes: 0,
        user: {
          username: 'Test Username',
          name: 'Test Name',
        },
      },
      {
        title: 'Test Title 2',
        author: 'Test Author 2',
        url: 'Test URL 2',
        likes: 0,
        user: {
          username: 'Test Username 2',
          name: 'Test Name 2',
        },
      },
    ]
    const user = userEvent.setup()

    const { container } = render(
      <BlogForm
        blogs={blogs}
        setBlogs={mockBlogsHandler}
        setMessageInfo={mockMessageHandler}
      />
    )

    const newBlog = {
      title: 'Test Title 3',
      author: 'Test Author 3',
      url: 'Test URL 3',
      likes: 5,
    }

    const titleInput = container.querySelector('input[name="title"]')
    await user.type(titleInput, newBlog.title)
    const authorInput = container.querySelector('input[name="author"]')
    await user.type(authorInput, newBlog.author)
    const urlInput = container.querySelector('input[name="url"]')
    await user.type(urlInput, newBlog.url)
    const likesInput = container.querySelector('input[name="likes"]')
    await user.type(likesInput, newBlog.likes.toString())

    blogService.create.mockResolvedValue(newBlog)

    const sendButton = screen.getByText('create')
    await user.click(sendButton)

    expect(mockBlogsHandler.mock.calls).toHaveLength(1)
    expect(mockBlogsHandler.mock.calls[0][0][2].title).toBe('Test Title 3')
  })
})
