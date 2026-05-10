const { Server } = require('socket.io')

let io

function setupSocket(server) {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  })

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('subscribe:alerts', () => {
      socket.join('alerts')
      console.log(`${socket.id} subscribed to alerts`)
    })

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}

// Call this anywhere to broadcast to all alert subscribers
function emitAlert(type, payload) {
  if (!io) return
  io.to('alerts').emit('alert', { type, ...payload, timestamp: new Date() })
}

module.exports = { setupSocket, emitAlert }