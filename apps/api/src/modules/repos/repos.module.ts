import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { GithubService } from './github.service';

@Module({
  controllers: [ReposController],
  providers: [ReposService, GithubService],
  exports: [ReposService, GithubService],
})
export class ReposModule {}
