"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { experience } from "@/lib/data";
import { cn } from "@/lib/utils";

// Timeline whose line draws with the scroll; each role lights up and reveals as the line reaches it.
export function Timeline({ items, className }: { items: (typeof experience)[number][]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 70%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-item]").forEach((item) => {
          gsap.from(item.querySelectorAll("[data-reveal]"), {
            opacity: 0,
            y: 28,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: item, start: "top 75%", once: true },
          });
          ScrollTrigger.create({
            trigger: item,
            start: "top 70%",
            onEnter: () => item.setAttribute("data-on", ""),
            onLeaveBack: () => item.removeAttribute("data-on"),
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className={cn("relative", className)}>
      <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
      <span
        aria-hidden
        data-line
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-linear-to-b from-violet via-pink to-cyan"
      />
      {items.map((job) => (
        <li key={job.company} data-item className="group relative pb-20 pl-12 last:pb-0">
          <span
            aria-hidden
            className="absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-border bg-background transition-all duration-500 group-data-on:border-primary group-data-on:bg-primary group-data-on:shadow-[0_0_0_6px_color-mix(in_oklab,var(--primary)_20%,transparent)]"
          />
          <p data-reveal className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {job.period}
          </p>
          <h3 data-reveal className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {job.role}
          </h3>
          <p data-reveal className="mt-2 text-lg text-primary">
            {job.company}
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {job.points.map((point) => (
              <li
                key={point}
                data-reveal
                className="glass rounded-2xl p-4 text-sm leading-relaxed text-muted-foreground"
              >
                {point}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
