import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  @Get()
  @ApiOperation({ summary: 'List user repositories & projects' })
  findAll() {
    return [
      {
        id: 'proj-1',
        name: 'Codeverse Monorepo',
        repositoryUrl: 'https://github.com/GrimReaper6526/Codeverse',
        modulesCount: 12,
        symbolsCount: 313,
        status: 'synced',
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  @Post()
  @ApiOperation({ summary: 'Create or import new repository project' })
  create(@Body() body: any) {
    return {
      id: `proj-${Date.now()}`,
      name: body.name || 'New Project',
      repositoryUrl: body.repositoryUrl,
      status: 'indexing',
      createdAt: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of specific project by ID' })
  findOne(@Param('id') id: string) {
    return {
      id,
      name: 'Codeverse Monorepo',
      repositoryUrl: 'https://github.com/GrimReaper6526/Codeverse',
      status: 'synced',
    };
  }
}
