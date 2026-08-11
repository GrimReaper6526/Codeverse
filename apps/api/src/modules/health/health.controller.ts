import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API service health status' })
  checkHealth() {
    return {
      status: 'ok',
      service: 'codeverse-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
