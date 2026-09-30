import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-svh place-items-center overflow-hidden px-5 py-32 text-center">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="aurora absolute inset-[-10%]" />
        <div className="grid-lines absolute inset-0" />
      </div>
      <div>
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">Error 404</p>
        <h1 className="mt-4 font-display text-[clamp(7rem,32vw,22rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
          <span className="sr-only">Page not found</span>
          <span aria-hidden>
            {["4", "0", "4"].map((d, i) => (
              <span
                key={i}
                className={i === 1 ? "bob text-gradient" : "bob"}
                style={{ "--i": i } as React.CSSProperties}
              >
                {d}
              </span>
            ))}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">
          This page isn&apos;t part of the build. It may have moved, or it never shipped.
        </p>
        <Magnetic className="mt-10 inline-block">
          <Link
            href="/"
            className="btn-fill glass inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </Magnetic>
      </div>
    </section>
  );
}
