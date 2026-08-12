import { prisma } from '../index';
import { GitProvider } from '@prisma/client';

export class RepoRepository {
  static async create(data: {
    projectId: string;
    name: string;
    gitUrl: string;
    gitProvider?: GitProvider;
    branch?: string;
    symbolCount?: number;
  }) {
    return prisma.repository.create({
      data,
    });
  }

  static async linkToProject(data: {
    projectId: string;
    name: string;
    gitUrl: string;
    gitProvider?: GitProvider;
    branch?: string;
    symbolCount?: number;
  }) {
    return this.create(data);
  }

  static async findById(id: string) {
    return prisma.repository.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });
  }

  static async updateStatus(id: string, status: string, symbolCount?: number) {
    return prisma.repository.update({
      where: { id },
      data: {
        status,
        ...(symbolCount !== undefined ? { symbolCount } : {}),
        lastSync: new Date(),
      },
    });
  }

  static async updateSymbolCount(id: string, symbolCount: number) {
    return prisma.repository.update({
      where: { id },
      data: { symbolCount, lastSync: new Date() },
    });
  }

  static async listByProject(projectId: string) {
    return prisma.repository.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async delete(id: string) {
    return prisma.repository.delete({
      where: { id },
    });
  }
}
