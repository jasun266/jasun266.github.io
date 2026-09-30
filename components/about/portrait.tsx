"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/data";

// Portrait that wipes open when it enters, then drifts with the scroll.
export function Portrait() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ref.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          "img",
          { yPercent: -7, scale: 1.15 },
          {
            yPercent: 7,
            scale: 1.15,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <figure className="relative">
      <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted">
        <picture>
          <source srcSet="/images/jasun.avif" type="image/avif" />
          <img
            src="/images/jasun.webp"
            width={720}
            height={900}
            alt="Portrait of Shah Ul Jasun"
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </picture>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
      </div>
      <figcaption className="absolute inset-x-5 bottom-5 flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-white/85 uppercase">
        <span>{site.name}</span>
        <span>Dhaka, BD</span>
      </figcaption>
      <div
        aria-hidden
        className="absolute -inset-3 -z-10 rounded-[2.4rem] border border-border mask-[linear-gradient(to_bottom,black,transparent_70%)]"
      />
    </figure>
  );
}
