import { site, stats } from "@/lib/data";
import { Eyebrow, SplitHeading } from "@/components/motion/split-heading";
import { ScrollWords } from "@/components/about/scroll-words";
import { Portrait } from "@/components/about/portrait";
import { Counter } from "@/components/about/counter";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 pt-28 pb-16 sm:px-8 sm:pt-40 sm:pb-20">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Eyebrow index="01">About</Eyebrow>
          <SplitHeading>From architecture to deployment, and everything after.</SplitHeading>
          <ScrollWords
            text={site.summary}
            className="mt-10 max-w-2xl text-xl leading-relaxed text-foreground sm:text-2xl sm:leading-relaxed"
          />
          <p className="mt-8 max-w-xl text-muted-foreground">
            Currently {site.role}, based in {site.location}.
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm lg:col-span-4 lg:col-start-9 lg:max-w-none">
          <Portrait />
        </div>
      </div>

      <dl className="mt-20 grid gap-px overflow-hidden rounded-[2rem] border border-border bg-border sm:mt-28 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-3 bg-background p-8 lg:p-10">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="font-display text-6xl font-semibold tracking-tight tabular-nums lg:text-7xl">
              <Counter value={s.value} />
              <span className="text-primary">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
