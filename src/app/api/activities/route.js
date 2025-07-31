import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(req) {
  console.log('🚀 Starting /api/activities request');
  
  try {
    const { userId } = getAuth(req);
    console.log('👤 Auth check - userId:', userId);

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all projects where user is owner or member
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userClerkId: userId } } }
        ]
      },
      select: { id: true }
    });

    const projectIds = projects.map(p => p.id);

    // Get activities for all accessible projects
    const activities = await prisma.activity.findMany({
      where: {
        projectId: { in: projectIds }
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
    console.error('❌ Error in activities API:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });

    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch activities',
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