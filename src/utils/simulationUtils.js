// Utility math and position calculation functions for node topologies

/**
 * Calculate positions for nodes arranged in a circular ring
 */
export function calculateRingPositions(nodeCount, width = 500, height = 340, radiusMargin = 60) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - radiusMargin;
  
  const positions = [];
  for (let i = 0; i < nodeCount; i++) {
    // Angle starts from top (-90 deg = -PI/2) and goes clockwise
    const angle = (i * 2 * Math.PI) / nodeCount - Math.PI / 2;
    positions.push({
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle))
    });
  }
  return positions;
}

/**
 * Calculate positions for nodes arranged horizontally in parallel columns
 */
export function calculateLinearPositions(nodeCount, width = 600, height = 340, padding = 70) {
  const usableWidth = width - 2 * padding;
  const step = nodeCount > 1 ? usableWidth / (nodeCount - 1) : 0;
  const centerY = height / 2;

  const positions = [];
  for (let i = 0; i < nodeCount; i++) {
    positions.push({
      x: Math.round(padding + i * step),
      y: Math.round(centerY)
    });
  }
  return positions;
}

/**
 * Calculate positions for a 2-column or grid layout
 */
export function calculateGridPositions(nodeCount, width = 600, height = 340) {
  const cols = Math.ceil(Math.sqrt(nodeCount));
  const rows = Math.ceil(nodeCount / cols);
  
  const stepX = width / (cols + 1);
  const stepY = height / (rows + 1);

  const positions = [];
  for (let i = 0; i < nodeCount; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      x: Math.round(stepX * (col + 1)),
      y: Math.round(stepY * (row + 1))
    });
  }
  return positions;
}

/**
 * Compare two Vector Clock vectors V1 and V2
 * Returns 'BEFORE', 'AFTER', 'CONCURRENT', or 'EQUAL'
 */
export function compareVectorClocks(v1 = [], v2 = []) {
  if (!v1 || !v2 || v1.length !== v2.length) return 'CONCURRENT';
  
  let lessOrEqual = true;
  let greaterOrEqual = true;
  let strictlyLess = false;
  let strictlyGreater = false;

  for (let i = 0; i < v1.length; i++) {
    if (v1[i] > v2[i]) lessOrEqual = false;
    if (v1[i] < v2[i]) greaterOrEqual = false;
    if (v1[i] < v2[i]) strictlyLess = true;
    if (v1[i] > v2[i]) strictlyGreater = true;
  }

  if (v1.every((val, idx) => val === v2[idx])) return 'EQUAL';
  if (lessOrEqual && strictlyLess) return 'BEFORE';
  if (greaterOrEqual && strictlyGreater) return 'AFTER';
  return 'CONCURRENT';
}
