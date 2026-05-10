require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { setupSocket } = require('./socket')
const errorHandler = require('./middleware/errorHandler')

// Routes
const asteroidsRouter = require('./routes/asteroids')
const favoritesRouter = require('./routes/favorites')

const app = express()
const server = http.createServer(app)

// Middleware
app.use(helmet())
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }))
app.use(morgan('dev'))
app.use(express.json())

// Routes
app.use('/api/asteroids', asteroidsRouter)
app.use('/api/favorites', favoritesRouter)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

// Error handler 
app.use(errorHandler)

// Socket.io
setupSocket(server)

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
    console.log(`🚀 NASA Platform server running on port ${PORT}`)
})