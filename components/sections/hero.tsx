import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site, skills, stats } from "@/lib/data";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroConsole } from "@/components/hero/hero-console";
import { HeroScene } from "@/components/hero/hero-scene";
import { HeroStage } from "@/components/hero/hero-stage";
import { RoleLine } from "@/components/hero/role-line";

const words = site.name.split(" ");
const lines = [words.slice(0, -1), words.slice(-1)];
const vars = (v: Record<string, number>) => v as React.CSSProperties;
// Skills backed by real projects "install" around the editor during the scroll scene.
const tokens = skills
  .flatMap((g) => g.items)
  .filter((i) => i.usedIn)
  .slice(0, 10)
  .map((i) => i.name);
const statSpots = [
  "left-[4%] top-[10%] sm:left-[6%] sm:top-[22%]",
  "right-[4%] top-[10%] sm:right-[6%] sm:top-[18%]",
  "left-[4%] bottom-[6%] sm:left-[10%] sm:bottom-[16%]",
  "right-[4%] bottom-[6%] sm:right-[8%] sm:bottom-[20%]",
];

// Layers, back to front: aurora + floor, the name, scene extras (hidden until
// HeroStage's scroll scene reveals them), then the UI. data-hero hooks drive the scene.
export function Hero() {
  return (
    <HeroStage>
      <div aria-hidden className="absolute inset-0 -z-10 perspective-[1000px]">
        <div className="aurora absolute inset-[-10%]" />
        <div data-hero="floor" className="grid-lines absolute inset-0 origin-bottom opacity-70" />
        <HeroScene />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background" />
      </div>

      {/* The live editor: types itself out as you scroll; the scene brings it to centre stage. */}
      <div
        data-hero="console"
        className="absolute top-[8svh] right-5 left-5 z-25 sm:right-8 sm:left-auto sm:w-108 lg:top-[15%] lg:right-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:w-120"
      >
        <div aria-hidden className="halo absolute top-1/2 left-1/2 -z-10 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="hero-fade" style={vars({ "--d": 1 })}>
          <HeroConsole />
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute top-[46%] left-1/2">
        {tokens.map((t, i) => (
          <span
            key={t}
            data-hero="token"
            className={`glass invisible absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 font-mono text-xs whitespace-nowrap opacity-0 sm:text-sm ${i % 2 ? "z-5" : "z-30"}`}
          >
            <span className="text-cyan">+ </span>
            {t}
          </span>
        ))}
      </div>
      {stats.map((s, i) => (
        <div
          key={s.label}
          aria-hidden
          data-hero="stat"
          className={`glass invisible absolute z-20 max-w-[44%] rounded-2xl px-4 py-3 opacity-0 sm:max-w-none sm:px-5 sm:py-4 ${statSpots[i]}`}
        >
          <p className="font-display text-2xl font-semibold tracking-tight tabular-nums sm:text-4xl">
            {s.value}
            <span className="text-primary">{s.suffix}</span>
          </p>
          <p className="mt-1 max-w-36 text-xs text-muted-foreground sm:max-w-44 sm:text-sm">{s.label}</p>
        </div>
      ))}

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pt-24 pb-8 sm:px-8 sm:pb-10">
        <div data-hero="ui" className="relative z-30 mb-6">
          <p
            className="hero-fade glass hidden w-fit items-center gap-2.5 rounded-full sm:inline-flex px-3.5 py-1.5 text-xs text-muted-foreground sm:text-sm"
            style={vars({ "--d": 0 })}
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-70" />
              <span className="relative size-2 rounded-full bg-cyan" />
            </span>
            {site.role}
          </p>
        </div>

        <h1
          data-hero="names"
          className="relative z-20 font-display text-[clamp(3.5rem,min(15.5vw,21svh),14rem)] leading-[0.84] font-semibold tracking-[-0.055em]"
        >
          {lines.map((line, li) => (
            <span
              key={li}
              data-hero={`line-${li + 1}`}
              className={`block overflow-hidden pt-[0.1em] pb-[0.04em] ${li ? "pl-[0.9em] sm:pl-[1.6em] lg:pl-[1em]" : ""}`}
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

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div data-hero="ui" className="relative z-30 max-w-md">
            <div className="hero-fade" style={vars({ "--d": 1 })}>
              <RoleLine roles={site.roles} />
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Taking production web apps from architecture to deployment and long-term maintenance.
              </p>
            </div>
          </div>
          <div data-hero="ui" className="relative z-30">
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
        </div>

        <div data-hero="ui" className="relative z-30 mt-8">
          <div
            className="hero-fade flex items-center justify-between border-t border-border pt-5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase"
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
      </div>
    </HeroStage>
  );
}
