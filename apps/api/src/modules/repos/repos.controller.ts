import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ReposService } from './repos.service';
import { GithubService } from './github.service';
import { RepoSyncService } from './repo-sync.service';
import { RepoAnalyzerService } from './repo-analyzer.service';
import { FileIndexingService } from './file-indexing.service';
import { DocIndexingService } from './doc-indexing.service';
import { JobsService, JobType } from './jobs.service';
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
    private readonly fileIndexingService: FileIndexingService,
    private readonly docIndexingService: DocIndexingService,
    private readonly jobsService: JobsService,
  ) {}

  @Post('import')
  @ApiOperation({ summary: 'Import and register a new Git repository' })
  async importRepository(@Body() dto: ImportRepoDto) {
    return this.reposService.importRepository(dto);
  }

  @Post(':id/jobs')
  @ApiOperation({ summary: 'Enqueue an asynchronous background job for repository' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['SYNC', 'ANALYZE', 'INDEX_FILES', 'INDEX_DOCS'],
          example: 'SYNC',
        },
      },
    },
  })
  async enqueueJob(@Param('id') id: string, @Body('type') type: JobType) {
    return this.jobsService.enqueueJob(id, type || 'SYNC');
  }

  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Get status and details of background job by Job ID' })
  async getJob(@Param('jobId') jobId: string) {
    return this.jobsService.getJob(jobId);
  }

  @Get(':id/jobs')
  @ApiOperation({ summary: 'List all background jobs associated with repository' })
  async getRepoJobs(@Param('id') id: string) {
    return this.jobsService.getRepoJobs(id);
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

  @Post(':id/index-files')
  @ApiOperation({ summary: 'Trigger file indexing for repository' })
  async indexRepositoryFiles(@Param('id') id: string) {
    return this.fileIndexingService.indexRepositoryFiles(id);
  }

  @Get(':id/files')
  @ApiOperation({ summary: 'Get indexed files for repository with optional search filter' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getIndexedFiles(
    @Param('id') id: string,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
  ) {
    return this.fileIndexingService.getIndexedFiles(id, search, limit ? Number(limit) : 50);
  }

  @Get(':id/files/content')
  @ApiOperation({ summary: 'Get source content for specific indexed file' })
  @ApiQuery({ name: 'path', required: true, type: String })
  async getFileContent(@Param('id') id: string, @Query('path') filePath: string) {
    return this.fileIndexingService.getFileContent(id, filePath);
  }

  @Post(':id/index-docs')
  @ApiOperation({ summary: 'Parse and index documentation files in repository' })
  async indexRepositoryDocs(@Param('id') id: string) {
    return this.docIndexingService.indexRepositoryDocs(id);
  }

  @Get(':id/docs')
  @ApiOperation({ summary: 'Get indexed documentation chunks with search filtering' })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getIndexedDocs(@Param('id') id: string, @Query('search') search?: string) {
    return this.docIndexingService.getIndexedDocs(id, search);
  }

  @Get(':id/docs/readme')
  @ApiOperation({ summary: 'Fetch project primary README documentation' })
  async getReadme(@Param('id') id: string) {
    return this.docIndexingService.getReadme(id);
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
