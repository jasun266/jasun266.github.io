"use client";

import Link from "next/link";
import { ViewTransition, useState } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data";
import type { Media } from "@/lib/media";
import { MediaFrame } from "./media-frame";

const spring = { stiffness: 180, damping: 18, mass: 0.4 };

export function ProjectCard({ project, media, index }: { project: Project; media: Media; index: number }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);

  return (
    <article
      data-cursor="View"
      className="group relative shrink-0 lg:motion-safe:w-[min(78vw,72rem)]"
      style={{ "--tone": `var(--${project.accent})` } as React.CSSProperties}
      onPointerEnter={() => setHover(true)}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
      }}
      onPointerLeave={() => {
        setHover(false);
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1400 }}
        className="grid items-center gap-6 rounded-[2rem] border border-border bg-card/70 p-3 transition-colors duration-500 group-hover:border-(--tone)/40 sm:p-4 lg:grid-cols-[1.45fr_1fr] lg:gap-10"
      >
        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <MediaFrame project={project} media={media} active={hover} />
        </ViewTransition>

        <div className="px-3 pb-4 lg:px-2 lg:py-4">
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            <span className="text-(--tone)">{String(index + 1).padStart(2, "0")}</span> / {project.kind}
          </p>
          <h3 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            <Link
              href={`/projects/${project.slug}/`}
              className="outline-none after:absolute after:inset-0 after:rounded-[2rem] focus-visible:after:ring-2 focus-visible:after:ring-ring"
            >
              {project.title}
            </Link>
          </h3>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-(--tone)" />
                {h}
              </li>
            ))}
          </ul>
          <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
            <span className="inline-flex items-center gap-2">
              Case study
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              className="relative z-10 inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              Live site <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </article>
  );
}
