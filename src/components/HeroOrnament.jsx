import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function GoldRing() {
  const group = useRef();
  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.25;
    group.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.15;
  });
  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[1.15, 0.22, 32, 96]} />
        <meshStandardMaterial color="#c9a227" metalness={0.85} roughness={0.25} emissive="#8a7018" emissiveIntensity={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[1.15, 0.05, 16, 96]} />
        <meshStandardMaterial color="#e4c875" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

// Purely decorative — a slow-turning gold ring behind the hero copy. Kept to
// one animated element per view per the "excessive motion" guideline; the
// canvas is aria-hidden and never intercepts pointer events.
export default function HeroOrnament({ className = "", style }) {
  return (
    <div className={className} aria-hidden="true" style={{ pointerEvents: "none", ...style }}>
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 4], fov: 40 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 3, 4]} intensity={1.4} color="#f4ead0" />
          <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#3d7863" />
          <GoldRing />
        </Canvas>
      </Suspense>
    </div>
  );
}
