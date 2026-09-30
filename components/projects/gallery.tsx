"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/data";
import type { Media } from "@/lib/media";
import { Eyebrow, SplitHeading } from "@/components/motion/split-heading";
import { ProjectCard } from "./project-card";

export function ProjectGallery({ items }: { items: { project: Project; media: Media }[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop: pin the section and turn vertical scroll into a horizontal ride.
      // Smaller screens and reduced motion get the plain vertical stack.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - document.documentElement.clientWidth;
        const ride = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (st) => gsap.set(bar.current, { scaleX: st.progress }),
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: media.parentElement,
                containerAnimation: ride,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
    },
    { scope: section },
  );

  return (
    <section id="work" ref={section} className="relative overflow-hidden lg:motion-safe:h-svh">
      <div
        ref={track}
        className="flex flex-col gap-10 px-5 py-28 sm:px-8 sm:py-40 lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-12 lg:motion-safe:py-0 lg:motion-safe:pt-16 lg:motion-safe:pr-[12vw] lg:motion-safe:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        <header className="max-w-xl shrink-0 lg:motion-safe:w-[26rem]">
          <Eyebrow index="02">Selected work</Eyebrow>
          <SplitHeading className="lg:text-6xl">Live products, built end to end.</SplitHeading>
          <p className="mt-6 text-muted-foreground">
            Production platforms I&apos;ve designed, built and shipped. Open one for the architecture behind it.
          </p>
          <div className="mt-10 hidden items-center gap-4 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase lg:motion-safe:flex">
            <span>Scroll</span>
            <span className="relative h-px w-40 overflow-hidden bg-border">
              <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-primary" />
            </span>
            <span>{String(items.length).padStart(2, "0")}</span>
          </div>
        </header>
        {items.map(({ project, media }, i) => (
          <ProjectCard key={project.slug} project={project} media={media} index={i} />
        ))}
      </div>
    </section>
  );
}
