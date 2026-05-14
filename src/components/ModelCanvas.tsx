'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useThree } from '@react-three/fiber';
import { Center, ContactShadows, Environment, Float, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Group, Object3D } from 'three';
import { useModelRotation } from '@/hooks/useModelRotation';
import { TopicAnnotation, Vec3 } from '@/lib/types';

function matchAnnotation(meshName: string, annotations: TopicAnnotation[]) {
  const normalizedName = meshName.toLowerCase();
  return annotations.find((annotation) =>
    annotation.meshKeywords?.some((keyword) => normalizedName.includes(keyword.toLowerCase())),
  );
}

function HotspotBadge({
  annotation,
  selected,
  onSelect,
}: {
  annotation: TopicAnnotation;
  selected: boolean;
  onSelect: (annotation: TopicAnnotation) => void;
}) {
  return (
    <Html position={annotation.position} center distanceFactor={8}>
      <div className="pointer-events-auto">
        <button
          type="button"
          onClick={() => onSelect(annotation)}
          className="group flex flex-col items-center gap-2"
        >
          <span className={`relative flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition ${
            selected
              ? 'border-white/60 bg-white text-brand-bg shadow-[0_0_24px_rgba(255,255,255,0.35)]'
              : 'border-white/30 bg-brand-purple/65 text-white backdrop-blur-xl'
          }`}>
            i
            <span className="absolute inset-0 rounded-full animate-ping bg-white/20" />
          </span>
          {selected && (
            <span className="glass-strong min-w-[180px] max-w-[220px] rounded-2xl px-3 py-2 text-left shadow-glass">
              <span className="block text-xs font-semibold text-white">{annotation.label}</span>
              <span className="mt-1 block text-[11px] leading-4 text-white/65">{annotation.description}</span>
            </span>
          )}
        </button>
      </div>
    </Html>
  );
}

function GLTFModel({
  url,
  annotations,
  showHotspots,
  selectedAnnotationId,
  onSelectAnnotation,
  modelScale = 1,
  xrSession,
}: {
  url: string;
  annotations: TopicAnnotation[];
  showHotspots: boolean;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (annotation: TopicAnnotation) => void;
  modelScale?: number;
  xrSession?: XRSession | null;
}) {
  const { scene } = useGLTF(url);
  const object = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    object.traverse((child: Object3D) => {
      if ('castShadow' in child) {
        child.castShadow = true;
      }
      if ('receiveShadow' in child) {
        child.receiveShadow = true;
      }
    });
  }, [object]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!showHotspots || !onSelectAnnotation) return;
    const meshName = event.object?.name ?? '';
    const matched = matchAnnotation(meshName, annotations);
    if (matched) {
      event.stopPropagation();
      onSelectAnnotation(matched);
    }
  };

  return (
    <group onPointerDown={handlePointerDown}>
      <Center>
        <primitive object={object} scale={1.25 * modelScale} />
        {showHotspots && !xrSession
          ? annotations.map((annotation) => (
              <HotspotBadge
                key={annotation.id}
                annotation={annotation}
                selected={selectedAnnotationId === annotation.id}
                onSelect={(item) => onSelectAnnotation?.(item)}
              />
            ))
          : null}
      </Center>
    </group>
  );
}

function AutoRotate({
  children,
  speed = 0.004,
  active,
}: {
  children: React.ReactNode;
  speed?: number;
  active: boolean;
}) {
  const { ref } = useModelRotation(active ? speed : 0);
  return <group ref={ref}>{children}</group>;
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="glass-strong flex flex-col items-center gap-3 rounded-[24px] px-5 py-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        <span className="text-sm text-white/65">Loading model...</span>
      </div>
    </Html>
  );
}

function XRBridge({ session }: { session?: XRSession | null }) {
  const { gl } = useThree();

  useEffect(() => {
    if (session) {
      gl.xr.enabled = true;
      gl.xr.setSession(session);
    } else {
      gl.xr.enabled = false;
    }
  }, [gl, session]);

  return null;
}

interface ModelCanvasProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  xrSession?: XRSession | null;
  transformPosition?: Vec3;
  transformRotation?: Vec3;
  transformScale?: number;
  modelScale?: number;
  annotations?: TopicAnnotation[];
  showHotspots?: boolean;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (annotation: TopicAnnotation) => void;
  placeholder?: string;
}

export default function ModelCanvas({
  modelUrl,
  className,
  autoRotate = true,
  xrSession,
  transformPosition = [0, 0, 0],
  transformRotation = [0, 0, 0],
  transformScale = 1,
  modelScale = 1,
  annotations = [],
  showHotspots = false,
  selectedAnnotationId,
  onSelectAnnotation,
  placeholder,
}: ModelCanvasProps) {
  const [rotating, setRotating] = useState(autoRotate);

  useEffect(() => {
    setRotating(autoRotate);
  }, [autoRotate]);

  const basePosition: Vec3 = xrSession ? [0, 0, -1.5] : [0, -0.12, 0];
  const finalPosition: Vec3 = [
    basePosition[0] + transformPosition[0],
    basePosition[1] + transformPosition[1],
    basePosition[2] + transformPosition[2],
  ];

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      {!xrSession && placeholder ? (
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute h-[22rem] w-[22rem] rounded-full border border-white/10" />
          <div className="absolute h-[16rem] w-[16rem] rounded-full border border-white/10" />
          <div className="relative text-[7rem] opacity-30 drop-shadow-[0_20px_45px_rgba(0,0,0,0.32)]">
            {placeholder}
          </div>
        </div>
      ) : null}

      <Canvas camera={{ position: [0, 0, 4], fov: 42 }} gl={{ antialias: true, alpha: true }} className="r3f-canvas">
        <XRBridge session={xrSession} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <pointLight position={[-4, 3, -4]} intensity={1.1} color="#8c6cff" />
        <pointLight position={[4, -3, 4]} intensity={0.7} color="#74e6ff" />

        <Suspense fallback={<LoadingFallback />}>
          <AutoRotate active={rotating && !xrSession}>
            <group position={finalPosition} rotation={transformRotation} scale={[transformScale, transformScale, transformScale]}>
              <Float speed={xrSession ? 0 : 1.4} rotationIntensity={xrSession ? 0 : 0.06} floatIntensity={xrSession ? 0 : 0.2}>
                <GLTFModel
                  url={modelUrl}
                  annotations={annotations}
                  showHotspots={showHotspots}
                  selectedAnnotationId={selectedAnnotationId}
                  onSelectAnnotation={onSelectAnnotation}
                  modelScale={modelScale}
                  xrSession={xrSession}
                />
              </Float>
            </group>
          </AutoRotate>
          <Environment preset="city" />
          {!xrSession && (
            <ContactShadows position={[0, -1.7, 0]} opacity={0.5} scale={5} blur={2.4} far={5} />
          )}
        </Suspense>

        {!xrSession && (
          <OrbitControls enablePan={false} minDistance={2.6} maxDistance={8} enableDamping dampingFactor={0.08} makeDefault />
        )}
      </Canvas>

      {!xrSession && (
        <motion.button
          onClick={() => setRotating((value) => !value)}
          className={`absolute bottom-4 right-4 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
            rotating ? 'glass-purple text-brand-accent' : 'glass text-white/55'
          }`}
          whileTap={{ scale: 0.94 }}
        >
          {rotating ? 'Auto Rotate On' : 'Auto Rotate Off'}
        </motion.button>
      )}
    </div>
  );
}
