import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma, connectMongoDB, createRedisClient } from '@codeverse/database';
import Redis from 'ioredis';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public redisClient: Redis;

  async onModuleInit() {
    console.log('🔌 Connecting to CodeVerse Polyglot Database Cluster...');

    // 1. Initialize PostgreSQL Prisma Client
    try {
      await prisma.$connect();
      console.log('✅ PostgreSQL connected successfully via Prisma.');
    } catch (err: any) {
      console.warn('⚠️ PostgreSQL Connection Warning:', err.message);
    }

    // 2. Initialize MongoDB Mongoose Connection
    try {
      const mongoUri =
        process.env.MONGODB_URI ||
        'mongodb://codeverse:codeverse_secret@localhost:27017/codeverse_mongo?authSource=admin';
      await connectMongoDB(mongoUri);
      console.log('✅ MongoDB connected successfully via Mongoose.');
    } catch (err: any) {
      console.warn('⚠️ MongoDB Connection Warning:', err.message);
    }

    // 3. Initialize Redis Client
    try {
      this.redisClient = createRedisClient();
      console.log('✅ Redis client initialized successfully.');
    } catch (err: any) {
      console.warn('⚠️ Redis Connection Warning:', err.message);
    }
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}
