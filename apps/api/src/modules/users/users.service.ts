import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@codeverse/database';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  async findAll(page = 1, limit = 10, search?: string) {
    const result = await UserRepository.findMany({ page, limit, search });
    const items = result.items.map(({ passwordHash: _hash, ...user }) => user);
    return {
      ...result,
      items,
    };
  }

  async findOne(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    const { passwordHash: _hash, ...safeUser } = user;
    return safeUser;
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await UserRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    const updated = await UserRepository.update(id, dto);
    const { passwordHash: _hash, ...safeUser } = updated;
    return safeUser;
  }

  async remove(id: string) {
    const existing = await UserRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    await UserRepository.delete(id);
    return { deleted: true, id };
  }
}
