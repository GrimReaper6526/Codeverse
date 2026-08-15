import { Injectable, Logger } from '@nestjs/common';
import { createSampleUniverseGraph, UniverseGenerator } from '@codeverse/universe-sdk';

@Injectable()
export class UniverseGeneratorService {
  private readonly logger = new Logger(UniverseGeneratorService.name);

  async generateCelestialUniverse(repoId?: string) {
    this.logger.log(`Generating celestial universe scene for repo: ${repoId || 'default'}`);
    const sampleGraph = createSampleUniverseGraph();

    const universe = UniverseGenerator.generateCelestialUniverse(
      sampleGraph,
      `CodeVerse Universe — ${repoId || 'Main'}`,
    );

    return {
      success: true,
      universe,
    };
  }
}
