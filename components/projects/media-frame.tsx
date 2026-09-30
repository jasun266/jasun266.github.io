"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import type { Project } from "@/lib/data";
import type { Media } from "@/lib/media";
import { cn } from "@/lib/utils";

// Browser-window frame around a project's demo video, or an on-brand
// animated mock when no footage has been captured yet.
export function MediaFrame({
  project,
  media,
  active = false,
  mobile = false,
  className,
}: {
  project: Project;
  media: Media;
  active?: boolean;
  mobile?: boolean;
  className?: string;
}) {
  const url = new URL(project.demoUrl);
  return (
    <div
      className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-lift", className)}
      style={{ "--tone": `var(--${project.accent})` } as React.CSSProperties}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2.5 rounded-full bg-foreground/15" />
        ))}
        <span className="mx-auto truncate rounded-full bg-muted px-3 py-0.5 font-mono text-[11px] text-muted-foreground">
          {url.host + url.pathname.replace(/\/$/, "")}
        </span>
        <span className="w-9" />
      </div>
      <div className={cn("relative overflow-hidden", mobile ? "aspect-390/844" : "aspect-16/10")}>
        <div data-parallax className="absolute inset-y-0 right-[-6%] left-[-6%]">
          {media.webm || media.mp4 ? (
            <DemoVideo media={media} title={project.title} active={active} />
          ) : (
            <Mock title={project.title} />
          )}
        </div>
      </div>
    </div>
  );
}

// Plays while on screen or hovered; never autoplays under reduced motion.
function DemoVideo({ media, title, active }: { media: Media; title: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if ((inView || active) && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView, active, reduce]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={media.poster}
      controls={!!reduce}
      aria-label={`${title} walkthrough`}
      className="size-full object-cover object-top"
    >
      {media.webm && <source src={media.webm} type="video/webm" />}
      {media.mp4 && <source src={media.mp4} type="video/mp4" />}
    </video>
  );
}

function Mock({ title }: { title: string }) {
  return (
    <div aria-hidden className="@container absolute inset-0 overflow-hidden bg-background">
      <div className="float-slow absolute -top-1/3 -right-1/4 size-[80%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--tone)_45%,transparent),transparent)]" />
      <div className="float-slow absolute -bottom-1/2 -left-1/4 size-[70%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--tone)_25%,transparent),transparent)] [animation-delay:-4.5s]" />
      <div className="grid-lines absolute inset-0 opacity-70" />
      <div className="absolute inset-x-[12%] top-[13%] grid h-[46%] grid-cols-[1fr_2.4fr] gap-[5%]">
        <div className="space-y-3">
          {["w-3/4", "w-full", "w-2/3", "w-5/6", "w-1/2"].map((w, i) => (
            <div key={i} className={cn("shimmer h-2.5 rounded-full", w)} />
          ))}
        </div>
        <div className="grid grid-cols-3 content-start gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="shimmer aspect-4/3 rounded-lg" />
          ))}
        </div>
      </div>
      <p className="absolute right-[12%] bottom-[9%] left-[12%] font-display text-[min(7cqw,3.25rem)] leading-[0.95] font-semibold tracking-tight text-balance">
        {title}
        <span className="text-(--tone)">.</span>
      </p>
    </div>
  );
}
