export type TelemetryEventType =
  | 'http_request'
  | 'db_query'
  | 'cache_hit'
  | 'cache_miss'
  | 'event_stream'
  | 'error'
  | 'background_job';

export type ProtocolType = 'REST' | 'GraphQL' | 'gRPC' | 'WebSocket' | 'Kafka' | 'SQL' | 'Redis';

export type WeatherType =
  'clear_sky' | 'solar_wind' | 'meteor_shower' | 'electrical_storm' | 'nebula_fog' | 'aurora';

export interface TelemetryEvent {
  id: string;
  type: TelemetryEventType;
  protocol: ProtocolType;
  sourceId: string;
  targetId: string;
  durationMs: number;
  statusCode: number;
  timestamp: number;
  payloadBytes: number;
  endpoint: string;
}

export interface ActiveParticle {
  id: string;
  eventId: string;
  sourcePos: [number, number, number];
  targetPos: [number, number, number];
  progress: number;
  speed: number;
  color: string;
  size: number;
  type: TelemetryEventType;
}

export interface RuntimeMetrics {
  throughput: number; // req/sec
  avgLatency: number; // ms
  errorRate: number; // %
  activeParticlesCount: number;
  totalEventsProcessed: number;
}

export interface SimulationState {
  isPlaying: boolean;
  speed: number; // 1, 2, 5, 10
  weather: WeatherType;
  eventFilter: string; // 'ALL' | 'HTTP' | 'DB' | 'CACHE' | 'KAFKA' | 'ERROR'
}
