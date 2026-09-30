"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector2, type ShaderMaterial } from "three";
import { cn } from "@/lib/utils";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

// Domain-warped noise in the brand colours; the cursor bends the flow and leaves a glow.
const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uRes;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.02 + 17.3;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 p = (vUv - 0.5) * aspect;
  vec2 d = p - (uMouse - 0.5) * aspect;
  float glow = exp(-dot(d, d) * 7.0);
  p += d * glow * 0.35;

  float t = uTime * 0.045;
  vec2 q = vec2(fbm(p * 1.3 + vec2(t, -t)), fbm(p * 1.3 + vec2(5.2 - t, 1.3 + t)));
  float n = fbm(p * 1.7 + q * 1.8 + vec2(t * 1.6, t * 0.4));

  vec3 col = mix(vec3(0.741, 0.576, 0.976), vec3(0.545, 0.914, 0.992), smoothstep(0.35, 0.75, q.x));
  col = mix(col, vec3(1.0, 0.475, 0.776), smoothstep(0.5, 0.85, q.y) * 0.75);

  float a = smoothstep(0.45, 0.95, n) * 0.7 + glow * 0.22;
  a *= smoothstep(-0.2, 0.9, vUv.x * 0.6 + vUv.y * 0.8); // calm behind the headline (bottom-left)
  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
}`;

function Aurora({ pointer }: { pointer: React.RefObject<Vector2> }) {
  const material = useRef<ShaderMaterial>(null);
  const size = useThree((s) => s.size);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.7, 0.6) },
      uRes: { value: new Vector2(1, 1) },
    }),
    [],
  );

  useFrame((_, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;
    u.uMouse.value.lerp(pointer.current, 0.05);
    u.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef(new Vector2(0.7, 0.6));
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div
      ref={wrap}
      className={cn(
        "absolute inset-0 transition-opacity duration-2000",
        ready ? "opacity-50 dark:opacity-100" : "opacity-0",
      )}
    >
      {/* Soft noise needs few pixels: a low dpr keeps it cheap on any GPU. */}
      <Canvas
        dpr={0.75}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        onCreated={() => setReady(true)}
      >
        <Aurora pointer={pointer} />
      </Canvas>
    </div>
  );
}
