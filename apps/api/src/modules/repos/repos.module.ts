import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { GithubService } from './github.service';
import { RepoSyncService } from './repo-sync.service';
import { RepoAnalyzerService } from './repo-analyzer.service';
import { FileIndexingService } from './file-indexing.service';
import { DocIndexingService } from './doc-indexing.service';

@Module({
  controllers: [ReposController],
  providers: [
    ReposService,
    GithubService,
    RepoSyncService,
    RepoAnalyzerService,
    FileIndexingService,
    DocIndexingService,
  ],
  exports: [
    ReposService,
    GithubService,
    RepoSyncService,
    RepoAnalyzerService,
    FileIndexingService,
    DocIndexingService,
  ],
})
export class ReposModule {}
