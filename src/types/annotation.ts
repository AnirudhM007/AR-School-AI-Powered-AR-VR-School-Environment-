import { Vec3 } from '@/lib/types';

export interface AnnotationRecord {
  id: string;
  name: string;
  description: string;
  position: Vec3;
}

export interface AnnotationFile {
  annotations: AnnotationRecord[];
}

export interface ProjectedAnnotation extends AnnotationRecord {
  align: 'left' | 'right';
  isVisible: boolean;
  labelX: number;
  labelY: number;
  screenX: number;
  screenY: number;
  worldPosition: Vec3;
}
