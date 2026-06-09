"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Planet = {
  key: string;
  name: string;
  ko: string;
  sector: string;
  href: string;
  colorA: string;
  colorB: string;
  radius: number;
  distance: number;
  orbitDays: number;
  rotationDays: number;
  startAngle: number;
  axialTiltDeg: number;
  kind:
    | "mercury"
    | "venus"
    | "earth"
    | "mars"
    | "jupiter"
    | "saturn"
    | "uranus"
    | "neptune"
    | "pluto";
  atmosphere?: string;
  atmosphereOpacity?: number;
  cloud?: boolean;
  gasLayer?: boolean;
  ring?: boolean;
};

const ORBIT_DAYS_PER_SECOND = 35;
const ROTATION_DAYS_PER_SECOND = 0.08;

const planets: Planet[] = [
  {
    key: "mercury",
    name: "Mercury",
    ko: "수성",
    sector: "Data Core",
    href: "/mission/dataset-core",
    kind: "mercury",
    colorA: "#b9bec6",
    colorB: "#555b66",
    radius: 0.16,
    distance: 2.1,
    orbitDays: 87.969,
    rotationDays: 58.646,
    startAngle: 0.2,
    axialTiltDeg: 0.01,
  },
  {
    key: "venus",
    name: "Venus",
    ko: "금성",
    sector: "Preprocessing",
    href: "/academy",
    kind: "venus",
    colorA: "#f6d365",
    colorB: "#b45309",
    radius: 0.24,
    distance: 2.9,
    orbitDays: 224.701,
    rotationDays: -243.018,
    startAngle: 1.25,
    axialTiltDeg: 177.4,
    atmosphere: "#f8d277",
    atmosphereOpacity: 0.18,
    cloud: true,
  },
  {
    key: "earth",
    name: "Earth",
    ko: "지구",
    sector: "Supervised ML",
    href: "/galaxy",
    kind: "earth",
    colorA: "#2dd4bf",
    colorB: "#1d4ed8",
    radius: 0.28,
    distance: 3.75,
    orbitDays: 365.256,
    rotationDays: 0.9973,
    startAngle: 2.5,
    axialTiltDeg: 23.44,
    atmosphere: "#7dd3fc",
    atmosphereOpacity: 0.14,
    cloud: true,
  },
  {
    key: "mars",
    name: "Mars",
    ko: "화성",
    sector: "Classic ML",
    href: "/mission/randomforest",
    kind: "mars",
    colorA: "#fb923c",
    colorB: "#7f1d1d",
    radius: 0.22,
    distance: 4.65,
    orbitDays: 686.98,
    rotationDays: 1.026,
    startAngle: 3.65,
    axialTiltDeg: 25.19,
    atmosphere: "#fb923c",
    atmosphereOpacity: 0.06,
  },
  {
    key: "jupiter",
    name: "Jupiter",
    ko: "목성",
    sector: "Deep Learning",
    href: "/mission/overfitting",
    kind: "jupiter",
    colorA: "#f7ddb3",
    colorB: "#8a4b24",
    radius: 0.58,
    distance: 6.0,
    orbitDays: 4332.589,
    rotationDays: 0.4135,
    startAngle: 4.45,
    axialTiltDeg: 3.13,
    atmosphere: "#f7ddb3",
    atmosphereOpacity: 0.08,
    gasLayer: true,
  },
  {
    key: "saturn",
    name: "Saturn",
    ko: "토성",
    sector: "CNN Vision",
    href: "/mission/cnn",
    kind: "saturn",
    colorA: "#fde68a",
    colorB: "#8b5e34",
    radius: 0.5,
    distance: 7.45,
    orbitDays: 10759.22,
    rotationDays: 0.444,
    startAngle: 5.25,
    axialTiltDeg: 26.73,
    atmosphere: "#fef3c7",
    atmosphereOpacity: 0.07,
    gasLayer: true,
    ring: true,
  },
  {
    key: "uranus",
    name: "Uranus",
    ko: "천왕성",
    sector: "Generalization",
    href: "/mission/dropout",
    kind: "uranus",
    colorA: "#a7f3d0",
    colorB: "#0e7490",
    radius: 0.38,
    distance: 8.75,
    orbitDays: 30685.4,
    rotationDays: -0.718,
    startAngle: 0.75,
    axialTiltDeg: 97.77,
    atmosphere: "#a7f3d0",
    atmosphereOpacity: 0.13,
  },
  {
    key: "neptune",
    name: "Neptune",
    ko: "해왕성",
    sector: "Transformer",
    href: "/mission/transformer",
    kind: "neptune",
    colorA: "#60a5fa",
    colorB: "#172554",
    radius: 0.39,
    distance: 9.95,
    orbitDays: 60189,
    rotationDays: 0.671,
    startAngle: 2.15,
    axialTiltDeg: 28.32,
    atmosphere: "#60a5fa",
    atmosphereOpacity: 0.13,
    gasLayer: true,
  },
  {
    key: "pluto",
    name: "Pluto",
    ko: "명왕성",
    sector: "Frontier AI",
    href: "/mission/yolo",
    kind: "pluto",
    colorA: "#d6d3d1",
    colorB: "#57534e",
    radius: 0.14,
    distance: 11.0,
    orbitDays: 90560,
    rotationDays: -6.387,
    startAngle: 3.35,
    axialTiltDeg: 122.5,
  },
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeTexture(kind: Planet["kind"], colorA: string, colorB: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(kind.length * 137 + colorA.length * 71);

  const base = ctx.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, colorA);
  base.addColorStop(0.5, colorB);
  base.addColorStop(1, colorA);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (kind === "mercury" || kind === "pluto") {
    for (let i = 0; i < 950; i++) {
      const x = rand() * canvas.width;
      const y = rand() * canvas.height;
      const r = 3 + rand() * 22;
      ctx.globalAlpha = 0.08 + rand() * 0.18;
      ctx.fillStyle = rand() > 0.5 ? "#ffffff" : "#111827";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (kind === "venus") {
    for (let i = 0; i < 160; i++) {
      const y = rand() * canvas.height;
      ctx.globalAlpha = 0.1 + rand() * 0.18;
      ctx.strokeStyle = "#fff1a8";
      ctx.lineWidth = 8 + rand() * 20;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.lineTo(x, y + Math.sin(x * 0.01 + i) * (20 + rand() * 24));
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  if (kind === "earth") {
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 42; i++) {
      const cx = rand() * canvas.width;
      const cy = rand() * canvas.height;
      const rx = 70 + rand() * 230;
      const ry = 35 + rand() * 110;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      g.addColorStop(0, "#16a34a");
      g.addColorStop(0.56, "#166534");
      g.addColorStop(1, "rgba(22,101,52,0)");

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < 18; i++) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.ellipse(
        rand() * canvas.width,
        rand() > 0.5 ? 80 + rand() * 120 : 820 + rand() * 120,
        100 + rand() * 180,
        20 + rand() * 40,
        rand() * Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (kind === "mars") {
    for (let i = 0; i < 260; i++) {
      ctx.globalAlpha = 0.08 + rand() * 0.18;
      ctx.fillStyle = rand() > 0.45 ? "#fed7aa" : "#431407";
      ctx.beginPath();
      ctx.ellipse(
        rand() * canvas.width,
        rand() * canvas.height,
        20 + rand() * 120,
        10 + rand() * 50,
        rand() * Math.PI,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  if (kind === "jupiter" || kind === "saturn" || kind === "neptune" || kind === "uranus") {
    for (let y = 0; y < canvas.height; y += 24) {
      const stripe = ctx.createLinearGradient(0, y, canvas.width, y + 22);
      stripe.addColorStop(0, colorA);
      stripe.addColorStop(0.5, rand() > 0.5 ? colorB : colorA);
      stripe.addColorStop(1, colorB);

      ctx.globalAlpha = 0.22 + rand() * 0.34;
      ctx.fillStyle = stripe;
      ctx.fillRect(0, y, canvas.width, 14 + rand() * 28);
    }

    if (kind === "jupiter") {
      ctx.globalAlpha = 0.78;
      const spot = ctx.createRadialGradient(1380, 565, 8, 1380, 565, 120);
      spot.addColorStop(0, "#fca5a5");
      spot.addColorStop(0.5, "#b45309");
      spot.addColorStop(1, "rgba(180,83,9,0)");
      ctx.fillStyle = spot;
      ctx.beginPath();
      ctx.ellipse(1380, 565, 150, 72, -0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function makeCloudTexture(seed = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(seed);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 520; i++) {
    const x = rand() * canvas.width;
    const y = rand() * canvas.height;
    const w = 35 + rand() * 150;
    const h = 8 + rand() * 32;

    const g = ctx.createRadialGradient(x, y, 0, x, y, w);
    g.addColorStop(0, "rgba(255,255,255,0.42)");
    g.addColorStop(0.45, "rgba(255,255,255,0.18)");
    g.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function makeSunTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(999);

  const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  base.addColorStop(0, "#ffcf33");
  base.addColorStop(0.35, "#ff6b00");
  base.addColorStop(0.7, "#f43f00");
  base.addColorStop(1, "#7c1d00");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 1200; i++) {
    const x = rand() * canvas.width;
    const y = rand() * canvas.height;
    const r = 10 + rand() * 70;

    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,180,0.58)");
    g.addColorStop(0.36, "rgba(255,120,0,0.28)");
    g.addColorStop(1, "rgba(120,20,0,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function Sun() {
  const sunTexture = useMemo(() => makeSunTexture(), []);
  const sunRef = useRef<THREE.Mesh>(null);
  const plasmaRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
      sunRef.current.rotation.x += delta * 0.014;
    }

    if (plasmaRef.current) {
      plasmaRef.current.rotation.y -= delta * 0.2;
      plasmaRef.current.rotation.z += delta * 0.03;
    }

    sunTexture.offset.x += delta * 0.006;

    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.035;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={9} distance={45} color="#ffb347" />

      <mesh ref={glowRef}>
        <sphereGeometry args={[1.42, 96, 96]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.17}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={sunRef}>
        <sphereGeometry args={[0.92, 128, 128]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>

      <mesh ref={plasmaRef}>
        <sphereGeometry args={[0.95, 128, 128]} />
        <meshBasicMaterial
          map={sunTexture}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <Html center distanceFactor={8}>
        <div className="sunLabel3d">
          <strong>AI</strong>
          <span>CORE</span>
        </div>
      </Html>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} renderOrder={0}>
      <torusGeometry args={[radius, 0.004, 8, 256]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.11}
        depthTest
        depthWrite={false}
      />
    </mesh>
  );
}

function Atmosphere({
  radius,
  color,
  opacity,
}: {
  radius: number;
  color: string;
  opacity: number;
}) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.05, 96, 96]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function CloudLayer({
  radius,
  rotationSpeed,
  seed,
}: {
  radius: number;
  rotationSpeed: number;
  seed: number;
}) {
  const texture = useMemo(() => makeCloudTexture(seed), [seed]);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed * 1.18;
    }
    texture.offset.x += delta * rotationSpeed * 0.018;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius * 1.025, 96, 96]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </mesh>
  );
}

function GasLayer({
  radius,
  color,
  rotationSpeed,
}: {
  radius: number;
  color: string;
  rotationSpeed: number;
}) {
  const texture = useMemo(() => makeTexture("jupiter", "#ffffff", color), [color]);
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * rotationSpeed * 0.42;
    }
    texture.offset.x += delta * rotationSpeed * 0.02;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius * 1.012, 96, 96]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.12}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function SaturnRing({ radius }: { radius: number }) {
  return (
    <group rotation={[Math.PI / 2.55, 0, 0]}>
      <mesh>
        <ringGeometry args={[radius * 1.45, radius * 2.55, 192]} />
        <meshBasicMaterial
          color="#e8d7aa"
          transparent
          opacity={0.58}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[radius * 1.85, radius * 1.95, 192]} />
        <meshBasicMaterial
          color="#fff7d6"
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function PlanetMesh({ planet, index }: { planet: Planet; index: number }) {
  const texture = useMemo(
    () => makeTexture(planet.kind, planet.colorA, planet.colorB),
    [planet.kind, planet.colorA, planet.colorB]
  );

  const pivotRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const orbitAngularSpeed =
    (Math.PI * 2 * ORBIT_DAYS_PER_SECOND) / planet.orbitDays;

  const rotationAngularSpeed =
    (Math.PI * 2 * ROTATION_DAYS_PER_SECOND) / Math.abs(planet.rotationDays) *
    Math.sign(planet.rotationDays);

  useFrame((state, delta) => {
    if (pivotRef.current) {
      pivotRef.current.rotation.y += delta * orbitAngularSpeed;
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationAngularSpeed;
      planetRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.025;
    }

    texture.offset.x += delta * rotationAngularSpeed * 0.006;
  });

  return (
    <group ref={pivotRef} rotation={[0, planet.startAngle, 0]}>
      <group position={[planet.distance, 0, 0]}>
        <group rotation={[0, 0, THREE.MathUtils.degToRad(planet.axialTiltDeg)]}>
          <mesh
            ref={planetRef}
            renderOrder={2}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHovered(false);
              document.body.style.cursor = "default";
            }}
            onClick={() => {
              window.location.href = planet.href;
            }}
          >
            <sphereGeometry args={[planet.radius, 96, 96]} />
            <meshStandardMaterial
              map={texture}
              color="#ffffff"
              roughness={0.62}
              metalness={0.02}
            />
          </mesh>

          {planet.atmosphere && (
            <Atmosphere
              radius={planet.radius}
              color={planet.atmosphere}
              opacity={planet.atmosphereOpacity ?? 0.1}
            />
          )}

          {planet.cloud && (
            <CloudLayer
              radius={planet.radius}
              rotationSpeed={rotationAngularSpeed}
              seed={index * 941 + 12}
            />
          )}

          {planet.gasLayer && (
            <GasLayer
              radius={planet.radius}
              color={planet.colorA}
              rotationSpeed={rotationAngularSpeed}
            />
          )}

          {planet.ring && <SaturnRing radius={planet.radius} />}

          {hovered && (
            <mesh>
              <sphereGeometry args={[planet.radius * 1.18, 64, 64]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>

        <Html
          position={[0, planet.radius + 0.35, 0]}
          center
          distanceFactor={7.5}
          occlude={false}
        >
          <div className={hovered ? "planetLabel3d active" : "planetLabel3d"}>
            <strong>{planet.ko}</strong>
            <span>{planet.sector}</span>
          </div>
        </Html>
      </group>
    </group>
  );
}

function SolarScene() {
  return (
    <>
      <color attach="background" args={["#020617"]} />

      <ambientLight intensity={0.42} />
      <directionalLight position={[5, 6, 5]} intensity={2.0} color="#ffffff" />

      <Stars
        radius={120}
        depth={80}
        count={14000}
        factor={5.2}
        saturation={0}
        fade
        speed={0.4}
      />

      <group rotation={[0.05, 0, 0]}>
        <Sun />

        {planets.map((planet) => (
          <OrbitRing key={planet.name} radius={planet.distance} />
        ))}

        {planets.map((planet, index) => (
          <PlanetMesh key={planet.name} planet={planet} index={index} />
        ))}
      </group>

      <OrbitControls
        makeDefault
        enableRotate
        enableZoom
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.82}
        zoomSpeed={0.72}
        minDistance={6}
        maxDistance={18}
        target={[0, 0, 0]}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE,
        }}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
      />
    </>
  );
}

export default function SolarSystem3D() {
  return (
    <Canvas
      camera={{ position: [0, 7.5, 11.5], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      onCreated={({ gl }) => {
        gl.setClearColor("#020617", 0);
      }}
    >
      <Suspense fallback={null}>
        <SolarScene />
      </Suspense>
    </Canvas>
  );
}