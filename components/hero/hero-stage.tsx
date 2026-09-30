"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Pins the hero for a scroll-scrubbed "build": the name parts like curtains, the
// floor tilts, the live editor takes centre stage while its code types itself,
// production skills install around it, then the key numbers pop in like test
// results. Reduced motion keeps the static hero.
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = ref.current!;
        const q = gsap.utils.selector(section);
        const editor = q("[data-hero=console]")[0] as HTMLElement;
        // offset* ignores transforms, so these stay right on every refresh.
        const toCentreX = () => section.offsetWidth / 2 - (editor.offsetLeft + editor.offsetWidth / 2);
        const toCentreY = () => section.offsetHeight * 0.46 - (editor.offsetTop + editor.offsetHeight / 2);
        const small = () => innerWidth < 640;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(q("[data-hero=ui]"), { autoAlpha: 0, y: -50, stagger: 0.03, duration: 0.2 }, 0)
          .to(q("[data-hero=line-1]"), { xPercent: -65, autoAlpha: 0, duration: 0.4 }, 0.02)
          .to(q("[data-hero=line-2]"), { xPercent: 65, autoAlpha: 0, duration: 0.4 }, 0.02)
          .to(q("[data-hero=floor]"), { rotateX: 64, yPercent: 12, duration: 0.5, ease: "power1.inOut" }, 0)
          .to(
            editor,
            { x: toCentreX, y: toCentreY, scale: () => (small() ? 0.92 : 1.08), duration: 0.35, ease: "power1.inOut" },
            0.04,
          );

        q("[data-hero=token]").forEach((token, i, all) => {
          const angle = (i / all.length) * Math.PI * 2 - Math.PI / 2;
          const orbit = (k: number) => ({
            x: () => Math.cos(angle) * (small() ? innerWidth * 0.3 : Math.min(innerWidth * 0.46, Math.max(innerWidth * 0.3, editor.offsetWidth * 0.66))) * k,
            // Phones: the editor is nearly full width, so skills fill bands above and below it.
            y: () =>
              (small()
                ? (Math.sin(angle) >= 0 ? 1 : -1) * (editor.offsetHeight * 0.62 + Math.abs(Math.sin(angle)) * 70)
                : Math.sin(angle) * Math.max(innerHeight * 0.32, editor.offsetHeight * 0.7)) * k,
          });
          tl.fromTo(
            token,
            { x: 0, y: 0, scale: 0.4, autoAlpha: 0 },
            { ...orbit(1), scale: 1, autoAlpha: 1, duration: 0.25, ease: "power2.out" },
            0.2 + i * 0.018,
          ).to(token, { ...orbit(1.9), scale: 1.25, autoAlpha: 0, duration: 0.25, ease: "power1.in" }, 0.55 + i * 0.012);
        });

        tl.fromTo(
          q("[data-hero=stat]"),
          { autoAlpha: 0, y: 40, scale: 0.92 },
          { autoAlpha: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.18, ease: "power2.out" },
          0.68,
        ).to({}, { duration: 0.12 }); // brief hold before the pin releases

        // This pin adds scroll space above every later trigger (the Work gallery
        // pins too), so re-measure them all in page order.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        // Pointer depth: the name drifts against the cursor.
        const nx = gsap.quickTo(q("[data-hero=names]")[0], "x", { duration: 0.8, ease: "power3" });
        const move = (e: PointerEvent) => {
          if (e.pointerType === "mouse") nx((e.clientX / innerWidth - 0.5) * -16);
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: ref },
  );

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {children}
    </section>
  );
}
