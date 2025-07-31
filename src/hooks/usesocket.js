import { useEffect, useRef } from 'react'
import io from 'socket.io-client'

export function useSocket(stoneId) {
  const socket = useRef()

  useEffect(() => {
    // Initialize socket connection
    socket.current = io()

    // Join stone room
    socket.current.emit('join-stone', stoneId)

    return () => {
      // Leave stone room and disconnect
      socket.current.emit('leave-stone', stoneId)
      socket.current.disconnect()
    }
  }, [stoneId])

  return socket.current
}
