import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReposService } from './repos.service';
import { ImportRepoDto } from './dto/import-repo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Repositories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Post('import')
  @ApiOperation({ summary: 'Import and register a new Git repository' })
  async importRepository(@Body() dto: ImportRepoDto) {
    return this.reposService.importRepository(dto);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'List all imported repositories for a project' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.reposService.findByProject(projectId);
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
