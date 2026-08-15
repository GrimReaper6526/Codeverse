import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UniverseService } from './universe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Universe Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('universe')
export class UniverseController {
  constructor(private readonly universeService: UniverseService) {}

  @Get('graph')
  @ApiOperation({ summary: 'Fetch full 3D universe graph layout and node clusters' })
  @ApiQuery({ name: 'repoId', required: false, type: String })
  async getUniverseGraph(@Query('repoId') repoId?: string) {
    return this.universeService.getUniverseGraph(repoId);
  }

  @Get('graph/filter')
  @ApiOperation({ summary: 'Filter 3D universe graph nodes by type or search query' })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'minSymbols', required: false, type: Number })
  async filterUniverseGraph(
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('minSymbols') minSymbols?: number,
  ) {
    return this.universeService.filterUniverseGraph({
      type,
      searchQuery: search,
      minSymbols: minSymbols ? Number(minSymbols) : undefined,
    });
  }

  @Get('path/:sourceId/:targetId')
  @ApiOperation({ summary: 'Calculate shortest dependency path between two universe graph nodes' })
  async getShortestPath(
    @Param('sourceId') sourceId: string,
    @Param('targetId') targetId: string,
  ) {
    return this.universeService.getShortestPath(sourceId, targetId);
  }
}
