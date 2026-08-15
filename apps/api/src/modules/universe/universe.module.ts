import { Module } from '@nestjs/common';
import { UniverseController } from './universe.controller';
import { UniverseService } from './universe.service';
import { DependencyAnalyzerService } from './dependency-analyzer.service';

@Module({
  controllers: [UniverseController],
  providers: [UniverseService, DependencyAnalyzerService],
  exports: [UniverseService, DependencyAnalyzerService],
})
export class UniverseModule {}
