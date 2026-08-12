import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RepoRepository, ProjectRepository, GitProvider } from '@codeverse/database';
import { ImportRepoDto } from './dto/import-repo.dto';

@Injectable()
export class ReposService {
  async importRepository(dto: ImportRepoDto) {
    const project = await ProjectRepository.findById(dto.projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID '${dto.projectId}' not found`);
    }

    const repoName = this.extractRepoName(dto.gitUrl);
    if (!repoName) {
      throw new BadRequestException('Invalid Git URL format');
    }

    const repository = await RepoRepository.create({
      projectId: dto.projectId,
      name: repoName,
      gitUrl: dto.gitUrl,
      gitProvider: dto.gitProvider || GitProvider.GITHUB,
      branch: dto.branch || 'main',
      symbolCount: 0,
    });

    return {
      ...repository,
      status: 'importing',
      message: 'Git repository successfully registered for indexing',
    };
  }

  async findByProject(projectId: string) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID '${projectId}' not found`);
    }
    return RepoRepository.listByProject(projectId);
  }

  async findOne(id: string) {
    const repo = await RepoRepository.findById(id);
    if (!repo) {
      throw new NotFoundException(`Repository with ID '${id}' not found`);
    }
    return repo;
  }

  async remove(id: string) {
    const repo = await RepoRepository.findById(id);
    if (!repo) {
      throw new NotFoundException(`Repository with ID '${id}' not found`);
    }
    await RepoRepository.delete(id);
    return { deleted: true, id };
  }

  private extractRepoName(gitUrl: string): string {
    const cleaned = gitUrl.trim().replace(/\.git$/, '');
    const parts = cleaned.split('/');
    return parts.pop() || 'imported-repo';
  }
}
