'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Center, ContactShadows, Environment, Float, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { DoubleSide, Group, Matrix4, Object3D, Vector3 } from 'three';
import { useModelRotation } from '@/hooks/useModelRotation';
import { TopicAnnotation, Vec3 } from '@/lib/types';

type XRTransientSource = XRTransientInputHitTestSource;

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
      gl.xr.setReferenceSpaceType('local-floor');
      gl.xr.setSession(session);
    } else {
      gl.xr.enabled = false;
    }
  }, [gl, session]);

  return null;
}

function XRHitTestController({
  active,
  onPlace,
  onTrackingChange,
  onReticlePositionChange,
}: {
  active: boolean;
  onPlace?: (position: Vec3) => void;
  onTrackingChange?: (ready: boolean) => void;
  onReticlePositionChange?: (position: Vec3 | null) => void;
}) {
  const { gl } = useThree();
  const reticleRef = useRef<Group>(null);
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const transientHitTestSourceRef = useRef<XRTransientSource | null>(null);
  const referenceSpaceRef = useRef<XRReferenceSpace | null>(null);
  const viewerSpaceRef = useRef<XRReferenceSpace | null>(null);
  const matrixRef = useRef(new Matrix4());
  const scaleRef = useRef(new Vector3());
  const readyRef = useRef(false);
  const lastPublishedReticleRef = useRef<Vec3 | null>(null);

  useEffect(() => {
    if (!active) return;

    const session = gl.xr.getSession();
    if (!session) return;

    let cancelled = false;

    const cleanup = () => {
      hitTestSourceRef.current?.cancel();
      transientHitTestSourceRef.current?.cancel?.();
      hitTestSourceRef.current = null;
      transientHitTestSourceRef.current = null;
      viewerSpaceRef.current = null;
      referenceSpaceRef.current = null;

      if (reticleRef.current) {
        reticleRef.current.visible = false;
      }

      if (lastPublishedReticleRef.current) {
        lastPublishedReticleRef.current = null;
        onReticlePositionChange?.(null);
      }

      if (readyRef.current) {
        readyRef.current = false;
        onTrackingChange?.(false);
      }
    };

    const handleSelect = (event: XRInputSourceEvent) => {
      const referenceSpace = referenceSpaceRef.current ?? gl.xr.getReferenceSpace();
      if (!referenceSpace || !onPlace) return;

      let placed = false;
      const transientSource = transientHitTestSourceRef.current;

      if (transientSource) {
        const transientResults = event.frame.getHitTestResultsForTransientInput(transientSource);
        for (const transientResult of transientResults) {
          const hit = transientResult.results[0];
          if (!hit) continue;

          const pose = hit.getPose(referenceSpace);
          if (!pose) continue;

          const { x, y, z } = pose.transform.position;
          onPlace([x, y, z]);
          placed = true;
          break;
        }
      }

      if (!placed && reticleRef.current?.visible) {
        const { x, y, z } = reticleRef.current.position;
        onPlace([x, y, z]);
      }
    };

    const setupHitTest = async () => {
      try {
        if (!session.requestHitTestSource) {
          onTrackingChange?.(false);
          return;
        }

        const viewerSpace = await session.requestReferenceSpace('viewer');
        const referenceSpace = await session
          .requestReferenceSpace('local-floor')
          .catch(() => session.requestReferenceSpace('local'));

        const hitTestRequest = session.requestHitTestSource({ space: viewerSpace });
        if (!hitTestRequest) {
          onTrackingChange?.(false);
          return;
        }

        const hitTestSource = await hitTestRequest;
        const requestTransientHitTest = session.requestHitTestSourceForTransientInput;
        let transientSource: XRTransientSource | null = null;

        if (requestTransientHitTest) {
          try {
            const transientRequest = requestTransientHitTest.call(session, {
              profile: 'generic-touchscreen',
            });
            transientSource = transientRequest ? await transientRequest : null;
          } catch {
            transientSource = null;
          }
        }

        if (cancelled) {
          hitTestSource.cancel();
          transientSource?.cancel?.();
          return;
        }

        viewerSpaceRef.current = viewerSpace;
        referenceSpaceRef.current = referenceSpace;
        hitTestSourceRef.current = hitTestSource;
        transientHitTestSourceRef.current = transientSource;
      } catch {
        onTrackingChange?.(false);
      }
    };

    void setupHitTest();
    session.addEventListener('select', handleSelect);
    session.addEventListener('end', cleanup);

    return () => {
      cancelled = true;
      session.removeEventListener('select', handleSelect);
      session.removeEventListener('end', cleanup);
      cleanup();
    };
  }, [active, gl, onPlace, onReticlePositionChange, onTrackingChange]);

  useFrame((_state, _delta, xrFrame) => {
    if (!active || !xrFrame || !hitTestSourceRef.current || !reticleRef.current) return;

    const referenceSpace = referenceSpaceRef.current ?? gl.xr.getReferenceSpace();
    if (!referenceSpace) return;

    const hitResults = xrFrame.getHitTestResults(hitTestSourceRef.current);
    const hit = hitResults[0];

    if (!hit) {
      reticleRef.current.visible = false;
      if (lastPublishedReticleRef.current) {
        lastPublishedReticleRef.current = null;
        onReticlePositionChange?.(null);
      }
      if (readyRef.current) {
        readyRef.current = false;
        onTrackingChange?.(false);
      }
      return;
    }

    const pose = hit.getPose(referenceSpace);
    if (!pose) return;

    matrixRef.current.fromArray(pose.transform.matrix);
    matrixRef.current.decompose(reticleRef.current.position, reticleRef.current.quaternion, scaleRef.current);
    reticleRef.current.visible = true;

    const nextReticle: Vec3 = [
      reticleRef.current.position.x,
      reticleRef.current.position.y,
      reticleRef.current.position.z,
    ];
    const previousReticle = lastPublishedReticleRef.current;

    if (
      !previousReticle ||
      Math.abs(previousReticle[0] - nextReticle[0]) > 0.015 ||
      Math.abs(previousReticle[1] - nextReticle[1]) > 0.015 ||
      Math.abs(previousReticle[2] - nextReticle[2]) > 0.015
    ) {
      lastPublishedReticleRef.current = nextReticle;
      onReticlePositionChange?.(nextReticle);
    }

    if (!readyRef.current) {
      readyRef.current = true;
      onTrackingChange?.(true);
    }
  });

  return (
    <group ref={reticleRef} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial color="#74e6ff" transparent opacity={0.95} side={DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.02, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} side={DoubleSide} />
      </mesh>
    </group>
  );
}

interface ModelCanvasProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  xrSession?: XRSession | null;
  transformPosition?: Vec3;
  transformRotation?: Vec3;
  transformScale?: number;
  placedPosition?: Vec3 | null;
  modelScale?: number;
  annotations?: TopicAnnotation[];
  showHotspots?: boolean;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (annotation: TopicAnnotation) => void;
  placeholder?: string;
  onPlace?: (position: Vec3) => void;
  onTrackingChange?: (ready: boolean) => void;
  onReticlePositionChange?: (position: Vec3 | null) => void;
}

export default function ModelCanvas({
  modelUrl,
  className,
  autoRotate = true,
  xrSession,
  transformPosition = [0, 0, 0],
  transformRotation = [0, 0, 0],
  transformScale = 1,
  placedPosition = null,
  modelScale = 1,
  annotations = [],
  showHotspots = false,
  selectedAnnotationId,
  onSelectAnnotation,
  placeholder,
  onPlace,
  onTrackingChange,
  onReticlePositionChange,
}: ModelCanvasProps) {
  const [rotating, setRotating] = useState(autoRotate);

  useEffect(() => {
    setRotating(autoRotate);
  }, [autoRotate]);

  const modelVisible = !xrSession || Boolean(placedPosition);
  const basePosition: Vec3 = xrSession
    ? placedPosition ?? [0, -999, 0]
    : [0, -0.12, 0];
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

      <Canvas
        camera={{ position: [0, 0, 4], fov: 42 }}
        dpr={xrSession ? 1 : [1, 1.5]}
        gl={{ antialias: !xrSession, alpha: true, powerPreference: 'high-performance' }}
        className="r3f-canvas"
      >
        <XRBridge session={xrSession} />
        <ambientLight intensity={xrSession ? 1.1 : 0.85} />
        <directionalLight position={[5, 5, 5]} intensity={xrSession ? 0.95 : 1.35} />
        {!xrSession && <pointLight position={[-4, 3, -4]} intensity={0.9} color="#8c6cff" />}
        {!xrSession && <pointLight position={[4, -3, 4]} intensity={0.55} color="#74e6ff" />}

        {xrSession ? (
          <XRHitTestController
            active={Boolean(xrSession)}
            onPlace={onPlace}
            onTrackingChange={onTrackingChange}
            onReticlePositionChange={onReticlePositionChange}
          />
        ) : null}

        <Suspense fallback={<LoadingFallback />}>
          {modelVisible ? (
            <AutoRotate active={rotating && !xrSession}>
              <group position={finalPosition} rotation={transformRotation} scale={[transformScale, transformScale, transformScale]}>
                <Float speed={xrSession ? 0 : 1.15} rotationIntensity={xrSession ? 0 : 0.04} floatIntensity={xrSession ? 0 : 0.12}>
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
          ) : null}
          {!xrSession && <Environment preset="city" />}
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
