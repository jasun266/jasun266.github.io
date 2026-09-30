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

  // New route or reload: once the pinned sections exist, re-measure and jump to the
  // top (or the hash target). The browser's own restore runs before the pins and
  // makes the page jump, so it's switched off in the <head> script.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const target = document.getElementById(window.location.hash.slice(1));
      const y = target ? target.getBoundingClientRect().top + window.scrollY - 80 : 0;
      const lenis = lenisRef.current?.lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, anchors: { offset: -80 } }} />
      {children}
    </MotionConfig>
  );
}
