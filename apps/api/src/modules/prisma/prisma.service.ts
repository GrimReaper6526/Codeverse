import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ NestJS PrismaService connected to database.');
    } catch (err: any) {
      console.warn('⚠️ NestJS PrismaService Connection Warning:', err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
