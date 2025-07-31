import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prismaClient'

export async function PUT(req, { params }) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(params.id),
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      )
    }

    const { status } = await req.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Update the stone
    const stone = await prisma.stone.update({
      where: {
        id: parseInt(params.stoneId),
        projectId: parseInt(params.id)
      },
      data: {
        status
      },
      include: {
        assignee: true,
        messages: true
      }
    })

    // Create an activity for the status change
    await prisma.activity.create({
      data: {
        type: status === 'DONE' ? 'STONE_COMPLETED' : 'STONE_UPDATED',
        description: `${status === 'DONE' ? 'completed' : 'moved'} stone "${stone.title}" to ${status.toLowerCase().replace('_', ' ')}`,
        userClerkId: userId,
        projectId: parseInt(params.id)
      }
    })

    return NextResponse.json(stone)
  } catch (error) {
    console.error('Error updating stone:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
} 