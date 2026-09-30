"use client";

import { useEffect, useRef, useState } from "react";
import { Bug, Gamepad2, Play, Trophy } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { projects, site, skills, stats } from "@/lib/data";
import { cn } from "@/lib/utils";

// A tiny editor + terminal: the profile types itself out as code, visitors can
// run it, poke around with commands, or type `play` to squash bugs.

type Tok = [text: string, kind: keyof typeof tone];
const tone = {
  k: "text-pink",
  v: "text-foreground",
  f: "text-primary",
  s: "text-cyan",
  n: "text-pink",
  c: "text-muted-foreground italic",
  p: "text-foreground/60",
};
const liveProducts = stats.find((s) => s.label === "live products")?.value;
const shipped = skills.flatMap((g) => g.items).filter((i) => i.usedIn).map((i) => i.name);

const code: Tok[][] = [
  [["const ", "k"], ["jasun", "v"], [" = {", "p"]],
  [["  role", "f"], [": ", "p"], [`"${site.roles[1]}"`, "s"], [",", "p"]],
  [["  based", "f"], [": ", "p"], [`"${site.location.split(",")[1].trim()}"`, "s"], [",", "p"]],
  [["  stack", "f"], [": [", "p"], ['"Next.js"', "s"], [", ", "p"], ['"Laravel"', "s"], [", ", "p"], ['"PostgreSQL"', "s"], ["],", "p"]],
  [["  principles", "f"], [": [", "p"], ['"SOLID"', "s"], [", ", "p"], ['"DRY"', "s"], ["],", "p"]],
  [["  shipped", "f"], [": ", "p"], [String(liveProducts), "n"], [",", "p"], [" // live products", "c"]],
  [["};", "p"]],
  [["", "p"]],
  [["jasun", "v"], [".", "p"], ["ship", "s"], ["();", "p"], [" // ▶ run me", "c"]],
];
const chars = (lines: Tok[][]) => lines.reduce((n, line) => n + line.reduce((m, [t]) => m + t.length, 0) + 1, 0);
const total = chars(code);
const intro = chars(code.slice(0, 2)); // typed on load; scrolling types the rest

type Line = { text: string; kind?: "cmd" | "ok" | "err" };
const GAME_SECONDS = 20;
const BUGS = 6;

export function HeroConsole() {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const [autoTyped, setAutoTyped] = useState(0);
  const [scrollTyped, setScrollTyped] = useState(0);
  const built = useRef(false);
  const [lines, setLines] = useState<Line[]>([
    { text: "Scroll to build ↓" },
    { text: 'or type "help", or "play" to squash some bugs.' },
  ]);
  const [cmd, setCmd] = useState("");
  const [game, setGame] = useState<{ score: number; left: number } | null>(null);
  const [best, setBest] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const area = useRef<HTMLDivElement>(null);
  const bugEls = useRef<(HTMLButtonElement | null)[]>([]);
  const bugs = useRef<{ x: number; y: number; vx: number; vy: number; dead: number }[]>([]);
  const running = game !== null;

  const print = (...add: Line[]) => setLines((l) => [...l, ...add].slice(-40));
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
  const scrollTo = (id: string) => lenis?.scrollTo(id, { offset: -80 });

  // The first lines type themselves after the hero's intro...
  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      id = setInterval(() => setAutoTyped((n) => (n >= intro ? n : n + 1)), 28);
    }, 1500);
    return () => {
      clearTimeout(start);
      clearInterval(id);
    };
  }, []);

  // ...and scrolling writes the rest (scroll back up and it un-types). The hero
  // always sits at the top of the page, so scrollY is its progress.
  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(1, scrollY / (innerHeight * 0.9));
      setScrollTyped(Math.round(progress * total));
      if (progress === 1 && !built.current) {
        built.current = true;
        print({ text: "✓ build complete. Keep scrolling to explore the output ↓", kind: "ok" });
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    // Best score is a per-visitor nicety; storage may be blocked.
    later(0, () => {
      try {
        setBest(Number(localStorage.getItem("bug-best")) || 0);
      } catch {}
    });
    return () => pending.forEach(clearTimeout);
  }, []);

  const deploy = () => {
    print({ text: "▲ building jasun.ts…" });
    later(500, () => print({ text: "✓ types check out", kind: "ok" }));
    later(1000, () => print({ text: "✓ tests pass", kind: "ok" }));
    later(1600, () => print({ text: "✓ shipped. Scroll on to see what else has shipped.", kind: "ok" }));
  };

  const run = (raw: string) => {
    const c = raw.trim().toLowerCase();
    print({ text: `➜ ${raw}`, kind: "cmd" });
    if (!c) return;
    if (c === "help") print({ text: "whoami · projects · skills · run · play · contact · clear" });
    else if (c === "whoami") print({ text: `${site.name}. ${site.title}, ${site.role}.` });
    else if (c === "projects") print(...projects.map((p) => ({ text: `${p.title}: ${p.kind}` })));
    else if (c === "skills") print({ text: shipped.join(" · ") });
    else if (c === "run" || c === "jasun.ship()") deploy();
    else if (c === "play") startGame();
    else if (c === "contact") {
      print({ text: `${site.email}  (taking you there…)`, kind: "ok" });
      later(600, () => scrollTo("#contact"));
    } else if (c === "clear") setLines([]);
    else if (c.startsWith("sudo")) {
      if (c.includes("hire")) {
        print({ text: "[sudo] access granted. Opening the contact form…", kind: "ok" });
        later(800, () => scrollTo("#contact"));
      } else print({ text: "Nice try. This incident will be reported.", kind: "err" });
    } else if (c.startsWith("rm")) print({ text: "Not on my production server.", kind: "err" });
    else print({ text: `command not found: ${c}. Try "help".`, kind: "err" });
  };

  const startGame = () => {
    if (running) return;
    print({ text: `Bugs in the code! Click them. You have ${GAME_SECONDS}s.`, kind: "ok" });
    setGame({ score: 0, left: GAME_SECONDS });
  };

  // Game loop: bugs crawl over the code and bounce off the edges.
  useEffect(() => {
    if (!running) return;
    const el = area.current!;
    const speed = reduce ? 0 : 70;
    const spawn = () => {
      const a = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * (el.clientWidth - 28),
        y: Math.random() * (el.clientHeight - 28),
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        dead: 0,
      };
    };
    bugs.current = Array.from({ length: BUGS }, spawn);
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const w = el.clientWidth - 28;
      const h = el.clientHeight - 28;
      bugs.current.forEach((b, i) => {
        const node = bugEls.current[i];
        if (b.dead > 0) {
          b.dead -= dt;
          if (b.dead <= 0) {
            Object.assign(b, spawn());
            node?.removeAttribute("data-dead");
          }
        } else {
          if (Math.random() < dt * 0.8) {
            const turn = (Math.random() - 0.5) * 1.6;
            [b.vx, b.vy] = [b.vx * Math.cos(turn) - b.vy * Math.sin(turn), b.vx * Math.sin(turn) + b.vy * Math.cos(turn)];
          }
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          if (b.x < 0 || b.x > w) b.vx *= -1;
          if (b.y < 0 || b.y > h) b.vy *= -1;
          b.x = Math.max(0, Math.min(w, b.x));
          b.y = Math.max(0, Math.min(h, b.y));
        }
        if (node) node.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${Math.atan2(b.vy, b.vx) + Math.PI / 2}rad)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const clock = setInterval(() => setGame((g) => g && { ...g, left: g.left - 1 }), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(clock);
    };
  }, [running, reduce]);

  // Time's up: report the score.
  useEffect(() => {
    if (!game || game.left > 0) return;
    const s = game.score;
    const verdict =
      s >= 15 ? "Senior engineer energy. Want to pair on something real?" : s >= 8 ? "Solid sprint. Ship it." : "Every bug counts. Type play to go again.";
    later(0, () => {
      setGame(null);
      const record = s > best;
      print({ text: `Time! You squashed ${s} bug${s === 1 ? "" : "s"}. ${record ? "🏆 New best! " : ""}${verdict}`, kind: "ok" });
      if (record) {
        setBest(s);
        try {
          localStorage.setItem("bug-best", String(s));
        } catch {}
      }
    });
  }, [game, best]);

  const squash = (i: number) => {
    const b = bugs.current[i];
    if (!b || b.dead > 0 || !game || game.left <= 0) return;
    b.dead = 0.7;
    bugEls.current[i]?.setAttribute("data-dead", "");
    setGame((g) => g && { ...g, score: g.score + 1 });
  };

  // Where the caret sits: the line currently being typed.
  const shown = reduce ? total : Math.max(autoTyped, scrollTyped);
  const rendered: React.ReactNode[][] = [];
  let caretLine = code.length - 1;
  for (let li = 0, left = shown; li < code.length; li++) {
    const parts: React.ReactNode[] = [];
    for (const [t, k] of code[li]) {
      if (left <= 0) break;
      parts.push(
        <span key={parts.length} className={tone[k]}>
          {t.slice(0, left)}
        </span>,
      );
      left -= t.length;
    }
    if (left <= 0 && caretLine === code.length - 1 && shown < total) caretLine = li;
    left -= 1;
    rendered.push(parts);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/85 shadow-lift backdrop-blur-xl">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
        {["bg-pink/70", "bg-primary/70", "bg-cyan/70"].map((c) => (
          <span key={c} className={cn("size-2.5 rounded-full", c)} />
        ))}
        <span className="ml-3 rounded-md bg-muted px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">jasun.ts</span>
        {running ? (
          <span className="ml-auto flex items-center gap-3 font-mono text-[11px] text-muted-foreground tabular-nums">
            <span className="inline-flex items-center gap-1 text-pink">
              <Bug className="size-3.5" /> {game.score}
            </span>
            0:{String(Math.max(0, game.left)).padStart(2, "0")}
          </span>
        ) : (
          <span className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => run("run")}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[11px] text-cyan transition-colors hover:bg-muted"
            >
              <Play className="size-3" /> Run
            </button>
            <button
              type="button"
              onClick={() => run("play")}
              className="play-cta inline-flex items-center gap-1.5 rounded-md bg-pink/15 px-2 py-0.5 font-mono text-[11px] text-pink transition-colors hover:bg-pink/25"
            >
              <Gamepad2 className="size-3.5" /> Play
              {best > 0 && (
                <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                  <Trophy className="size-3" />
                  {best}
                </span>
              )}
            </button>
          </span>
        )}
      </div>

      <div ref={area} className="relative">
        <p className="sr-only">Code editor showing {site.name}&apos;s profile as a TypeScript object.</p>
        <pre aria-hidden className="h-54 overflow-hidden px-4 py-3 font-mono text-[11px] leading-[1.35rem] sm:text-[12.5px]">
          {rendered.map((parts, li) => (
            <div key={li} className="flex whitespace-pre">
              <span className="mr-4 w-4 shrink-0 text-right text-muted-foreground/50 select-none">{li + 1}</span>
              <span>
                {parts}
                {li === caretLine && <span className="caret ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-primary" />}
              </span>
            </div>
          ))}
        </pre>
        {running &&
          Array.from({ length: BUGS }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label="Squash bug"
              ref={(n) => {
                bugEls.current[i] = n;
              }}
              onPointerDown={() => squash(i)}
              className="bug absolute top-0 left-0 grid size-7 place-items-center text-pink"
            >
              <Bug className="size-5" />
            </button>
          ))}
      </div>

      <div className="border-t border-border px-4 py-2.5 font-mono text-[11px] sm:text-xs">
        <div aria-live="polite" className="h-[3.6rem] overflow-hidden">
          {lines.slice(-3).map((l, i) => (
            <p
              key={`${lines.length}-${i}`}
              className={cn(
                "truncate leading-[1.2rem]",
                l.kind === "cmd" ? "text-foreground" : l.kind === "ok" ? "text-cyan" : l.kind === "err" ? "text-pink" : "text-muted-foreground",
              )}
            >
              {l.text}
            </p>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(cmd);
            setCmd("");
          }}
          className="mt-1 flex items-center gap-2"
        >
          <span className="text-primary">➜</span>
          <span className="text-cyan">~</span>
          <input
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            aria-label="Terminal command"
            placeholder="help"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </form>
      </div>
    </div>
  );
}
