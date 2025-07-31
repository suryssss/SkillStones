import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prismaClient';

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
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
      );
    }

    const stones = await prisma.stone.findMany({
      where: {
        projectId: parseInt(projectId)
      },
      include: {
        assignee: true,
        messages: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(stones);
  } catch (error) {
    console.error('Error fetching stones:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { projectId, title, detail, status } = data;

    if (!projectId || !title) {
      return NextResponse.json(
        { error: 'Project ID and title are required' },
        { status: 400 }
      );
    }

    // Check if user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
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
      );
    }

    const stone = await prisma.stone.create({
      data: {
        title,
        detail: detail || '',
        status: status || 'TO_DO',
        projectId: parseInt(projectId)
      },
      include: {
        assignee: true,
        messages: true
      }
    });

    // Create activity for stone creation
    await prisma.activity.create({
      data: {
        type: 'STONE_CREATED',
        description: `Created stone "${title}"`,
        userClerkId: userId,
        projectId: parseInt(projectId)
      }
    });

    return NextResponse.json(stone);
  } catch (error) {
    console.error('Error creating stone:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { id, title, detail, status } = data;

    if (!id || !title) {
      return NextResponse.json(
        { error: 'Stone ID and title are required' },
        { status: 400 }
      );
    }

    // Get the stone and check project access
    const existingStone = await prisma.stone.findUnique({
      where: { id: parseInt(id) },
      include: { project: true }
    });

    if (!existingStone) {
      return NextResponse.json(
        { error: 'Stone not found' },
        { status: 404 }
      );
    }

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: existingStone.projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userClerkId: userId } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const stone = await prisma.stone.update({
      where: { id: parseInt(id) },
      data: {
        title,
        detail: detail || '',
        status: status || existingStone.status
      },
      include: {
        assignee: true,
        messages: true
      }
    });

    // Create activity for stone update
    await prisma.activity.create({
      data: {
        type: status === 'DONE' ? 'STONE_COMPLETED' : 'STONE_UPDATED',
        description: status === 'DONE' 
          ? `Completed stone "${title}"`
          : `Updated stone "${title}"`,
        userClerkId: userId,
        projectId: existingStone.projectId
      }
    });

    return NextResponse.json(stone);
  } catch (error) {
    console.error('Error updating stone:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Stone ID is required' },
        { status: 400 }
      );
    }

    // Get the stone and check project access
    const stone = await prisma.stone.findUnique({
      where: { id: parseInt(id) },
      include: { project: true }
    });

    if (!stone) {
      return NextResponse.json(
        { error: 'Stone not found' },
        { status: 404 }
      );
    }

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: stone.projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { userClerkId: userId } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.stone.delete({
      where: { id: parseInt(id) }
    });

    // Create activity for stone deletion
    await prisma.activity.create({
      data: {
        type: 'STONE_DELETED',
        description: `Deleted stone "${stone.title}"`,
        userClerkId: userId,
        projectId: stone.projectId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stone:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
} 