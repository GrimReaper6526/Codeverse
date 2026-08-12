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
        owner: true,
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

  static async findMany(params?: {
    page?: number;
    limit?: number;
    search?: string;
    ownerId?: string;
    visibility?: Visibility;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.ownerId) {
      where.ownerId = params.ownerId;
    }

    if (params?.visibility) {
      where.visibility = params.visibility;
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          repositories: true,
          owner: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      visibility?: Visibility;
    },
  ) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        repositories: true,
        owner: true,
      },
    });
  }

  static async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
}
