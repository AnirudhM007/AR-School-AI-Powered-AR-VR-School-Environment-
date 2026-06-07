'use client';

import { memo } from 'react';
import clsx from 'clsx';
import { ProjectedAnnotation } from '@/types/annotation';

interface ModelLabelProps {
  annotation: ProjectedAnnotation;
  selected: boolean;
  onSelect: (annotation: ProjectedAnnotation) => void;
}

function ModelLabelComponent({ annotation, selected, onSelect }: ModelLabelProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(annotation)}
      className={clsx(
        'pointer-events-auto absolute w-[132px] rounded-[18px] border px-3 py-2 text-left transition',
        selected
          ? 'border-brand-cyan/60 bg-[rgba(24,31,52,0.82)] shadow-[0_0_32px_rgba(116,230,255,0.22)]'
          : 'border-white/24 bg-[rgba(18,22,39,0.76)] shadow-[0_14px_30px_rgba(0,0,0,0.24)]',
      )}
      style={{
        left: annotation.labelX,
        top: annotation.labelY,
        transform: 'translate(-50%, -50%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <p className="text-[15px] font-semibold leading-tight text-white">{annotation.name}</p>
      <p className="mt-1 line-clamp-3 text-[12px] leading-4 text-white/74">
        {annotation.description}
      </p>
    </button>
  );
}

const ModelLabel = memo(ModelLabelComponent);

export default ModelLabel;
