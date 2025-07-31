import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prismaClient'

export async function POST() {
  try {
    // First create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        clerkId: 'test-owner-id',
        name: 'Test User'
      }
    })

    // Then create a test project
    const testProject = await prisma.project.create({
      data: {
        title: 'Test Project',
        description: 'This is a test project',
        ownerId: testUser.clerkId,
        members: {
          create: {
            userClerkId: testUser.clerkId,
            role: 'OWNER'
          }
        }
      },
      include: {
        members: true,
        owner: true
      }
    })

    return NextResponse.json({ 
      status: 'success', 
      message: 'Test data inserted successfully',
      data: testProject
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error inserting test data:', error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to insert test data',
      error: error.message,
      details: error
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
