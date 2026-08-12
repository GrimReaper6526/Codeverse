import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { GithubService } from './github.service';
import { RepoSyncService } from './repo-sync.service';
import { RepoAnalyzerService } from './repo-analyzer.service';

@Module({
  controllers: [ReposController],
  providers: [ReposService, GithubService, RepoSyncService, RepoAnalyzerService],
  exports: [ReposService, GithubService, RepoSyncService, RepoAnalyzerService],
})
export class ReposModule {}
