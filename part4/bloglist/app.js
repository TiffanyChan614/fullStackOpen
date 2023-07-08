const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blog')
const Blog = require('./models/blog')

mongoose.connect(config.MONGODB_URL)

logger.info('connected to MongoDB')

app.use(cors())
app.use(express.json())
app.use('./api/blogs', blogRouter)

module.exports = app
