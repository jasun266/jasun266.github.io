"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Custom cursor: a dot + trailing ring. Any element with data-cursor="Label"
// swaps the ring for a labelled pill ("View", "Play"). Mouse-only; skipped on touch.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    const hide = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const show = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        show();
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const labelled = el?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? "");
      setHovering(!!el?.closest("a, button, [role='button'], input, textarea, label"));
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", hide);
    document.addEventListener("pointerenter", show);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerenter", show);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] print:hidden">
      <div
        ref={dot}
        style={{ opacity: 0 }}
        className="absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-foreground mix-blend-difference"
      />
      <div ref={ring} style={{ opacity: 0 }} className="absolute top-0 left-0">
        {/* Hollow ring, label hung below it: the cursor never hides what's under the pointer. */}
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/40 transition-[width,height,border-color] duration-300 ease-out-expo"
          style={{
            width: label ? 64 : hovering ? 56 : 34,
            height: label ? 64 : hovering ? 56 : 34,
            borderColor: label ? "var(--violet)" : undefined,
          }}
        />
        {label && (
          <span className="absolute top-10 left-0 -translate-x-1/2 rounded-full bg-background/75 px-2.5 py-1 font-mono text-[10px] tracking-widest whitespace-nowrap text-primary uppercase backdrop-blur-sm">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
