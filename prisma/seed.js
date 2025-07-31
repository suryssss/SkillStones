const { PrismaClient } = require('../src/generated/prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create test users
    const user1 = await prisma.user.upsert({
      where: { email: 'test1@example.com' },
      update: {},
      create: {
        email: 'test1@example.com',
        clerkId: 'user_2test1',
        name: 'Test User 1',
      },
    })
    console.log('✅ Created/Updated user 1:', user1.email)

    const user2 = await prisma.user.upsert({
      where: { email: 'test2@example.com' },
      update: {},
      create: {
        email: 'test2@example.com',
        clerkId: 'user_2test2',
        name: 'Test User 2',
      },
    })
    console.log('✅ Created/Updated user 2:', user2.email)

    // Create projects
    const project1 = await prisma.project.upsert({
      where: { 
        id: 1 // Assuming this is the first project
      },
      update: {
        title: 'E-commerce Website',
        description: 'A modern e-commerce platform with React and Node.js',
        ownerId: user1.clerkId,
      },
      create: {
        title: 'E-commerce Website',
        description: 'A modern e-commerce platform with React and Node.js',
        ownerId: user1.clerkId,
        members: {
          create: {
            userClerkId: user1.clerkId,
            role: 'OWNER',
          },
        },
      },
    })
    console.log('✅ Created/Updated project 1:', project1.title)

    const project2 = await prisma.project.upsert({
      where: { 
        id: 2 // Assuming this is the second project
      },
      update: {
        title: 'Task Management App',
        description: 'A collaborative task management application',
        ownerId: user2.clerkId,
      },
      create: {
        title: 'Task Management App',
        description: 'A collaborative task management application',
        ownerId: user2.clerkId,
        members: {
          create: [
            {
              userClerkId: user2.clerkId,
              role: 'OWNER',
            },
            {
              userClerkId: user1.clerkId,
              role: 'CONTRIBUTOR',
            },
          ],
        },
      },
    })
    console.log('✅ Created/Updated project 2:', project2.title)

    // Create stones (tasks)
    const stone1 = await prisma.stone.upsert({
      where: { id: 1 },
      update: {
        title: 'Design Homepage',
        detail: 'Create a modern and responsive homepage design',
        status: 'IN_PROGRESS',
        projectId: project1.id,
        assigneeId: user1.clerkId,
      },
      create: {
        title: 'Design Homepage',
        detail: 'Create a modern and responsive homepage design',
        status: 'IN_PROGRESS',
        projectId: project1.id,
        assigneeId: user1.clerkId,
      },
    })
    console.log('✅ Created/Updated stone 1:', stone1.title)

    const stone2 = await prisma.stone.upsert({
      where: { id: 2 },
      update: {
        title: 'Implement Authentication',
        detail: 'Set up user authentication with Clerk',
        status: 'TO_DO',
        projectId: project1.id,
        assigneeId: user2.clerkId,
      },
      create: {
        title: 'Implement Authentication',
        detail: 'Set up user authentication with Clerk',
        status: 'TO_DO',
        projectId: project1.id,
        assigneeId: user2.clerkId,
      },
    })
    console.log('✅ Created/Updated stone 2:', stone2.title)

    const stone3 = await prisma.stone.upsert({
      where: { id: 3 },
      update: {
        title: 'Database Schema',
        detail: 'Design and implement the database schema',
        status: 'DONE',
        projectId: project2.id,
        assigneeId: user1.clerkId,
      },
      create: {
        title: 'Database Schema',
        detail: 'Design and implement the database schema',
        status: 'DONE',
        projectId: project2.id,
        assigneeId: user1.clerkId,
      },
    })
    console.log('✅ Created/Updated stone 3:', stone3.title)

    // Create messages
    const message1 = await prisma.message.upsert({
      where: { id: 1 },
      update: {
        content: 'I\'ve started working on the homepage design',
        senderId: user1.clerkId,
        stoneId: stone1.id,
      },
      create: {
        content: 'I\'ve started working on the homepage design',
        senderId: user1.clerkId,
        stoneId: stone1.id,
      },
    })
    console.log('✅ Created/Updated message 1')

    const message2 = await prisma.message.upsert({
      where: { id: 2 },
      update: {
        content: 'Great! Let me know if you need any help',
        senderId: user2.clerkId,
        stoneId: stone1.id,
      },
      create: {
        content: 'Great! Let me know if you need any help',
        senderId: user2.clerkId,
        stoneId: stone1.id,
      },
    })
    console.log('✅ Created/Updated message 2')

    console.log('🌱 Database seeding completed!')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 