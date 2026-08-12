import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { GithubService } from './github.service';
import { RepoSyncService } from './repo-sync.service';
import { RepoAnalyzerService } from './repo-analyzer.service';
import { FileIndexingService } from './file-indexing.service';

@Module({
  controllers: [ReposController],
  providers: [
    ReposService,
    GithubService,
    RepoSyncService,
    RepoAnalyzerService,
    FileIndexingService,
  ],
  exports: [
    ReposService,
    GithubService,
    RepoSyncService,
    RepoAnalyzerService,
    FileIndexingService,
  ],
})
export class ReposModule {}
