import { skills } from "@/lib/data";
import { Eyebrow, SplitHeading } from "@/components/motion/split-heading";
import { SkillGroup } from "@/components/skills/skill-group";

const names = skills.flatMap((g) => g.items.map((i) => i.name));
const half = Math.ceil(names.length / 2);
const rows = [names.slice(0, half), names.slice(half)];

export function Skills() {
  return (
    <section id="skills" className="overflow-hidden py-28 sm:py-40">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow index="04">Skills</Eyebrow>
          <SplitHeading>The toolkit.</SplitHeading>
        </div>
        <p className="text-muted-foreground lg:col-span-4">
          Marked skills show where I&apos;ve used them in production. Hover, tap or tab to them.
        </p>
      </div>

      <div
        aria-hidden
        className="marquee mt-16 space-y-2 mask-[linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      >
        {rows.map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            {[0, 1].map((copy) => (
              <ul key={copy} data-reverse={r ? "" : undefined} className="marquee-track flex shrink-0 items-center">
                {row.map((n) => (
                  <li
                    key={n}
                    className="flex items-center font-display text-5xl font-semibold tracking-tight whitespace-nowrap text-foreground/15 transition-colors duration-300 hover:text-foreground sm:text-7xl"
                  >
                    <span className="px-6">{n}</span>
                    <span className="text-2xl text-primary/50">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {skills.map((g) => (
          <SkillGroup
            key={g.group}
            group={g.group}
            items={g.items}
            className={g.items.length > 7 ? "lg:col-span-2" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
