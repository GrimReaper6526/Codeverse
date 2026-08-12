import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  private getOctokit(accessToken?: string): Octokit {
    const token = accessToken || this.configService.get<string>('GITHUB_TOKEN');
    return new Octokit({
      auth: token,
    });
  }

  constructor(private readonly configService: ConfigService) {}

  async getUserRepositories(accessToken?: string) {
    const octokit = this.getOctokit(accessToken);
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 50,
    });
    return data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      htmlUrl: repo.html_url,
      cloneUrl: repo.clone_url,
      description: repo.description,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
      language: repo.language,
    }));
  }

  async getRepositoryTree(owner: string, repo: string, branch = 'main', accessToken?: string) {
    const octokit = this.getOctokit(accessToken);
    try {
      const { data } = await octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch,
        recursive: 'true',
      });
      return data.tree.map((item) => ({
        path: item.path,
        type: item.type === 'tree' ? 'directory' : 'file',
        sha: item.sha,
        size: item.size,
      }));
    } catch (error) {
      this.logger.error(`Failed to fetch GitHub tree for ${owner}/${repo}: ${error}`);
      throw error;
    }
  }

  async getBranches(owner: string, repo: string, accessToken?: string) {
    const octokit = this.getOctokit(accessToken);
    const { data } = await octokit.rest.repos.listBranches({
      owner,
      repo,
    });
    return data.map((branch) => ({
      name: branch.name,
      commitSha: branch.commit.sha,
    }));
  }

  async getCommits(owner: string, repo: string, branch = 'main', accessToken?: string) {
    const octokit = this.getOctokit(accessToken);
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: branch,
      per_page: 20,
    });
    return data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author?.name,
      date: commit.commit.author?.date,
    }));
  }
}
