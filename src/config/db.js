import { PrismaClient } from '@prisma/client';
import config from './env.js';

const prisma = new PrismaClient({
  log: config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

