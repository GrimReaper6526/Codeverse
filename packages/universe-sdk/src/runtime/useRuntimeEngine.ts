import { useState, useEffect } from 'react';
import { globalRuntimeEngine } from './RuntimeTelemetryEngine';
import { TelemetryEvent, ActiveParticle, RuntimeMetrics, SimulationState } from './RuntimeTypes';

export function useRuntimeEngine() {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [particles, setParticles] = useState<ActiveParticle[]>([]);
  const [metrics, setMetrics] = useState<RuntimeMetrics>(globalRuntimeEngine.getMetrics());
  const [state, setState] = useState<SimulationState>(globalRuntimeEngine.getState());

  useEffect(() => {
    const unsubscribe = globalRuntimeEngine.addListener((newEvents, newParticles, newMetrics, newState) => {
      setEvents([...newEvents]);
      setParticles([...newParticles]);
      setMetrics({ ...newMetrics });
      setState({ ...newState });
    });

    return unsubscribe;
  }, []);

  return {
    events,
    particles,
    metrics,
    simulationState: state,
    setSimulationState: (partial: Partial<SimulationState>) => globalRuntimeEngine.setSimulationState(partial),
    pushEvent: (evt: TelemetryEvent, srcPos?: [number, number, number], tgtPos?: [number, number, number]) =>
      globalRuntimeEngine.pushEvent(evt, srcPos, tgtPos),
    setNodes: (nodes: { id: string; pos: [number, number, number] }[]) => globalRuntimeEngine.setNodes(nodes),
  };
}
