import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReposService } from './repos.service';
import { GithubService } from './github.service';
import { RepoSyncService } from './repo-sync.service';
import { RepoAnalyzerService } from './repo-analyzer.service';
import { ImportRepoDto } from './dto/import-repo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Repositories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('repos')
export class ReposController {
  constructor(
    private readonly reposService: ReposService,
    private readonly githubService: GithubService,
    private readonly repoSyncService: RepoSyncService,
    private readonly repoAnalyzerService: RepoAnalyzerService,
  ) {}

  @Post('import')
  @ApiOperation({ summary: 'Import and register a new Git repository' })
  async importRepository(@Body() dto: ImportRepoDto) {
    return this.reposService.importRepository(dto);
  }

  @Post(':id/sync')
  @ApiOperation({ summary: 'Trigger manual synchronization for a repository' })
  async syncRepository(@Param('id') id: string) {
    return this.repoSyncService.syncRepository(id);
  }

  @Get(':id/sync/status')
  @ApiOperation({ summary: 'Get repository synchronization status' })
  async getSyncStatus(@Param('id') id: string) {
    return this.repoSyncService.getSyncStatus(id);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Trigger repository code analysis and metrics calculation' })
  async analyzeRepository(@Param('id') id: string) {
    return this.repoAnalyzerService.analyzeRepository(id);
  }

  @Get(':id/analysis')
  @ApiOperation({ summary: 'Get cached/latest analysis report for repository' })
  async getAnalysisReport(@Param('id') id: string) {
    return this.repoAnalyzerService.analyzeRepository(id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'List all imported repositories for a project' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.reposService.findByProject(projectId);
  }

  @Get('github/user-repos')
  @ApiOperation({ summary: 'List authenticated user GitHub repositories' })
  async getGithubUserRepos() {
    return this.githubService.getUserRepositories();
  }

  @Get('github/tree')
  @ApiOperation({ summary: 'Fetch GitHub repository file tree structure' })
  @ApiQuery({ name: 'owner', required: true, type: String })
  @ApiQuery({ name: 'repo', required: true, type: String })
  @ApiQuery({ name: 'branch', required: false, type: String })
  async getGithubTree(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('branch') branch?: string,
  ) {
    return this.githubService.getRepositoryTree(owner, repo, branch || 'main');
  }

  @Get('github/branches')
  @ApiOperation({ summary: 'Fetch GitHub repository branch list' })
  @ApiQuery({ name: 'owner', required: true, type: String })
  @ApiQuery({ name: 'repo', required: true, type: String })
  async getGithubBranches(@Query('owner') owner: string, @Query('repo') repo: string) {
    return this.githubService.getBranches(owner, repo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific repository by ID' })
  async findOne(@Param('id') id: string) {
    return this.reposService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove imported repository by ID' })
  async remove(@Param('id') id: string) {
    return this.reposService.remove(id);
  }
}
