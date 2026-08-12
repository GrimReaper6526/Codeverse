import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RepoSyncService } from './repo-sync.service';
import { RepoAnalyzerService } from './repo-analyzer.service';
import { FileIndexingService } from './file-indexing.service';
import { DocIndexingService } from './doc-indexing.service';

export type JobType = 'SYNC' | 'ANALYZE' | 'INDEX_FILES' | 'INDEX_DOCS';
export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface BackgroundJob {
  id: string;
  repoId: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  // In-memory queue store (fallback for Redis when offline)
  private readonly jobsMap = new Map<string, BackgroundJob>();

  constructor(
    private readonly repoSyncService: RepoSyncService,
    private readonly repoAnalyzerService: RepoAnalyzerService,
    private readonly fileIndexingService: FileIndexingService,
    private readonly docIndexingService: DocIndexingService,
  ) {}

  async enqueueJob(repoId: string, type: JobType): Promise<BackgroundJob> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const job: BackgroundJob = {
      id: jobId,
      repoId,
      type,
      status: 'PENDING',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.jobsMap.set(jobId, job);
    this.logger.log(`Enqueued background job ${jobId} (Type: ${type}) for repo ${repoId}`);

    // Process job asynchronously in background
    setImmediate(() => this.processJob(jobId));

    return job;
  }

  async getJob(jobId: string): Promise<BackgroundJob> {
    const job = this.jobsMap.get(jobId);
    if (!job) {
      throw new NotFoundException(`Job with ID '${jobId}' not found`);
    }
    return job;
  }

  async getRepoJobs(repoId: string): Promise<BackgroundJob[]> {
    const jobs: BackgroundJob[] = [];
    for (const job of this.jobsMap.values()) {
      if (job.repoId === repoId) {
        jobs.push(job);
      }
    }
    return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  private async processJob(jobId: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    job.progress = 25;
    job.updatedAt = new Date();

    try {
      let result: any;
      switch (job.type) {
        case 'SYNC':
          job.progress = 50;
          result = await this.repoSyncService.syncRepository(job.repoId);
          break;

        case 'ANALYZE':
          job.progress = 50;
          result = await this.repoAnalyzerService.analyzeRepository(job.repoId);
          break;

        case 'INDEX_FILES':
          job.progress = 50;
          result = await this.fileIndexingService.indexRepositoryFiles(job.repoId);
          break;

        case 'INDEX_DOCS':
          job.progress = 50;
          result = await this.docIndexingService.indexRepositoryDocs(job.repoId);
          break;
      }

      job.status = 'COMPLETED';
      job.progress = 100;
      job.result = result;
      job.updatedAt = new Date();
      this.logger.log(`Job ${jobId} completed successfully`);
    } catch (err) {
      job.status = 'FAILED';
      job.progress = 100;
      job.error = (err as Error).message;
      job.updatedAt = new Date();
      this.logger.error(`Job ${jobId} failed: ${job.error}`);
    }
  }
}
