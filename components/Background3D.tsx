import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Html, Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const TECH_STACK = [
    { name: 'React', color: '#61dafb', distance: 2.5, speed: 0.5, size: 0.12, hasRings: true, offset: 0 },
    { name: 'Next.js', color: '#ffffff', distance: 3.5, speed: 0.4, size: 0.14, hasRings: false, offset: Math.PI * 0.25 },
    { name: 'TypeScript', color: '#3178c6', distance: 4.8, speed: 0.32, size: 0.1, hasRings: false, offset: Math.PI * 0.5 },
    { name: 'Tailwind', color: '#38bdf8', distance: 6.2, speed: 0.28, size: 0.11, hasRings: true, offset: Math.PI * 0.8 },
    { name: 'Node.js', color: '#339933', distance: 7.8, speed: 0.24, size: 0.13, hasRings: false, offset: Math.PI * 1.1 },
    { name: 'Python', color: '#3776ab', distance: 9.5, speed: 0.2, size: 0.15, hasRings: false, offset: Math.PI * 1.4 },
    { name: 'PostgreSQL', color: '#336791', distance: 11.2, speed: 0.16, size: 0.12, hasRings: true, offset: Math.PI * 1.7 },
    { name: 'Docker', color: '#2496ed', distance: 13.0, speed: 0.12, size: 0.14, hasRings: false, offset: Math.PI * 1.9 },
];

const PlanetRings: React.FC<{ color: string; size: number }> = ({ color, size }) => {
    return (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
                emissive={color}
                emissiveIntensity={0.5}
            />
        </mesh>
    );
};

const Planet: React.FC<{ name: string; color: string; distance: number; speed: number; size: number; hasRings?: boolean; offset: number }> = ({ name, color, distance, speed, size, hasRings, offset }) => {
    const ref = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (ref.current) {
            const t = (state.clock.getElapsedTime() * speed * 0.5) + offset;
            ref.current.position.x = Math.cos(t) * distance;
            ref.current.position.z = Math.sin(t) * distance;
        }
        if (planetRef.current) {
            planetRef.current.rotation.y += 0.01;
        }
    });

    return (
        <group>
            {/* Visual Orbit Path - stays at origin */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[distance - 0.012, distance + 0.012, 128]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>

            {/* Moving Planet */}
            <group ref={ref}>
                <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
                    <Sphere ref={planetRef} args={[size, 32, 32]}>
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={0.8}
                            roughness={0.3}
                            metalness={0.8}
                        />
                    </Sphere>
                    <Sphere args={[size * 1.15, 32, 32]}>
                        <meshStandardMaterial
                            color={color}
                            transparent
                            opacity={0.15}
                            blending={THREE.AdditiveBlending}
                            side={THREE.BackSide}
                        />
                    </Sphere>
                    {hasRings && <PlanetRings color={color} size={size} />}
                    <Html distanceFactor={8} position={[0, size + 0.3, 0]} center>
                        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full whitespace-nowrap shadow-2xl pointer-events-none select-none">
                            <span className="font-rajdhani font-black text-[9px] tracking-[0.3em] text-white uppercase">{name}</span>
                        </div>
                    </Html>
                </Float>
            </group>
        </group>
    );
};

const SolarSystem: React.FC<{ showSolarSystem: boolean }> = ({ showSolarSystem }) => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (groupRef.current) {
            // Shift the system to the right when not in solar-system view
            const targetX = showSolarSystem ? 0 : 14;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
        }
    });
    return (
        <group ref={groupRef} rotation={[Math.PI * 0.05, 0, 0]}>
            <Sphere args={[0.8, 64, 64]}>
                <MeshDistortMaterial
                    color="#ff4d00"
                    emissive="#ffcc00"
                    emissiveIntensity={5}
                    distort={0.45}
                    speed={3}
                    roughness={0}
                />
            </Sphere>
            <Sphere args={[1.0, 64, 64]}>
                <meshBasicMaterial
                    color="#ffaa00"
                    transparent
                    opacity={0.2}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>
            <Html center>
                <div className="flex flex-col items-center select-none pointer-events-auto [direction:ltr]" dir="ltr">
                    <span className="font-orbitron font-black text-2xl tracking-[0.3em] text-white drop-shadow-[0_0_10px_rgba(255,158,0,0.8)] opacity-90 uppercase">Web</span>
                </div>
            </Html>



            <pointLight intensity={30} distance={40} color="#ffaa00" decay={1.5} />
            <pointLight intensity={10} distance={10} color="#ffffff" decay={1} />
            {TECH_STACK.map((tech, idx) => (
                <Planet key={idx} {...tech} />
            ))}
            <ambientLight intensity={0.4} />
        </group>
    );
};

const StarField: React.FC = () => {
    const ref = useRef<THREE.Points>(null);

    const { positions, colors, sizes } = useMemo(() => {
        const count = 1500;
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const siz = new Float32Array(count);

        const colorOptions = [
            new THREE.Color('#ffffff'),
            new THREE.Color('#aaccff'),
            new THREE.Color('#ffccaa'),
        ];

        for (let i = 0; i < count; i++) {
            const r = 40 + Math.random() * 40;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            col[i * 3] = color.r * 0.2;
            col[i * 3 + 1] = color.g * 0.2;
            col[i * 3 + 2] = color.b * 0.2;

            siz[i] = Math.random() * 0.02 + 0.005;
        }
        return { positions: pos, colors: col, sizes: siz };
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 100;
            ref.current.rotation.y -= delta / 120;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 6]}>
            <Points ref={ref} positions={positions} colors={colors} sizes={sizes} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    vertexColors
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.15}
                />
            </Points>
        </group>
    );
};

const CameraController: React.FC<{ showSolarSystem: boolean }> = ({ showSolarSystem }) => {
    const lastShowSolarSystem = useRef(showSolarSystem);
    const isTransitioning = useRef(false);

    useEffect(() => {
        if (lastShowSolarSystem.current !== showSolarSystem) {
            isTransitioning.current = true;
            lastShowSolarSystem.current = showSolarSystem;
            // Transition will last roughly 2 seconds
            const timer = setTimeout(() => {
                isTransitioning.current = false;
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSolarSystem]);

    useFrame((state) => {
        if (showSolarSystem) {
            const targetZ = 22;
            const targetY = 5;
            if (isTransitioning.current) {
                state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
                state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
                state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.05);
                state.camera.lookAt(0, 0, 0);
            }
        } else {
            const targetZ = 35;
            const targetY = 12;
            if (isTransitioning.current) {
                state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
                state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
                state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.05);
                state.camera.lookAt(0, 0, 0);
            }
        }
    });

    return null;
};

export const Background3D: React.FC<{ showSolarSystem?: boolean }> = ({ showSolarSystem = false }) => {
    return (
        <div className="absolute inset-0 z-0 bg-[#020205]">
            <Canvas
                camera={{ position: [0, 15, 35], fov: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 2]}
            >
                <CameraController showSolarSystem={showSolarSystem} />
                <StarField />
                <SolarSystem showSolarSystem={showSolarSystem} />

                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={12}
                    maxDistance={60}
                    autoRotate={!showSolarSystem}
                    autoRotateSpeed={0.15}
                    makeDefault
                />

                <EffectComposer multisampling={4}>
                    <Bloom
                        intensity={0.4}
                        luminanceThreshold={0.5}
                        luminanceSmoothing={1}
                        mipmapBlur={true}
                    />
                    <Noise opacity={0.01} />
                    <Vignette eskil={false} offset={0.05} darkness={1.2} />
                </EffectComposer>
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/60 pointer-events-none" />
        </div>
    );
};
