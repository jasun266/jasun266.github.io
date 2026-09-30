import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/data";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroScene } from "@/components/hero/hero-scene";
import { RoleLine } from "@/components/hero/role-line";

const words = site.name.split(" ");
const lines = [words.slice(0, -1), words.slice(-1)];
const vars = (v: Record<string, number>) => v as React.CSSProperties;

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora absolute inset-[-10%]" />
        <div className="grid-lines absolute inset-0 opacity-70" />
        <HeroScene />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-28 pb-8 sm:px-8 sm:pb-10">
        <p
          className="hero-fade glass mb-8 inline-flex w-fit items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground sm:text-sm"
          style={vars({ "--d": 0 })}
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-70" />
            <span className="relative size-2 rounded-full bg-cyan" />
          </span>
          {site.role}
        </p>

        <h1 className="font-display text-[clamp(4rem,15.5vw,14rem)] leading-[0.84] font-semibold tracking-[-0.055em]">
          {lines.map((line, li) => (
            <span
              key={li}
              className={`block overflow-hidden pt-[0.1em] pb-[0.04em] ${li ? "pl-[0.9em] sm:pl-[1.6em]" : ""}`}
            >
              {line.map((w, wi) => (
                <span key={w} className="hero-word" style={vars({ "--i": li * 2 + wi })}>
                  {li ? <span className="text-gradient">{w}</span> : w}
                  {wi < line.length - 1 && " "}
                </span>
              ))}
              {li === 1 && (
                <span className="hero-word text-primary" style={vars({ "--i": 3 })}>
                  .
                </span>
              )}
            </span>
          ))}
          <span className="sr-only">, {site.title}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="hero-fade max-w-md" style={vars({ "--d": 1 })}>
            <RoleLine roles={site.roles} />
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Taking production web apps from architecture to deployment and long-term maintenance.
            </p>
          </div>
          <div className="hero-fade flex flex-wrap gap-3" style={vars({ "--d": 2 })}>
            <Magnetic>
              <a
                href="#work"
                className="btn-fill inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
              >
                View work <ArrowDown className="size-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="btn-fill glass inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium"
              >
                Get in touch <ArrowUpRight className="size-4" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div
          className="hero-fade mt-12 flex items-center justify-between border-t border-border pt-5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
          style={vars({ "--d": 3 })}
        >
          <a href="#about" className="inline-flex items-center gap-3 transition-colors hover:text-foreground">
            <span className="relative h-8 w-px overflow-hidden bg-border">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-foreground" />
            </span>
            Scroll to explore
          </a>
          <span className="hidden sm:block">{site.location}</span>
        </div>
      </div>
    </section>
  );
}
