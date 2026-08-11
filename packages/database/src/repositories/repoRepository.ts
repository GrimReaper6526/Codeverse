import { prisma } from '../index';
import { GitProvider } from '@prisma/client';

export class RepoRepository {
  static async linkToProject(data: {
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

  static async updateSymbolCount(id: string, symbolCount: number) {
    return prisma.repository.update({
      where: { id },
      data: { symbolCount, lastSync: new Date() },
    });
  }

  static async listByProject(projectId: string) {
    return prisma.repository.findMany({
      where: { projectId },
    });
  }
}
