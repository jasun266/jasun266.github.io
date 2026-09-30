import { experience } from "@/lib/data";
import { Eyebrow, SplitHeading } from "@/components/motion/split-heading";
import { Timeline } from "@/components/experience/timeline";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Eyebrow index="05">Experience</Eyebrow>
            <SplitHeading>Where I&apos;ve shipped.</SplitHeading>
            <p className="mt-6 max-w-sm text-muted-foreground">
              4+ years across e-commerce, POS and service management, from junior engineer to lead.
            </p>
          </div>
        </div>
        <Timeline items={experience} className="lg:col-span-7 lg:col-start-6" />
      </div>
    </section>
  );
}
