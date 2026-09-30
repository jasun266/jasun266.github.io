"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger stays in sync.
// Lenis honours prefers-reduced-motion itself (respectReducedMotion defaults to true).
export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const pathname = usePathname();

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    const tick = (time: number) => lenis?.raf(time * 1000);
    const off = lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      off?.();
      gsap.ticker.remove(tick);
    };
  }, []);

  // New route: start at the top (or the hash target) and re-measure triggers.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    const hash = window.location.hash;
    lenis?.scrollTo(hash && document.querySelector(hash) ? hash : 0, { immediate: true, force: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1 }} />
      {children}
    </MotionConfig>
  );
}
