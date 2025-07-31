import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prismaClient'

export async function PUT(req, { params }) {
  console.log('📝 PUT /api/projects/[id] - Starting request')
  try {
    const { userId } = getAuth(req)
    console.log('userId:', userId)

    if (!userId) {
      console.log('❌ Unauthorized: No userId found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params
    console.log('🔍 Project ID:', id)

    const { title, description, stones } = await req.json()
    console.log('📦 Request body:', { title, description, stones })

    if (!title) {
      console.log('❌ Bad Request: Title is missing')
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Checking project ownership')
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(id),
        ownerId: userId
      }
    })

    if (!project) {
      console.log('❌ Project not found or user is not owner')
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      )
    }

    // First, delete any stones that are no longer in the update
    if (stones) {
      const existingStones = await prisma.stone.findMany({
        where: { projectId: parseInt(id) },
        select: { id: true }
      });

      const updatedStoneIds = stones
        .filter(stone => stone.id)
        .map(stone => stone.id);

      const stonesToDelete = existingStones
        .filter(stone => !updatedStoneIds.includes(stone.id))
        .map(stone => stone.id);

      if (stonesToDelete.length > 0) {
        await prisma.stone.deleteMany({
          where: { id: { in: stonesToDelete } }
        });
      }
    }

    console.log('📝 Updating project:', id)
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        stones: stones ? {
          upsert: stones.map(stone => ({
            where: {
              id: stone.id || -1 // Use -1 for new stones
            },
            create: {
              title: stone.title,
              detail: stone.detail,
              status: stone.status
            },
            update: {
              title: stone.title,
              detail: stone.detail,
              status: stone.status
            }
          }))
        } : undefined
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        stones: true,
        owner: true
      }
    })
    console.log('✅ Project updated successfully')

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('❌ Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  console.log('🗑️ DELETE /api/projects/[id] - Starting request')
  console.log('Request params:', params)
  
  try {
    // Get auth context
    const auth = getAuth(req)
    const { userId } = auth
    console.log('Auth check - userId:', userId)

    if (!userId) {
      console.log('❌ Unauthorized: No userId found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params
    if (!id) {
      console.log('❌ Bad Request: No project ID provided')
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const projectId = parseInt(id)
    console.log('🔍 Parsed Project ID:', projectId)

    if (isNaN(projectId)) {
      console.log('❌ Bad Request: Invalid project ID format')
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      )
    }

    try {
      // Check project ownership
      console.log('Checking project ownership for:', { projectId, userId })
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId: userId
        },
        include: {
          members: true,
          stones: true
        }
      })

      console.log('Found project:', project)

      if (!project) {
        console.log('❌ Project not found or user is not owner')
        return NextResponse.json(
          { error: 'Project not found or unauthorized' },
          { status: 404 }
        )
      }

      // First, delete all related records
      console.log('Deleting project members...')
      await prisma.projectMember.deleteMany({
        where: { projectId }
      })

      console.log('Deleting project stones...')
      await prisma.stone.deleteMany({
        where: { projectId }
      })

      // Finally, delete the project
      console.log('Attempting to delete project:', projectId)
      await prisma.project.delete({
        where: { id: projectId }
      })
      console.log('✅ Project deleted successfully')

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error('❌ Database error details:', {
        code: dbError.code,
        message: dbError.message,
        meta: dbError.meta
      })
      
      if (dbError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Unexpected error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(req, { params }) {
  console.log('🔍 GET /api/projects/[id] - Starting request')
  try {
    const { userId } = getAuth(req)
    console.log('userId:', userId)

    if (!userId) {
      console.log('❌ Unauthorized: No userId found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = params
    console.log('🔍 Project ID:', id)

    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(id),
        OR: [
          { ownerId: userId },
          { members: { some: { userClerkId: userId } } }
        ]
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        stones: true,
        owner: true,
        activities: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      console.log('❌ Project not found or unauthorized')
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      )
    }

    console.log('✅ Project found successfully')
    return NextResponse.json(project)
  } catch (error) {
    console.error('❌ Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
} 