/**
 * Full-screen warp starfield (CodePen JjEqebK port). Points move in Z for tunnel effect;
 * timeCoef starts at 1 and lerps down to slow the warp, then onWarpComplete fires.
 */
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const POINTS_COUNT = 50000;
const WARP_FAST_DURATION_MS = 2500;
const WARP_SLOW_DURATION_MS = 1800;
const TOTAL_WARP_MS = WARP_FAST_DURATION_MS + WARP_SLOW_DURATION_MS;
const TARGET_TIME_COEF = 0.1;
const COMPLETE_THRESHOLD = 0.15;

const VERTEX_SHADER = `
  uniform float uTime;
  attribute vec3 color;
  attribute float size;
  varying vec4 vColor;
  void main() {
    vColor = vec4(color, 1.0);
    vec3 p = vec3(position);
    p.z = -150.0 + mod(position.z + uTime, 300.0);
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = size * (-200.0 / mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  varying vec4 vColor;
  void main() {
    gl_FragColor = vColor * texture2D(uTexture, gl_PointCoord);
  }
`;

const TELEPORTATION_PALETTES: Record<string, string[]> = {
  delorean: ['#C0C0C0', '#4A6FA5', '#E67E22', '#2C3E50', '#BDC3C7'],
  tardis: ['#003B6F', '#6495ED', '#FFFFFF', '#4169E1', '#000080'],
  'time-stone': ['#2E8B57', '#FFD700', '#ADFF2F', '#006400', '#DAA520'],
};

function createPointTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.5)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.15)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

interface StarfieldPointsProps {
  palette: string[];
  onWarpComplete: () => void;
  reducedMotion: boolean;
}

function StarfieldPoints({ palette, onWarpComplete, reducedMotion }: StarfieldPointsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const uTime = useRef(0);
  const timeCoef = useRef(1);
  const targetTimeCoef = useRef(1);
  const startTime = useRef<number | null>(null);
  const completed = useRef(false);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(POINTS_COUNT * 3);
    const colors = new Float32Array(POINTS_COUNT * 3);
    const sizes = new Float32Array(POINTS_COUNT);
    const color = new THREE.Color();
    for (let i = 0; i < POINTS_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      const hex = palette[Math.floor(Math.random() * palette.length)];
      color.set(hex);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      sizes[i] = 5 + Math.random() * 15;
    }
    return { positions, colors, sizes };
  }, [palette]);

  const texture = useMemo(() => createPointTexture(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTexture: { value: texture },
    }),
    [texture]
  );

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (startTime.current === null) startTime.current = performance.now();
    const elapsed = (performance.now() - startTime.current) / 1000;

    if (elapsed > WARP_FAST_DURATION_MS / 1000) {
      targetTimeCoef.current = TARGET_TIME_COEF;
    }
    timeCoef.current = lerp(timeCoef.current, targetTimeCoef.current, 0.02);
    uTime.current += delta * timeCoef.current * 4;

    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined;
    if (mat?.uniforms?.uTime) mat.uniforms.uTime.value = uTime.current;

    if (!completed.current && (timeCoef.current < COMPLETE_THRESHOLD || elapsed > TOTAL_WARP_MS / 1000)) {
      completed.current = true;
      onWarpComplete();
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, -150]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  );
}

export type TeleportationMethodId = 'delorean' | 'tardis' | 'time-stone';

function WarpStarfieldReducedMotion({ onWarpComplete }: { onWarpComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onWarpComplete, 1500);
    return () => clearTimeout(t);
  }, [onWarpComplete]);
  return null;
}

export interface WarpStarfieldProps {
  onWarpComplete: () => void;
  reducedMotion: boolean;
  teleportationMethodId: TeleportationMethodId;
}

export function WarpStarfield({
  onWarpComplete,
  reducedMotion,
  teleportationMethodId,
}: WarpStarfieldProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const palette = TELEPORTATION_PALETTES[teleportationMethodId] ?? TELEPORTATION_PALETTES.tardis;

  if (!mounted) return null;

  if (reducedMotion) {
    return <WarpStarfieldReducedMotion onWarpComplete={onWarpComplete} />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 50 }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <color attach="background" args={['#000000']} />
        <StarfieldPoints
          palette={palette}
          onWarpComplete={onWarpComplete}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
