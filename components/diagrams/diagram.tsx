"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Accent } from "@/lib/data";
import { cn } from "@/lib/utils";

export type DiagramNode = {
  id: string;
  x: number;
  y: number;
  w: number;
  label: string;
  sub?: string;
  tone?: "accent" | "dashed";
};
// Either connect two nodes (auto-routed) or give a custom path `d` with a label position `at`.
export type DiagramEdge = {
  from?: string;
  to?: string;
  d?: string;
  at?: [number, number];
  label?: string;
  dashed?: boolean;
};

const H = 56; // node height

// Straight line where two nodes overlap, otherwise an orthogonal elbow.
function route(a: DiagramNode, b: DiagramNode) {
  if (b.y >= a.y + H || b.y + H <= a.y) {
    const down = b.y > a.y;
    const sy = down ? a.y + H : a.y;
    const ey = down ? b.y : b.y + H;
    const lo = Math.max(a.x, b.x);
    const hi = Math.min(a.x + a.w, b.x + b.w);
    if (hi - lo >= 24) {
      const x = (lo + hi) / 2;
      return { d: `M${x} ${sy}V${ey}`, at: [x + 8, (sy + ey) / 2] as const, anchor: "start" as const };
    }
    const sx = a.x + a.w / 2;
    const ex = b.x + b.w / 2;
    const my = (sy + ey) / 2;
    return { d: `M${sx} ${sy}V${my}H${ex}V${ey}`, at: [ex + 8, (my + ey) / 2] as const, anchor: "start" as const };
  }
  const right = b.x > a.x;
  const sx = right ? a.x + a.w : a.x;
  const ex = right ? b.x : b.x + b.w;
  const y = Math.max(a.y, b.y) + H / 2;
  return { d: `M${sx} ${y}H${ex}`, at: [(sx + ex) / 2, y - 8] as const, anchor: "middle" as const };
}

// Architecture diagram: nodes rise in, lines draw on scroll, then packets flow along them.
export function Diagram({
  id,
  title,
  width,
  height,
  nodes,
  edges,
  accent = "violet",
}: {
  id: string;
  title: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  accent?: Accent;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [live, setLive] = useState(false);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const paths = edges.map((e) =>
    e.d
      ? { ...e, d: e.d, at: e.at ?? ([0, 0] as const), anchor: "start" as const }
      : { ...e, ...route(byId[e.from!], byId[e.to!]) },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const svg = ref.current!;
        gsap.set(svg, { attr: { "data-drawing": "" } });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: svg, start: "top 80%", once: true },
          onComplete: () => setLive(true),
        });
        tl.from("[data-node]", { opacity: 0, y: 14, duration: 0.7, ease: "expo.out", stagger: 0.07 });
        gsap.utils.toArray<SVGPathElement>("[data-edge]").forEach((edge, i) => {
          const at = 0.35 + i * 0.1;
          if (edge.dataset.dashed !== undefined) tl.from(edge, { opacity: 0, duration: 0.6 }, at);
          else tl.from(edge, { drawSVG: "0%", duration: 0.6, ease: "power2.inOut" }, at);
          tl.set(edge, { attr: { "data-drawn": "" } }, at + 0.6);
        });
        tl.from("[data-edge-label]", { opacity: 0, duration: 0.4, stagger: 0.05 }, "-=0.3");
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={title}
      className="diagram h-auto w-full font-mono"
      style={{ "--tone": `var(--${accent})` } as React.CSSProperties}
    >
      <defs>
        <marker
          id={`${id}-arrow`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 1L9 5L0 9z" className="fill-muted-foreground" />
        </marker>
      </defs>

      {paths.map((p, i) => (
        <path
          key={i}
          data-edge
          data-dashed={p.dashed ? "" : undefined}
          d={p.d}
          fill="none"
          markerEnd={`url(#${id}-arrow)`}
          strokeWidth={1.25}
          strokeDasharray={p.dashed ? "4 4" : undefined}
          className="stroke-muted-foreground/60"
        />
      ))}

      {paths.map(
        (p, i) =>
          p.label && (
            <text
              key={i}
              data-edge-label
              x={p.at[0]}
              y={p.at[1]}
              textAnchor={p.anchor}
              dominantBaseline="central"
              className="fill-muted-foreground text-[11px]"
            >
              {p.label}
            </text>
          ),
      )}

      {live &&
        paths.map(
          (p, i) =>
            !p.dashed && (
              <circle key={i} r={3} className="packet fill-(--tone)">
                <animateMotion
                  dur={`${2 + (i % 3) * 0.45}s`}
                  begin={`${(i * 0.37) % 1.2}s`}
                  repeatCount="indefinite"
                  path={p.d}
                />
              </circle>
            ),
        )}

      {nodes.map((n) => (
        <g key={n.id} data-node>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={H}
            rx={12}
            strokeWidth={1.25}
            strokeDasharray={n.tone === "dashed" ? "4 4" : undefined}
            className={cn(
              "fill-card stroke-border",
              n.tone === "accent" && "stroke-(--tone) [fill:color-mix(in_oklab,var(--tone)_12%,var(--card))]",
              n.tone === "dashed" && "stroke-muted-foreground/50",
            )}
          />
          <text
            x={n.x + n.w / 2}
            y={n.y + (n.sub ? 22 : H / 2)}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-foreground text-[14px] font-medium"
          >
            {n.label}
          </text>
          {n.sub && (
            <text
              x={n.x + n.w / 2}
              y={n.y + 38}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground text-[11px]"
            >
              {n.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
