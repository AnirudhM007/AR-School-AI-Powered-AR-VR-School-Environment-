'use client';

import { memo, useMemo } from 'react';
import ModelLabel from '@/components/ModelLabel';
import LeaderLine from '@/components/LeaderLine';
import { ProjectedAnnotation } from '@/types/annotation';

interface LabelOverlayProps {
  annotations: ProjectedAnnotation[];
  selectedId?: string | null;
  visible: boolean;
  onSelect: (annotation: ProjectedAnnotation) => void;
}

function distributeLabels(annotations: ProjectedAnnotation[]) {
  const visible = annotations.filter((annotation) => annotation.isVisible);
  const left = visible
    .filter((annotation) => annotation.align === 'left')
    .sort((a, b) => a.screenY - b.screenY);
  const right = visible
    .filter((annotation) => annotation.align === 'right')
    .sort((a, b) => a.screenY - b.screenY);

  const applyColumnLayout = (
    column: ProjectedAnnotation[],
    align: 'left' | 'right',
  ): ProjectedAnnotation[] => {
    const startY = 150;
    const spacing = 112;

    return column.map((annotation, index) => {
      const baseX = align === 'left' ? 88 : window.innerWidth - 88;
      const preferredY = annotation.screenY;
      const columnY = startY + index * spacing;
      const labelY = Math.max(118, Math.min(window.innerHeight - 158, (preferredY + columnY) / 2));

      return {
        ...annotation,
        labelX: baseX,
        labelY,
      };
    });
  };

  return [...applyColumnLayout(left, 'left'), ...applyColumnLayout(right, 'right')];
}

function LabelOverlayComponent({
  annotations,
  selectedId,
  visible,
  onSelect,
}: LabelOverlayProps) {
  const layout = useMemo(() => {
    if (!visible || typeof window === 'undefined') return [];
    return distributeLabels(annotations);
  }, [annotations, visible]);

  if (!visible || layout.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        {layout.map((annotation) => (
          <LeaderLine
            key={annotation.id}
            active={selectedId === annotation.id}
            startX={annotation.screenX}
            startY={annotation.screenY}
            endX={annotation.labelX}
            endY={annotation.labelY}
          />
        ))}
      </svg>

      {layout.map((annotation) => (
        <ModelLabel
          key={annotation.id}
          annotation={annotation}
          selected={selectedId === annotation.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

const LabelOverlay = memo(LabelOverlayComponent);

export default LabelOverlay;
