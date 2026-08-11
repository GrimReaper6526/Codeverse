import { prisma } from '../index';
import { Visibility } from '@prisma/client';

export class ProjectRepository {
  static async create(data: {
    name: string;
    description?: string;
    ownerId: string;
    visibility?: Visibility;
    organizationId?: string;
  }) {
    return prisma.project.create({
      data,
      include: {
        repositories: true,
        plugins: true,
      },
    });
  }

  static async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        repositories: true,
        plugins: true,
        owner: true,
      },
    });
  }

  static async listByOwner(ownerId: string) {
    return prisma.project.findMany({
      where: { ownerId },
      include: {
        repositories: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
