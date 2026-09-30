import { GraduationCap, Terminal } from "lucide-react";
import { education } from "@/lib/data";
import { Eyebrow, SplitHeading } from "@/components/motion/split-heading";
import { Spotlight } from "@/components/motion/spotlight";

const icons = [GraduationCap, Terminal];

export function Education() {
  return (
    <section id="education" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-32">
      <Eyebrow index="06">Education</Eyebrow>
      <SplitHeading>Foundations.</SplitHeading>
      <ul className="mt-14 grid gap-4 md:grid-cols-2">
        {education.map((e, i) => {
          const Icon = icons[i % icons.length];
          return (
            <li key={e.title} className="reveal">
              <Spotlight className="group glass h-full overflow-hidden rounded-[2rem] p-8 sm:p-10">
                <span
                  aria-hidden
                  className="absolute -top-8 right-6 font-display text-[9rem] leading-none font-semibold text-foreground/5 transition-transform duration-700 ease-out-expo group-hover:-translate-y-3"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 ease-out-expo group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{e.title}</h3>
                <p className="mt-2 text-muted-foreground">{e.org}</p>
                <p className="mt-6 inline-flex rounded-full border border-border px-3 py-1 font-mono text-xs">
                  {e.detail}
                </p>
              </Spotlight>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
