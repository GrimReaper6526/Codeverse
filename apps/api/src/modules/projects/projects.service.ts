import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository, RepoRepository, Visibility } from '@codeverse/database';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  async create(ownerId: string, dto: CreateProjectDto) {
    const project = await ProjectRepository.create({
      name: dto.name,
      description: dto.description,
      visibility: dto.visibility || Visibility.PRIVATE,
      ownerId,
    });

    if (dto.repositoryUrl) {
      const repoName = dto.repositoryUrl.split('/').pop() || dto.name;
      await RepoRepository.create({
        projectId: project.id,
        name: repoName,
        gitUrl: dto.repositoryUrl,
        branch: 'main',
      });
    }

    return this.findOne(project.id);
  }

  async findAll(page = 1, limit = 10, search?: string, ownerId?: string, visibility?: Visibility) {
    return ProjectRepository.findMany({
      page,
      limit,
      search,
      ownerId,
      visibility,
    });
  }

  async findOne(id: string) {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      throw new NotFoundException(`Project with ID '${id}' not found`);
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await ProjectRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Project with ID '${id}' not found`);
    }
    return ProjectRepository.update(id, dto);
  }

  async remove(id: string) {
    const existing = await ProjectRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Project with ID '${id}' not found`);
    }
    await ProjectRepository.delete(id);
    return { deleted: true, id };
  }
}
