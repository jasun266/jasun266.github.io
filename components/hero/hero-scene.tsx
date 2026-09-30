"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

// The WebGL aurora mounts only on capable devices, after first paint.
// The CSS .aurora underneath is the fallback everywhere else.
export function HeroScene() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const capable =
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !nav.connection?.saveData &&
      (nav.hardwareConcurrency ?? 0) >= 4 &&
      (matchMedia("(pointer: fine)").matches || innerWidth >= 768) &&
      !!document.createElement("canvas").getContext("webgl2");
    if (!capable) return;
    const t = setTimeout(() => setOn(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return on ? <HeroCanvas /> : null;
}
