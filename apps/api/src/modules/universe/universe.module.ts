import { Module } from '@nestjs/common';
import { UniverseController } from './universe.controller';
import { UniverseService } from './universe.service';
import { DependencyAnalyzerService } from './dependency-analyzer.service';
import { UniverseGeneratorService } from './universe-generator.service';

@Module({
  controllers: [UniverseController],
  providers: [UniverseService, DependencyAnalyzerService, UniverseGeneratorService],
  exports: [UniverseService, DependencyAnalyzerService, UniverseGeneratorService],
})
export class UniverseModule {}
