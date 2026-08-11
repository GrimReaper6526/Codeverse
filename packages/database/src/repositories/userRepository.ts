import { prisma } from '../index';
import { AuthProvider, Role } from '@prisma/client';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async create(data: {
    email: string;
    name?: string;
    avatar?: string;
    passwordHash?: string;
    provider?: AuthProvider;
    role?: Role;
  }) {
    return prisma.user.create({
      data,
    });
  }

  static async updateRole(id: string, role: Role) {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
