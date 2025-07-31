import { Server } from 'socket.io'

export function initSocket(server) {
  const io = new Server(server)

  io.on('connection', (socket) => {
    socket.on('join-stone', (stoneId) => {
      socket.join(`stone-${stoneId}`)
    })

    socket.on('leave-stone', (stoneId) => {
      socket.leave(`stone-${stoneId}`)
    })

    socket.on('stone-update', (data) => {
      io.to(`stone-${data.stoneId}`).emit('stone-updated', data)
    })

    socket.on('send-message', (data) => {
      io.to(`stone-${data.stoneId}`).emit('new-message', data)
    })
  })

  return io
}
