import {
  TelemetryEvent,
  TelemetryEventType,
  ProtocolType,
  ActiveParticle,
  RuntimeMetrics,
  SimulationState,
} from './RuntimeTypes';
import { globalAnimationController } from '../animation/AnimationController';

type TelemetryListener = (
  events: TelemetryEvent[],
  particles: ActiveParticle[],
  metrics: RuntimeMetrics,
  state: SimulationState,
) => void;

export class RuntimeTelemetryEngine {
  private events: TelemetryEvent[] = [];
  private activeParticles: ActiveParticle[] = [];
  private listeners: Set<TelemetryListener> = new Set();

  private state: SimulationState = {
    isPlaying: true,
    speed: 1,
    weather: 'clear_sky',
    eventFilter: 'ALL',
  };

  private metrics: RuntimeMetrics = {
    throughput: 42,
    avgLatency: 28,
    errorRate: 0.8,
    activeParticlesCount: 0,
    totalEventsProcessed: 1248,
  };

  private sampleNodes: { id: string; pos: [number, number, number] }[] = [];
  private lastGenTime: number = Date.now();

  public setNodes(nodes: { id: string; pos: [number, number, number] }[]): void {
    this.sampleNodes = nodes;
  }

  public getState(): SimulationState {
    return { ...this.state };
  }

  public getMetrics(): RuntimeMetrics {
    return { ...this.metrics };
  }

  public setSimulationState(partial: Partial<SimulationState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  public addListener(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    listener(this.events, this.activeParticles, this.metrics, this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public pushEvent(
    event: TelemetryEvent,
    sourcePos?: [number, number, number],
    targetPos?: [number, number, number],
  ): void {
    this.events.unshift(event);
    if (this.events.length > 100) {
      this.events.pop();
    }

    this.metrics.totalEventsProcessed += 1;

    // Trigger pulse on target node
    globalAnimationController.triggerPulse(event.targetId, event.statusCode >= 400 ? 1.5 : 0.8);

    // Spawn 3D particle along wormhole edge if positions exist
    if (sourcePos && targetPos) {
      const color = this.getParticleColor(event.type, event.statusCode);
      const particle: ActiveParticle = {
        id: `p_${Math.random().toString(36).substring(2, 9)}`,
        eventId: event.id,
        sourcePos: [...sourcePos],
        targetPos: [...targetPos],
        progress: 0,
        speed: (0.4 + Math.random() * 0.4) * this.state.speed,
        color,
        size: event.type === 'error' ? 0.35 : 0.2,
        type: event.type,
      };
      this.activeParticles.push(particle);
    }

    this.notify();
  }

  private getParticleColor(type: TelemetryEventType, statusCode: number): string {
    if (statusCode >= 400 || type === 'error') return '#ef4444'; // Red error
    switch (type) {
      case 'http_request':
        return '#10b981'; // Emerald Green
      case 'db_query':
        return '#3b82f6'; // Sapphire Blue
      case 'cache_hit':
        return '#06b6d4'; // Cyan
      case 'cache_miss':
        return '#f59e0b'; // Amber
      case 'event_stream':
        return '#8b5cf6'; // Purple Kafka
      case 'background_job':
        return '#ec4899'; // Pink
      default:
        return '#6366f1'; // Indigo
    }
  }

  public update(delta: number): void {
    if (!this.state.isPlaying) return;

    const scaledDelta = delta * this.state.speed;

    // Update particles progress
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.progress += p.speed * scaledDelta;

      if (p.progress >= 1.0) {
        this.activeParticles.splice(i, 1);
      }
    }

    // Auto-generate realistic demo telemetry if sample nodes are loaded
    const now = Date.now();
    if (now - this.lastGenTime > 400 / this.state.speed && this.sampleNodes.length >= 2) {
      this.lastGenTime = now;
      this.generateSyntheticTelemetryEvent();
    }

    this.metrics.activeParticlesCount = this.activeParticles.length;
    this.notify();
  }

  private generateSyntheticTelemetryEvent(): void {
    const srcIndex = Math.floor(Math.random() * this.sampleNodes.length);
    let tgtIndex = Math.floor(Math.random() * this.sampleNodes.length);
    if (tgtIndex === srcIndex) tgtIndex = (srcIndex + 1) % this.sampleNodes.length;

    const src = this.sampleNodes[srcIndex];
    const tgt = this.sampleNodes[tgtIndex];

    const types: { type: TelemetryEventType; protocol: ProtocolType; endpoint: string }[] = [
      { type: 'http_request', protocol: 'REST', endpoint: '/api/v1/auth/login' },
      { type: 'http_request', protocol: 'GraphQL', endpoint: 'query { universeGraph }' },
      { type: 'db_query', protocol: 'SQL', endpoint: 'SELECT * FROM users WHERE id=$1' },
      { type: 'cache_hit', protocol: 'Redis', endpoint: 'GET session:usr_9981' },
      { type: 'cache_miss', protocol: 'Redis', endpoint: 'GET cache:node_meta:23' },
      { type: 'event_stream', protocol: 'Kafka', endpoint: 'topic.universe.events' },
      { type: 'background_job', protocol: 'gRPC', endpoint: 'Universe.ComputeLayout' },
    ];

    const template = types[Math.floor(Math.random() * types.length)];
    const isError = Math.random() < 0.05;
    const statusCode = isError ? (Math.random() > 0.5 ? 500 : 504) : 200;

    const event: TelemetryEvent = {
      id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: isError ? 'error' : template.type,
      protocol: template.protocol,
      sourceId: src.id,
      targetId: tgt.id,
      durationMs: Math.floor(12 + Math.random() * 85),
      statusCode,
      timestamp: Date.now(),
      payloadBytes: Math.floor(128 + Math.random() * 4096),
      endpoint: template.endpoint,
    };

    this.pushEvent(event, src.pos, tgt.pos);
  }

  private notify(): void {
    const filteredEvents = this.getFilteredEvents();
    this.listeners.forEach((fn) =>
      fn(filteredEvents, this.activeParticles, this.metrics, this.state),
    );
  }

  public getFilteredEvents(): TelemetryEvent[] {
    if (this.state.eventFilter === 'ALL') return this.events;
    return this.events.filter((evt) => {
      if (this.state.eventFilter === 'HTTP') return evt.type === 'http_request';
      if (this.state.eventFilter === 'DB') return evt.type === 'db_query';
      if (this.state.eventFilter === 'CACHE')
        return evt.type === 'cache_hit' || evt.type === 'cache_miss';
      if (this.state.eventFilter === 'KAFKA') return evt.type === 'event_stream';
      if (this.state.eventFilter === 'ERROR') return evt.statusCode >= 400 || evt.type === 'error';
      return true;
    });
  }
}

export const globalRuntimeEngine = new RuntimeTelemetryEngine();
