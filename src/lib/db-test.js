const { prisma } = require('./prismaClient');

async function testDatabase() {
  console.log('🔍 Starting database connection test...');
  
  try {
    console.log('📝 Database URL format check:', {
      hasUrl: !!process.env.DATABASE_URL,
      urlStart: process.env.DATABASE_URL?.substring(0, 10) + '...',
    });

    // Test connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test Project model
    console.log('📊 Testing Project model...');
    const projectCount = await prisma.project.count();
    console.log('✅ Project count:', projectCount);

    // Test Stone model
    console.log('💎 Testing Stone model...');
    const stoneCount = await prisma.stone.count();
    console.log('✅ Stone count:', stoneCount);

    // Test ProjectMember model
    console.log('👥 Testing ProjectMember model...');
    const memberCount = await prisma.projectMember.count();
    console.log('✅ ProjectMember count:', memberCount);

    console.log('✅ All database tests passed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 