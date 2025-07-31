import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismaClient';

export async function GET(req) {
  console.log('🚀 Starting /api/stats request');
  
  try {
    const { userId } = getAuth(req);
    console.log('👤 Auth check - userId:', userId);

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all projects where user is owner
    const ownedProjects = await prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true }
    });

    // Get all projects where user is a member
    const memberProjects = await prisma.projectMember.findMany({
      where: { userClerkId: userId },
      select: { projectId: true }
    });

    // Combine project IDs
    const projectIds = [
      ...ownedProjects.map(p => p.id),
      ...memberProjects.map(p => p.projectId)
    ];

    console.log('📊 Project IDs:', projectIds);

    // Get total stones
    const totalStones = await prisma.stone.count({
      where: {
        projectId: { in: projectIds }
      }
    });

    // Get completed stones
    const completedStones = await prisma.stone.count({
      where: {
        projectId: { in: projectIds },
        status: 'DONE'
      }
    });

    // Get unique contributors
    const contributors = await prisma.projectMember.findMany({
      where: {
        projectId: { in: projectIds }
      },
      distinct: ['userClerkId'],
      select: { userClerkId: true }
    });

    const stats = {
      totalProjects: projectIds.length,
      totalStones,
      completedStones,
      activeContributors: contributors.length
    };

    console.log('📈 Final stats:', stats);

    return new NextResponse(
      JSON.stringify(stats),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('❌ Error in stats API:', {
      name: error.name,
      message: error.message,
      code: error.code,
      meta: error.meta
    });

    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch stats',
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