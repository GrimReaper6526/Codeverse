import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RepoRepository } from '@codeverse/database';
import { GithubService } from './github.service';

@Injectable()
export class RepoSyncService {
  private readonly logger = new Logger(RepoSyncService.name);

  constructor(private readonly githubService: GithubService) {}

  async syncRepository(repoId: string) {
    const repo = await RepoRepository.findById(repoId);
    if (!repo) {
      throw new NotFoundException(`Repository with ID '${repoId}' not found`);
    }

    this.logger.log(`Starting synchronization for repository ${repo.name} (${repo.id})`);

    // Update status to SYNCING
    await RepoRepository.updateStatus(repo.id, 'SYNCING');

    try {
      // Extract owner and repo name from gitUrl if it is a GitHub repository
      const { owner, repoName } = this.parseGitUrl(repo.gitUrl);
      let symbolCount = repo.symbolCount;

      if (owner && repoName) {
        const tree = await this.githubService.getRepositoryTree(
          owner,
          repoName,
          repo.branch || 'main',
        );
        // Estimate symbol count based on source files in tree
        const sourceFiles = tree.filter(
          (item) =>
            item.type === 'file' && /\.(ts|tsx|js|jsx|py|go|rs|java|c|cpp)$/.test(item.path),
        );
        symbolCount = sourceFiles.length * 15; // Estimated 15 symbols per source file
      }

      const updated = await RepoRepository.updateStatus(repo.id, 'SYNCED', symbolCount);

      return {
        id: updated.id,
        name: updated.name,
        status: updated.status,
        symbolCount: updated.symbolCount,
        lastSync: updated.lastSync,
        message: 'Repository synchronization completed successfully',
      };
    } catch (error) {
      this.logger.error(`Sync failed for repository ${repo.id}: ${error}`);
      await RepoRepository.updateStatus(repo.id, 'SYNC_ERROR');
      return {
        id: repo.id,
        name: repo.name,
        status: 'SYNC_ERROR',
        message: `Synchronization failed: ${(error as Error).message}`,
      };
    }
  }

  async getSyncStatus(repoId: string) {
    const repo = await RepoRepository.findById(repoId);
    if (!repo) {
      throw new NotFoundException(`Repository with ID '${repoId}' not found`);
    }

    return {
      id: repo.id,
      name: repo.name,
      status: repo.status,
      lastSync: repo.lastSync,
      symbolCount: repo.symbolCount,
    };
  }

  private parseGitUrl(gitUrl: string): { owner?: string; repoName?: string } {
    try {
      const cleaned = gitUrl.replace(/\.git$/, '');
      const match = cleaned.match(/github\.com[/:]([^/]+)\/([^/]+)/);
      if (match) {
        return { owner: match[1], repoName: match[2] };
      }
    } catch {
      // Ignored
    }
    return {};
  }
}
