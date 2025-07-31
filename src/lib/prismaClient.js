import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Add logging middleware
prisma.$use(async (params, next) => {
  const before = Date.now();
  console.log(`📝 Prisma Query: ${params.model}.${params.action}`);
  console.log('📦 Query params:', params);
  
  try {
    const result = await next(params);
    const after = Date.now();
    console.log(`✅ Query completed in ${after - before}ms`);
    return result;
  } catch (error) {
    console.error('❌ Prisma Query Error:', {
      model: params.model,
      action: params.action,
      error: error.message,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  }
});

// Test connection on startup with more detailed error logging
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((error) => {
    console.error('❌ Database connection failed:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    // Log additional connection details (without sensitive info)
    console.error('Connection details:', {
      nodeEnv: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL,
      provider: prisma._engineConfig.activeProvider,
    });
  });

export { prisma }