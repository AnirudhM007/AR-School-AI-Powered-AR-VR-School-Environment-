'use client';

import { memo } from 'react';

interface LeaderLineProps {
  active?: boolean;
  endX: number;
  endY: number;
  startX: number;
  startY: number;
}

function LeaderLineComponent({ active = false, endX, endY, startX, startY }: LeaderLineProps) {
  return (
    <line
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke={active ? 'rgba(116, 230, 255, 0.95)' : 'rgba(255, 255, 255, 0.72)'}
      strokeLinecap="round"
      strokeWidth={active ? 2.5 : 1.7}
    />
  );
}

const LeaderLine = memo(LeaderLineComponent);

export default LeaderLine;
