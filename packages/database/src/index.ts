export * from './mongodb';
export * from './redis';
export * from './repositories/userRepository';
export * from './repositories/projectRepository';
export * from './repositories/repoRepository';

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances in development hot-reloading
  const globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export * from '@prisma/client';
export { prisma, PrismaClient };
