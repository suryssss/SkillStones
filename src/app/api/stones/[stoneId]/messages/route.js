import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/dist'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const messages = await prisma.message.findMany({
    where: {
      stoneId: parseInt(params.stoneId)
    },
    include: {
      sender: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  return NextResponse.json(messages)
}

export async function POST(req, { params }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()

  const message = await prisma.message.create({
    data: {
      content,
      senderId: userId,
      stoneId: parseInt(params.stoneId)
    },
    include: {
      sender: true
    }
  })

  // Emit socket event for real-time chat
  const io = req.socket.server.io
  io.to(`stone-${params.stoneId}`).emit('new-message', message)

  return NextResponse.json(message)
}
