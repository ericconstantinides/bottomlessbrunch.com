const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const pages = require('./controllers/pages')
const path = require('path')

// allows starting the server from other directories:
require('dotenv').config({path: path.join(__dirname, '.env')})

const MONGODB_URI = process.env.ENVIRONMENT === 'prod'
  ? process.env.MONGODB_PROD_URI
  : process.env.ENVIRONMENT === 'dev'
    ? process.env.MONGODB_DEV_URI
    : ''

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
})

// App Setup
app.use(morgan('combined'))
app.use(cors()) // cors middleware
app.use(bodyParser.json({ type: '*/*' }))

// importing routes
const routes = require('./routes')
// NOT YET:
// const authRoutes = require('./routes/authRoutes')

// register the route
app.use('/api/v1', routes)
app.get('/sitemap.xml', pages.sitemap)
// NOT YET:
// app.use('/', authRoutes)

// Server Setup
const PORT = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(PORT)
console.log(`${process.env.ENVIRONMENT} Server listening on port ${PORT}`)
