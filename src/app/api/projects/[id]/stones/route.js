import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prismaClient'

export async function GET(req, { params }) {
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
          { members: { some: { userClerkId: userId } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      )
    }

    const stones = await prisma.stone.findMany({
      where: {
        projectId: parseInt(params.id)
      },
      include: {
        assignee: true,
        messages: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(stones)
  } catch (error) {
    console.error('Error fetching stones:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req, { params }) {
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
          { members: { some: { userClerkId: userId } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      )
    }

    const { title, detail, status } = await req.json()

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const stone = await prisma.stone.create({
      data: {
        title,
        detail,
        status: status || 'TO_DO',
        projectId: parseInt(params.id)
      },
      include: {
        assignee: true,
        messages: true
      }
    })

    return NextResponse.json(stone)
  } catch (error) {
    console.error('Error creating stone:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
