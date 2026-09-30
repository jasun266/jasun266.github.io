"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Spotlight } from "@/components/motion/spotlight";
import { cn } from "@/lib/utils";

type Item = { name: string; usedIn?: string[] };

// Skills backed by real projects are buttons that reveal where they were used.
export function SkillGroup({ group, items, className }: { group: string; items: Item[]; className?: string }) {
  const [active, setActive] = useState<Item | null>(null);
  const hint = items.some((i) => i.usedIn) ? "Hover a marked skill to see where it's used." : "";

  return (
    <Spotlight
      className={cn("reveal glass flex flex-col rounded-[2rem] p-6 sm:p-7", className)}
      onPointerLeave={() => setActive(null)}
    >
      <h3 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{group}</h3>
      <ul className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.name}>
            {item.usedIn ? (
              <button
                type="button"
                onPointerEnter={() => setActive(item)}
                onFocus={() => setActive(item)}
                onClick={() => setActive(item)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-300",
                  active === item
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border hover:border-primary/40",
                )}
              >
                {item.name}
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              </button>
            ) : (
              <span className="inline-flex rounded-full border border-dashed border-border px-3.5 py-1.5 text-sm text-muted-foreground">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="mt-auto min-h-12 pt-6 text-sm text-muted-foreground">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active?.name ?? "hint"}
            className="block"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {active?.usedIn ? (
              <>
                {active.name} → <span className="text-foreground">{active.usedIn.join(" · ")}</span>
              </>
            ) : (
              hint
            )}
          </motion.span>
        </AnimatePresence>
      </p>
    </Spotlight>
  );
}
