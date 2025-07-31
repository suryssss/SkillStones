import { NextResponse } from 'next/server'
import { getAuth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prismaClient'

export async function GET(req) {
  console.log('🔍 GET /api/projects - Starting request')
  try {
    const { userId } = getAuth(req)
    console.log('👤 Auth userId:', userId)

    if (!userId) {
      console.log('❌ Unauthorized: No userId found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    try {
      // Get user details from Clerk
      const user = await currentUser()
      if (!user) {
        console.log('❌ No user found in Clerk')
        return NextResponse.json(
          { error: 'User not found in Clerk' },
          { status: 404 }
        )
      }

      // First, ensure the user exists in our database
      const dbUser = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.firstName || '',
        },
        create: {
          clerkId: userId,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: user.firstName || '',
        },
      })
      console.log('✅ User verified/created:', dbUser.clerkId)

      // Fetch projects
      console.log('🔍 Fetching projects for user:', userId)
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userClerkId: userId } } }
          ]
        },
        include: {
          stones: true,
          members: {
            include: {
              user: true
            }
          },
          owner: true
        }
      })
      console.log('✅ Found projects:', projects.length)
      return NextResponse.json(projects)
    } catch (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  console.log('📝 POST /api/projects - Starting request')
  try {
    const { userId } = getAuth(req)
    console.log('👤 Auth userId:', userId)

    if (!userId) {
      console.log('❌ Unauthorized: No userId found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { title, description, stones } = await req.json()
    console.log('📦 Request body:', { title, description, stones })

    if (!title) {
      console.log('❌ Bad Request: Title is missing')
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    try {
      // First, ensure the user exists in our database
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: '', // Will be updated with Clerk data
          name: '', // Will be updated with Clerk data
        },
      })
      console.log('✅ User verified/created:', user.clerkId)

      // Create the project with stones
      console.log('📝 Creating new project for user:', userId)
      const project = await prisma.project.create({
        data: {
          title,
          description,
          ownerId: userId,
          members: {
            create: {
              userClerkId: userId,
              role: 'OWNER'
            }
          },
          stones: {
            create: stones?.map(stone => ({
              title: stone.title,
              detail: stone.detail,
              status: stone.status
            })) || []
          }
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
      console.log('✅ Project created successfully:', project.id)

      return NextResponse.json(project)
    } catch (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(req) {
  console.log('✏️ PUT /api/projects - Starting request')
  try {
    const { userId } = getAuth(req)
    console.log('👤 Auth userId:', userId)

    if (!userId) {
      console.log('❌ Unauthorized: No userId found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const url = new URL(req.url)
    const projectId = url.pathname.split('/').pop()
    const { title, description, stones } = await req.json()
    console.log('📦 Request body:', { projectId, title, description, stones })

    if (!title) {
      console.log('❌ Bad Request: Title is missing')
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    try {
      // First, verify project ownership
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
        include: { stones: true }
      })

      if (!existingProject) {
        console.log('❌ Project not found:', projectId)
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }

      if (existingProject.ownerId !== userId) {
        console.log('❌ Unauthorized: User is not the project owner')
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      // Update the project and its stones
      console.log('✏️ Updating project:', projectId)
      const project = await prisma.project.update({
        where: { id: projectId },
        data: {
          title,
          description,
          stones: {
            deleteMany: {}, // Remove all existing stones
            create: stones?.map(stone => ({
              title: stone.title,
              detail: stone.detail,
              status: stone.status
            })) || []
          }
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
      console.log('✅ Project updated successfully:', project.id)

      return NextResponse.json(project)
    } catch (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
