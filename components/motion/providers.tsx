"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync.
// Lenis honours prefers-reduced-motion itself (respectReducedMotion defaults to true).
export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  // ReactLenis creates its instance after this effect runs, so look it up every frame.
  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(tick);
  }, []);

  useLenis(ScrollTrigger.update);

  // New route: start at the top (or the hash target) and re-measure triggers.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    const target = document.getElementById(window.location.hash.slice(1));
    lenis?.scrollTo(target ?? 0, { offset: target ? -80 : 0, immediate: true, force: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, anchors: { offset: -80 } }} />
      {children}
    </MotionConfig>
  );
}
