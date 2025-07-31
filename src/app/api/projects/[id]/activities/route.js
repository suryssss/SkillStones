import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(req, { params }) {
  console.log('🚀 Starting /api/projects/[id]/activities request');
  
  try {
    const { userId } = getAuth(req);
    console.log('👤 Auth check - userId:', userId);

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { id } = params;
    const projectId = parseInt(id);

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userClerkId: userId } } }
        ]
      }
    });

    if (!project) {
      return new NextResponse(
        JSON.stringify({ error: 'Project not found or unauthorized' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get activities for the project
    const activities = await prisma.activity.findMany({
      where: {
        projectId
      },
      include: {
        user: true,
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📈 Found activities:', activities.length);

    return new NextResponse(
      JSON.stringify(activities),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('❌ Error in project activities API:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });

    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch project activities',
        details: error.message,
        code: error.code
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 