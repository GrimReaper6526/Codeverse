import { CameraMathUtils } from './CameraMathUtils';
import { NodeSpatialData } from './CameraEngineTypes';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function runCameraMathUtilsTests() {
  const sampleNodes: NodeSpatialData[] = [
    { id: 'node-1', name: 'Root Star', position: [0, 0, 0], size: 4 },
    { id: 'node-2', name: 'Planet A', position: [20, 10, -5], size: 2 },
    { id: 'node-3', name: 'Moon B', position: [-15, -10, 30], size: 1 },
  ];

  // Test 1: Bounds
  const bounds = CameraMathUtils.calculateGalaxyBounds(sampleNodes);
  assert(bounds.center !== undefined, 'Center should be defined');
  assert(bounds.center.length === 3, 'Center should have 3 coordinates');
  assert(bounds.radius > 10, 'Radius should be greater than 10');

  // Test 2: Overview
  const overview = CameraMathUtils.calculateOverviewPose(sampleNodes, 55);
  assert(overview.position[1] > 0, 'Overview camera altitude should be positive');
  assert(
    overview.target[0] === bounds.center[0] &&
      overview.target[1] === bounds.center[1] &&
      overview.target[2] === bounds.center[2],
    'Overview target should match galaxy center',
  );

  // Test 3: Focus
  const targetNode = sampleNodes[1];
  const focusPose = CameraMathUtils.calculateNodeFocusPose(
    targetNode,
    [0, 20, 50],
    55,
  );
  assert(
    focusPose.target[0] === targetNode.position[0] &&
      focusPose.target[1] === targetNode.position[1] &&
      focusPose.target[2] === targetNode.position[2],
    'Focus pose target should equal node position',
  );

  // Test 4: Top Down
  const topDown = CameraMathUtils.calculateTopDownPose(sampleNodes);
  assert(
    topDown.position[1] > bounds.center[1],
    'Top down camera should be above center',
  );
}
