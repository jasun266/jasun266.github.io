"use client";

import { cn } from "@/lib/utils";

// Card with a soft glow that follows the pointer (CSS in globals.css).
export function Spotlight({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("spotlight", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
    />
  );
}
