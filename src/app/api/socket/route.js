import { initSocket } from '@/lib/socket'

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    res.socket.server.io = initSocket(res.socket.server)
  }
  res.end()
}

export const GET = ioHandler
