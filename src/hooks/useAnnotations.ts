'use client';

import { useEffect, useMemo, useState } from 'react';
import { TopicAnnotation } from '@/lib/types';
import { AnnotationFile, AnnotationRecord } from '@/types/annotation';

function normalizeAnnotation(annotation: AnnotationRecord): TopicAnnotation {
  return {
    id: annotation.id,
    label: annotation.name,
    description: annotation.description,
    position: annotation.position,
    questionPrompt: `Explain ${annotation.name} in a simple way.`,
    meshKeywords: [annotation.name.toLowerCase()],
  };
}

export function useAnnotations(topicId: string, fallbackAnnotations: TopicAnnotation[] = []) {
  const [annotations, setAnnotations] = useState<TopicAnnotation[]>(fallbackAnnotations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAnnotations = async () => {
      if (!topicId) return;

      setLoading(true);

      try {
        const response = await fetch(`/annotations/${topicId}.annotations.json`, {
          cache: 'force-cache',
        });

        if (!response.ok) {
          throw new Error('Annotation file not found');
        }

        const data = (await response.json()) as AnnotationFile;
        if (!cancelled && Array.isArray(data.annotations)) {
          setAnnotations(data.annotations.map(normalizeAnnotation));
        }
      } catch {
        if (!cancelled) {
          setAnnotations(fallbackAnnotations);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAnnotations();

    return () => {
      cancelled = true;
    };
  }, [fallbackAnnotations, topicId]);

  return useMemo(
    () => ({
      annotations,
      loading,
    }),
    [annotations, loading],
  );
}
