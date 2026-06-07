'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { Center, ContactShadows, Environment, Float, Html, OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { DoubleSide, Group, Matrix4, Object3D, Quaternion, Vector3 } from 'three';
import LabelOverlay from '@/components/LabelOverlay';
import { useModelRotation } from '@/hooks/useModelRotation';
import { iosSpring } from '@/lib/motion';
import { Quat, TopicAnnotation, Vec3, XRPlacement } from '@/lib/types';
import { ProjectedAnnotation } from '@/types/annotation';

type XRTransientSource = XRTransientInputHitTestSource;

function matchAnnotation(meshName: string, annotations: TopicAnnotation[]) {
  const normalizedName = meshName.toLowerCase();
  return annotations.find((annotation) =>
    annotation.meshKeywords?.some((keyword) => normalizedName.includes(keyword.toLowerCase())),
  );
}

function isProceduralModel(url: string) {
  return url.startsWith('procedural:');
}

function getProceduralModelId(url: string) {
  return url.replace('procedural:', '');
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

function areProjectedAnnotationsEqual(
  previous: ProjectedAnnotation[],
  next: ProjectedAnnotation[],
) {
  if (previous.length !== next.length) return false;

  for (let index = 0; index < previous.length; index += 1) {
    const before = previous[index];
    const after = next[index];

    if (
      before.id !== after.id ||
      before.align !== after.align ||
      before.isVisible !== after.isVisible ||
      Math.abs(before.screenX - after.screenX) > 0.8 ||
      Math.abs(before.screenY - after.screenY) > 0.8
    ) {
      return false;
    }
  }

  return true;
}

function AnnotationAnchors({
  annotations,
  active,
  onChange,
}: {
  annotations: TopicAnnotation[];
  active: boolean;
  onChange: (annotations: ProjectedAnnotation[]) => void;
}) {
  const { camera, size } = useThree();
  const anchorRefs = useRef<(Group | null)[]>([]);
  const previousRef = useRef<ProjectedAnnotation[]>([]);

  useEffect(() => {
    anchorRefs.current = anchorRefs.current.slice(0, annotations.length);
  }, [annotations.length]);

  useEffect(() => {
    if (!active) {
      previousRef.current = [];
      onChange([]);
    }
  }, [active, onChange]);

  useFrame(() => {
    if (!active || annotations.length === 0) return;

    const next = annotations
      .map((annotation, index) => {
        const anchor = anchorRefs.current[index];
        if (!anchor) return null;

        const worldPosition = new Vector3();
        const projected = new Vector3();

        anchor.getWorldPosition(worldPosition);
        projected.copy(worldPosition).project(camera);

        const screenX = ((projected.x + 1) / 2) * size.width;
        const screenY = ((-projected.y + 1) / 2) * size.height;
        const isVisible =
          projected.z > -1 &&
          projected.z < 1 &&
          screenX >= -64 &&
          screenX <= size.width + 64 &&
          screenY >= -64 &&
          screenY <= size.height + 64;

        return {
          id: annotation.id,
          name: annotation.label,
          description: annotation.description,
          position: annotation.position,
          align: projected.x < 0 ? 'left' : 'right',
          isVisible,
          labelX: screenX,
          labelY: screenY,
          screenX,
          screenY,
          worldPosition: [worldPosition.x, worldPosition.y, worldPosition.z] as Vec3,
        } satisfies ProjectedAnnotation;
      })
      .filter((annotation): annotation is ProjectedAnnotation => Boolean(annotation));

    if (!areProjectedAnnotationsEqual(previousRef.current, next)) {
      previousRef.current = next;
      onChange(next);
    }
  });

  return (
    <>
      {annotations.map((annotation, index) => (
        <group
          key={annotation.id}
          ref={(node) => {
            anchorRefs.current[index] = node;
          }}
          position={annotation.position}
        />
      ))}
    </>
  );
}

function GLTFModel({
  url,
  annotations,
  showHotspots,
  showProjectedLabels,
  selectedAnnotationId,
  onSelectAnnotation,
  onProjectedAnnotationsChange,
  modelScale = 1,
  xrSession,
}: {
  url: string;
  annotations: TopicAnnotation[];
  showHotspots: boolean;
  showProjectedLabels: boolean;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (annotation: TopicAnnotation) => void;
  onProjectedAnnotationsChange?: (annotations: ProjectedAnnotation[]) => void;
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
        {showProjectedLabels && onProjectedAnnotationsChange ? (
          <AnnotationAnchors
            annotations={annotations}
            active={showProjectedLabels}
            onChange={onProjectedAnnotationsChange}
          />
        ) : null}
        {showHotspots && !xrSession && !showProjectedLabels
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

function ProceduralContent({ kind }: { kind: string }) {
  switch (kind) {
    case 'heart':
      return (
        <group rotation={[0.08, -0.3, 0]}>
          <mesh name="ventricle-left" position={[-0.22, -0.12, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.34, 36, 36]} />
            <meshStandardMaterial color="#a3152a" roughness={0.5} metalness={0.06} />
          </mesh>
          <mesh name="ventricle-right" position={[0.16, -0.22, 0.04]} scale={[0.88, 0.96, 0.88]} castShadow receiveShadow>
            <sphereGeometry args={[0.38, 36, 36]} />
            <meshStandardMaterial color="#c61f36" roughness={0.46} metalness={0.06} />
          </mesh>
          <mesh name="atria-left" position={[-0.22, 0.38, -0.02]} scale={[0.72, 0.62, 0.72]} castShadow receiveShadow>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshStandardMaterial color="#7b1534" roughness={0.48} metalness={0.04} />
          </mesh>
          <mesh name="atria-right" position={[0.12, 0.34, 0.03]} scale={[0.76, 0.64, 0.72]} castShadow receiveShadow>
            <sphereGeometry args={[0.24, 32, 32]} />
            <meshStandardMaterial color="#8d2440" roughness={0.48} metalness={0.04} />
          </mesh>
          <mesh name="aorta" position={[0.14, 0.84, 0.02]} rotation={[0, 0, -0.3]} castShadow receiveShadow>
            <cylinderGeometry args={[0.09, 0.12, 0.54, 24]} />
            <meshStandardMaterial color="#5082ff" roughness={0.42} metalness={0.08} />
          </mesh>
          <mesh name="artery-left" position={[-0.28, 0.72, 0.18]} rotation={[0.2, 0.1, 0.6]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.38, 20]} />
            <meshStandardMaterial color="#4a72ea" roughness={0.42} metalness={0.08} />
          </mesh>
          <mesh name="artery-right" position={[0.44, 0.56, -0.06]} rotation={[0.1, 0.2, -0.8]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.06, 0.36, 20]} />
            <meshStandardMaterial color="#d1485e" roughness={0.42} metalness={0.08} />
          </mesh>
        </group>
      );
    case 'solar-system':
      return (
        <group rotation={[0.45, -0.4, 0.1]}>
          <mesh name="sun" castShadow receiveShadow>
            <sphereGeometry args={[0.4, 40, 40]} />
            <meshStandardMaterial color="#f7b733" emissive="#ff9d00" emissiveIntensity={1.4} roughness={0.32} />
          </mesh>
          {[
            { name: 'mercury', orbit: 0.78, size: 0.07, color: '#a79b88', angle: 0.4 },
            { name: 'venus', orbit: 1.05, size: 0.11, color: '#dcb26a', angle: 1.8 },
            { name: 'earth', orbit: 1.34, size: 0.12, color: '#53a3ff', angle: 2.7 },
            { name: 'mars', orbit: 1.63, size: 0.1, color: '#ca5945', angle: 4.1 },
            { name: 'jupiter', orbit: 2.02, size: 0.2, color: '#d6a46f', angle: 0.9 },
            { name: 'saturn', orbit: 2.42, size: 0.18, color: '#e9cf90', angle: 3.6, ring: true },
          ].map((planet) => (
            <group key={planet.name}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[planet.orbit, 0.006, 12, 96]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.18} roughness={1} />
              </mesh>
              <mesh
                name={planet.name}
                position={[
                  Math.cos(planet.angle) * planet.orbit,
                  0,
                  Math.sin(planet.angle) * planet.orbit,
                ]}
                castShadow
                receiveShadow
              >
                <sphereGeometry args={[planet.size, 24, 24]} />
                <meshStandardMaterial color={planet.color} roughness={0.48} metalness={0.08} />
              </mesh>
              {planet.ring ? (
                <mesh
                  position={[
                    Math.cos(planet.angle) * planet.orbit,
                    0,
                    Math.sin(planet.angle) * planet.orbit,
                  ]}
                  rotation={[Math.PI / 2.6, 0.3, 0]}
                >
                  <torusGeometry args={[0.3, 0.024, 10, 50]} />
                  <meshStandardMaterial color="#f7e1b6" transparent opacity={0.75} />
                </mesh>
              ) : null}
            </group>
          ))}
        </group>
      );
    case 'electric-circuit':
      return (
        <group rotation={[0.28, -0.4, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.7, 0.16, 1.7]} />
            <meshStandardMaterial color="#123644" roughness={0.72} />
          </mesh>
          <mesh name="battery" position={[-0.76, 0.12, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.78, 24]} />
            <meshStandardMaterial color="#27374d" roughness={0.45} />
          </mesh>
          <mesh position={[-1.12, 0.12, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 20]} />
            <meshStandardMaterial color="#ef4444" metalness={0.35} roughness={0.3} />
          </mesh>
          <mesh position={[-0.4, 0.12, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 20]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.45} roughness={0.28} />
          </mesh>
          <mesh name="wire-path" position={[0.05, 0.06, 0.66]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[0.92, 0.05, 18, 80]} />
            <meshStandardMaterial color="#52d2c6" metalness={0.22} roughness={0.36} />
          </mesh>
          <mesh name="load-bulb" position={[0.96, 0.35, 0.06]} castShadow receiveShadow>
            <sphereGeometry args={[0.22, 28, 28]} />
            <meshStandardMaterial color="#ffe185" emissive="#ffc947" emissiveIntensity={1.1} roughness={0.22} />
          </mesh>
          <mesh position={[0.96, 0.1, 0.06]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.14, 0.3, 22]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.4} roughness={0.36} />
          </mesh>
        </group>
      );
    case 'plant-cell':
      return (
        <group rotation={[0.1, -0.35, 0]}>
          <mesh position={[0, 0, 0]} scale={[1.45, 0.96, 1.2]} castShadow receiveShadow>
            <sphereGeometry args={[0.78, 40, 40]} />
            <meshStandardMaterial color="#6ad38d" transparent opacity={0.9} roughness={0.52} />
          </mesh>
          <mesh name="vacuole" position={[0.22, -0.02, 0.12]} scale={[1.1, 0.76, 0.9]} castShadow receiveShadow>
            <sphereGeometry args={[0.38, 32, 32]} />
            <meshStandardMaterial color="#a7f3d0" transparent opacity={0.55} roughness={0.2} />
          </mesh>
          <mesh name="nucleus" position={[-0.16, -0.08, 0.3]} castShadow receiveShadow>
            <sphereGeometry args={[0.18, 28, 28]} />
            <meshStandardMaterial color="#7c3aed" roughness={0.36} />
          </mesh>
          {[
            [-0.46, 0.28, 0.06],
            [0.42, 0.18, -0.08],
            [0.18, -0.32, 0.04],
          ].map((position, index) => (
            <mesh key={index} name="chloroplast" position={position as Vec3} rotation={[0.4, 0.2, 0.2]} castShadow receiveShadow>
              <capsuleGeometry args={[0.09, 0.16, 6, 12]} />
              <meshStandardMaterial color="#198754" roughness={0.5} />
            </mesh>
          ))}
        </group>
      );
    case 'volcano':
      return (
        <group rotation={[0.08, -0.4, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.95, 1.6, 36]} />
            <meshStandardMaterial color="#52332b" roughness={0.82} />
          </mesh>
          <mesh name="magma" position={[0, 0.34, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.26, 0.16, 24]} />
            <meshStandardMaterial color="#ff7a18" emissive="#ff4d00" emissiveIntensity={1.2} roughness={0.25} />
          </mesh>
          <mesh name="vent" position={[0.02, -0.02, 0.22]} rotation={[Math.PI / 2.4, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.88, 18]} />
            <meshStandardMaterial color="#704634" roughness={0.74} />
          </mesh>
          {[
            [0.02, 0.8, 0],
            [-0.18, 1.02, 0.08],
            [0.21, 1.1, -0.04],
          ].map((position, index) => (
            <mesh key={index} name="ash-cloud" position={position as Vec3}>
              <sphereGeometry args={[0.18 + index * 0.04, 24, 24]} />
              <meshStandardMaterial color="#5f5d66" transparent opacity={0.62} roughness={1} />
            </mesh>
          ))}
        </group>
      );
    case 'brain':
      return (
        <group rotation={[0.12, -0.36, 0]}>
          {[
            [-0.3, 0.06, 0.08],
            [0.02, 0.12, 0.02],
            [0.34, 0.04, 0],
            [-0.1, 0.3, -0.04],
            [0.18, 0.28, 0.06],
          ].map((position, index) => (
            <mesh
              key={index}
              name={index < 4 ? 'cerebrum' : 'cerebellum'}
              position={position as Vec3}
              scale={index === 4 ? [0.8, 0.74, 0.8] : [1, 1, 1]}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[0.34 - index * 0.02, 28, 28]} />
              <meshStandardMaterial color="#f0a3b7" roughness={0.54} />
            </mesh>
          ))}
          <mesh name="brainstem" position={[0.08, -0.46, 0.06]} rotation={[0.18, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.1, 0.14, 0.5, 22]} />
            <meshStandardMaterial color="#d68ea1" roughness={0.58} />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.45} />
        </mesh>
      );
  }
}

function ProceduralModel({
  id,
  annotations,
  showHotspots,
  showProjectedLabels,
  selectedAnnotationId,
  onSelectAnnotation,
  onProjectedAnnotationsChange,
  modelScale = 1,
  xrSession,
}: {
  id: string;
  annotations: TopicAnnotation[];
  showHotspots: boolean;
  showProjectedLabels: boolean;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (annotation: TopicAnnotation) => void;
  onProjectedAnnotationsChange?: (annotations: ProjectedAnnotation[]) => void;
  modelScale?: number;
  xrSession?: XRSession | null;
}) {
  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!showHotspots || !onSelectAnnotation) return;
    const matched = matchAnnotation(event.object?.name ?? '', annotations);
    if (matched) {
      event.stopPropagation();
      onSelectAnnotation(matched);
    }
  };

  return (
    <group onPointerDown={handlePointerDown}>
      <Center>
        <group scale={1.08 * modelScale}>
          <ProceduralContent kind={id} />
        </group>
        {showProjectedLabels && onProjectedAnnotationsChange ? (
          <AnnotationAnchors
            annotations={annotations}
            active={showProjectedLabels}
            onChange={onProjectedAnnotationsChange}
          />
        ) : null}
        {showHotspots && !xrSession && !showProjectedLabels
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

function XRPlacementRoot({
  anchor,
  basePosition,
  baseRotation,
  children,
}: {
  anchor?: XRAnchor | null;
  basePosition: Vec3;
  baseRotation: Quat;
  children: React.ReactNode;
}) {
  const { gl } = useThree();
  const rootRef = useRef<Group>(null);
  const matrixRef = useRef(new Matrix4());
  const scaleRef = useRef(new Vector3());

  useEffect(() => {
    if (!rootRef.current || anchor) return;
    rootRef.current.position.set(basePosition[0], basePosition[1], basePosition[2]);
    rootRef.current.quaternion.set(baseRotation[0], baseRotation[1], baseRotation[2], baseRotation[3]);
  }, [anchor, basePosition, baseRotation]);

  useFrame((_state, _delta, xrFrame) => {
    if (!anchor || !rootRef.current || !xrFrame) return;
    const referenceSpace = gl.xr.getReferenceSpace();
    if (!referenceSpace) return;

    const pose = xrFrame.getPose(anchor.anchorSpace, referenceSpace);
    if (!pose) return;

    matrixRef.current.fromArray(pose.transform.matrix);
    matrixRef.current.decompose(rootRef.current.position, rootRef.current.quaternion, scaleRef.current);
  });

  return <group ref={rootRef}>{children}</group>;
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
  onPlace?: (placement: XRPlacement) => void;
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
  const quaternionRef = useRef(new Quaternion());
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

    const handleSelect = async (event: XRInputSourceEvent) => {
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

          const anchor = hit.createAnchor ? await hit.createAnchor().catch(() => null) : null;
          const { x, y, z } = pose.transform.position;
          const { x: qx, y: qy, z: qz, w: qw } = pose.transform.orientation;
          onPlace({
            position: [x, y, z],
            rotation: [qx, qy, qz, qw],
            anchor,
          });
          placed = true;
          break;
        }
      }

      if (!placed && reticleRef.current?.visible) {
        const { x, y, z } = reticleRef.current.position;
        onPlace({
          position: [x, y, z],
          rotation: [
            reticleRef.current.quaternion.x,
            reticleRef.current.quaternion.y,
            reticleRef.current.quaternion.z,
            reticleRef.current.quaternion.w,
          ],
          anchor: null,
        });
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
    matrixRef.current.decompose(reticleRef.current.position, quaternionRef.current, scaleRef.current);
    reticleRef.current.quaternion.copy(quaternionRef.current);
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
  placementAnchor?: XRAnchor | null;
  transformPosition?: Vec3;
  transformRotation?: Vec3;
  transformScale?: number;
  placedPosition?: Vec3 | null;
  placedRotation?: Quat | null;
  modelScale?: number;
  arPlacementOffset?: Vec3;
  annotations?: TopicAnnotation[];
  showHotspots?: boolean;
  showProjectedLabels?: boolean;
  labelOverlayBottomInset?: number;
  focusSelectedLabel?: boolean;
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (annotation: TopicAnnotation) => void;
  placeholder?: string;
  onPlace?: (placement: XRPlacement) => void;
  onTrackingChange?: (ready: boolean) => void;
  onReticlePositionChange?: (position: Vec3 | null) => void;
}

export default function ModelCanvas({
  modelUrl,
  className,
  autoRotate = true,
  xrSession,
  placementAnchor = null,
  transformPosition = [0, 0, 0],
  transformRotation = [0, 0, 0],
  transformScale = 1,
  placedPosition = null,
  placedRotation = null,
  modelScale = 1,
  arPlacementOffset = [0, 0, 0],
  annotations = [],
  showHotspots = false,
  showProjectedLabels = false,
  labelOverlayBottomInset = 164,
  focusSelectedLabel = false,
  selectedAnnotationId,
  onSelectAnnotation,
  placeholder,
  onPlace,
  onTrackingChange,
  onReticlePositionChange,
}: ModelCanvasProps) {
  const [rotating, setRotating] = useState(autoRotate);
  const [projectedAnnotations, setProjectedAnnotations] = useState<ProjectedAnnotation[]>([]);

  useEffect(() => {
    setRotating(autoRotate);
  }, [autoRotate]);

  useEffect(() => {
    if (!showProjectedLabels) {
      setProjectedAnnotations([]);
    }
  }, [showProjectedLabels]);

  const modelVisible = !xrSession || Boolean(placedPosition);
  const proceduralModelId = isProceduralModel(modelUrl) ? getProceduralModelId(modelUrl) : null;
  const annotationLookup = useMemo(
    () => new Map(annotations.map((annotation) => [annotation.id, annotation])),
    [annotations],
  );
  const basePosition: Vec3 = xrSession
    ? placedPosition ?? [0, -999, 0]
    : [0, -0.12, 0];
  const baseRotation: Quat = xrSession
    ? placedRotation ?? [0, 0, 0, 1]
    : [0, 0, 0, 1];
  const contentPosition: Vec3 = [
    transformPosition[0] + (xrSession ? arPlacementOffset[0] : 0),
    transformPosition[1] + (xrSession ? arPlacementOffset[1] : 0),
    transformPosition[2] + (xrSession ? arPlacementOffset[2] : 0),
  ];
  const handleProjectedAnnotationsChange = useCallback((next: ProjectedAnnotation[]) => {
    setProjectedAnnotations(next);
  }, []);
  const handleSelectProjectedAnnotation = useCallback(
    (annotation: ProjectedAnnotation) => {
      const selected = annotationLookup.get(annotation.id);
      if (selected) {
        onSelectAnnotation?.(selected);
      }
    },
    [annotationLookup, onSelectAnnotation],
  );

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
            active={Boolean(xrSession) && !placedPosition}
            onPlace={onPlace}
            onTrackingChange={onTrackingChange}
            onReticlePositionChange={onReticlePositionChange}
          />
        ) : null}

        <Suspense fallback={<LoadingFallback />}>
          {modelVisible ? (
            <AutoRotate active={rotating && !xrSession}>
              <XRPlacementRoot
                anchor={placementAnchor}
                basePosition={basePosition}
                baseRotation={baseRotation}
              >
                <group position={contentPosition} rotation={transformRotation} scale={[transformScale, transformScale, transformScale]}>
                  <Float speed={xrSession ? 0 : 1.15} rotationIntensity={xrSession ? 0 : 0.04} floatIntensity={xrSession ? 0 : 0.12}>
                    {proceduralModelId ? (
                      <ProceduralModel
                        id={proceduralModelId}
                        annotations={annotations}
                        showHotspots={showHotspots}
                        showProjectedLabels={showProjectedLabels}
                        selectedAnnotationId={selectedAnnotationId}
                        onSelectAnnotation={onSelectAnnotation}
                        onProjectedAnnotationsChange={handleProjectedAnnotationsChange}
                        modelScale={modelScale}
                        xrSession={xrSession}
                      />
                    ) : (
                      <GLTFModel
                        url={modelUrl}
                        annotations={annotations}
                        showHotspots={showHotspots}
                        showProjectedLabels={showProjectedLabels}
                        selectedAnnotationId={selectedAnnotationId}
                        onSelectAnnotation={onSelectAnnotation}
                        onProjectedAnnotationsChange={handleProjectedAnnotationsChange}
                        modelScale={modelScale}
                        xrSession={xrSession}
                      />
                    )}
                  </Float>
                </group>
              </XRPlacementRoot>
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
          whileTap={{ scale: 0.96 }}
          transition={iosSpring}
        >
          {rotating ? 'Auto Rotate On' : 'Auto Rotate Off'}
        </motion.button>
      )}

      <LabelOverlay
        annotations={projectedAnnotations}
        bottomInset={labelOverlayBottomInset}
        focusSelected={focusSelectedLabel}
        selectedId={selectedAnnotationId}
        visible={showProjectedLabels && modelVisible}
        onSelect={handleSelectProjectedAnnotation}
      />
    </div>
  );
}
