"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

// Slot-machine line cycling through the roles; static under reduced motion.
// Decorative: the h1 already carries the title for screen readers.
export function RoleLine({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [reduce, roles.length]);

  return (
    <span
      aria-hidden
      className="relative block h-[1.25em] overflow-hidden font-display text-2xl font-medium tracking-tight sm:text-3xl"
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={roles[i]}
          className="absolute inset-x-0 top-0 whitespace-nowrap"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "-110%" }}
          transition={{ duration: 0.7, ease: ease.outExpo }}
        >
          <span className="text-primary">/ </span>
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
