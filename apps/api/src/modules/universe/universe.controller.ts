import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Universe Engine')
@Controller('universe')
export class UniverseController {
  @Get(':repositoryId')
  @ApiOperation({ summary: 'Get 3D universe graph AST structure' })
  getGraph(@Param('repositoryId') repositoryId: string) {
    return {
      repositoryId,
      nodes: [
        { id: 'app-web', name: 'apps/web', type: 'module', symbolCount: 42 },
        { id: 'app-api', name: 'apps/api', type: 'service', symbolCount: 68 },
        { id: 'pkg-universe', name: 'packages/universe-sdk', type: 'module', symbolCount: 104 },
        { id: 'pkg-ai', name: 'packages/ai-sdk', type: 'service', symbolCount: 56 },
      ],
      edges: [
        { id: 'e1', source: 'app-web', target: 'pkg-universe', strength: 0.9 },
        { id: 'e2', source: 'app-web', target: 'pkg-ai', strength: 0.8 },
        { id: 'e3', source: 'app-api', target: 'pkg-ai', strength: 0.95 },
      ],
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Re-analyze repository AST and rebuild 3D graph layout' })
  refreshGraph(@Body() _body: any) {
    return {
      status: 'graph_rebuilding',
      jobId: `job-${Date.now()}`,
    };
  }
}
