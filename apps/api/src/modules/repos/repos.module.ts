import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { GithubService } from './github.service';
import { RepoSyncService } from './repo-sync.service';

@Module({
  controllers: [ReposController],
  providers: [ReposService, GithubService, RepoSyncService],
  exports: [ReposService, GithubService, RepoSyncService],
})
export class ReposModule {}
