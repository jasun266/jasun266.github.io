"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

// Section heading whose words rise out of masked lines when scrolled into view.
export function SplitHeading({
  children,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(ref.current, {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 115,
              rotate: 4,
              duration: 1,
              ease: "expo.out",
              stagger: 0.045,
              scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag
      ref={ref}
      className={cn(
        "font-display text-4xl leading-[0.95] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

// Small mono eyebrow above a heading: "01 — About".
export function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
      <span className="text-primary">{index}</span>
      <span aria-hidden className="h-px w-8 bg-border" />
      {children}
    </p>
  );
}
