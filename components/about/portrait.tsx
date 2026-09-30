"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/data";

// Cut-out portrait standing in a living aurora. The card wipes open on entry;
// the backdrop and the figure move at different speeds (scroll and pointer) for depth.
export function Portrait() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const card = ref.current!;
        gsap.fromTo(
          card,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          },
        );
        const scrub = { trigger: card, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo("[data-depth=bg]", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: scrub });
        gsap.fromTo(
          "[data-depth=fg]",
          { yPercent: 6, scale: 1.05 },
          { yPercent: -2, scale: 1, ease: "none", scrollTrigger: { ...scrub } },
        );

        const fx = gsap.quickTo("[data-depth=fg]", "x", { duration: 0.8, ease: "power3" });
        const bx = gsap.quickTo("[data-depth=bg]", "x", { duration: 0.8, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5;
          fx(dx * 16);
          bx(dx * -12);
        };
        const leave = () => {
          fx(0);
          bx(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        return () => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <figure className="relative">
      <div ref={ref} className="relative aspect-4/5 overflow-hidden rounded-[2rem] border border-border bg-card">
        <div data-depth="bg" aria-hidden className="absolute inset-[-12%]">
          <div className="aurora absolute inset-0" />
          <div className="grid-lines absolute inset-0 opacity-80" />
        </div>
        <div aria-hidden className="halo absolute top-[10%] left-1/2 aspect-square w-[95%] -translate-x-1/2 rounded-full" />
        {/* eslint-disable-next-line @next/next/no-img-element -- static export; the WebP is already optimised */}
        <img
          data-depth="fg"
          src="/images/jasun-cutout.webp"
          width={585}
          height={1160}
          alt="Portrait of Shah Ul Jasun"
          loading="lazy"
          decoding="async"
          className="rim-light absolute bottom-0 left-1/2 h-[92%] w-auto max-w-none origin-bottom -translate-x-1/2"
        />
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
