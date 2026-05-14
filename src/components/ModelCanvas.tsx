'use client';

import { useThree, Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html } from '@react-three/drei';
import { Group } from 'three';
import { Suspense, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useModelRotation } from '@/hooks/useModelRotation';

// ─── Model Loader ─────────────────────────────────────────────
function GLTFModel({ url, rotating }: { url: string; rotating: boolean }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<Group>(null);

  // We can't use useFrame here (hook rule) — handle in parent
  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} scale={1.4} />
    </group>
  );
}

function AutoRotate({ children, speed = 0.005, active }: {
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
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
        <span className="text-white/60 text-sm">Loading model...</span>
      </div>
    </Html>
  );
}

// ─── Main Component ───────────────────────────────────────────
function XRBridge({ session }: { session: any }) {
  const { gl } = useThree();

  useEffect(() => {
    if (session) {
      gl.xr.enabled = true;
      gl.xr.setSession(session);
    } else {
      gl.xr.enabled = false;
    }
  }, [session, gl]);

  return null;
}

interface ModelCanvasProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  xrSession?: any | null;
  transformPosition?: [number, number, number];
  transformRotation?: [number, number, number];
  transformScale?: number;
}

export default function ModelCanvas({ 
  modelUrl, 
  className, 
  autoRotate = true, 
  xrSession,
  transformPosition = [0, 0, 0],
  transformRotation = [0, 0, 0],
  transformScale = 1
}: ModelCanvasProps) {
  const [rotating, setRotating] = useState(autoRotate);

  // Sync rotating state if autoRotate prop changes
  useEffect(() => {
    setRotating(autoRotate);
  }, [autoRotate]);

  // Base position: center on desktop, 1.5m forward in AR
  const basePosition: [number, number, number] = xrSession ? [0, 0, -1.5] : [0, 0, 0];
  
  // Combine base position with user interaction offset
  const finalPosition: [number, number, number] = [
    basePosition[0] + transformPosition[0],
    basePosition[1] + transformPosition[1],
    basePosition[2] + transformPosition[2],
  ];

  return (
    <div className={`relative w-full h-full ${className ?? ''}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="r3f-canvas"
      >
        <XRBridge session={xrSession} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-4, 3, -4]} intensity={0.8} color="#7C3AED" />
        <pointLight position={[4, -3, 4]} intensity={0.4} color="#4F46E5" />

        {/* Model */}
        <Suspense fallback={<LoadingFallback />}>
          <AutoRotate active={rotating}>
            <group 
              position={finalPosition} 
              rotation={transformRotation}
              scale={[transformScale, transformScale, transformScale]}
            >
              <GLTFModel url={modelUrl} rotating={rotating} />
            </group>
          </AutoRotate>
          <Environment preset="city" />
          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.4}
            scale={4}
            blur={2}
            far={4}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          makeDefault
        />
      </Canvas>

      {/* Rotate toggle button */}
      <motion.button
        onClick={() => setRotating(r => !r)}
        className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
          rotating
            ? 'bg-brand-purple/30 text-brand-accent border border-brand-purple/50'
            : 'glass text-white/50'
        }`}
        whileTap={{ scale: 0.9 }}
      >
        {rotating ? '⏸ Auto-Rotate' : '▶ Rotate'}
      </motion.button>
    </div>
  );
}
