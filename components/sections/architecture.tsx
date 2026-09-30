import { projects } from "@/lib/data";
import { Eyebrow, SplitHeading } from "@/components/motion/split-heading";
import { Spotlight } from "@/components/motion/spotlight";
import { AdapterDiagram, LayeredDiagram } from "@/components/diagrams";

const asthafy = projects.find((p) => p.slug === "asthafy")!;
const panels = [
  { label: "Asthafy · layered core", text: asthafy.highlights[0], Diagram: LayeredDiagram },
  { label: "Asthafy · integration layer", text: asthafy.highlights[1], Diagram: AdapterDiagram },
];

export function Architecture() {
  return (
    <section id="architecture" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow index="03">Architecture</Eyebrow>
          <SplitHeading>Systems, drawn to scale.</SplitHeading>
        </div>
        <p className="text-muted-foreground lg:col-span-4">
          How Asthafy is put together: a layered core, and integrations that plug in without touching it.
        </p>
      </div>
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {panels.map(({ label, text, Diagram }) => (
          <Spotlight key={label} className="glass rounded-[2rem] p-5 sm:p-8">
            <figure>
              <figcaption>
                <p className="font-mono text-xs tracking-[0.18em] text-primary uppercase">{label}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </figcaption>
              <div className="mx-auto mt-8 max-w-md">
                <Diagram />
              </div>
            </figure>
          </Spotlight>
        ))}
      </div>
    </section>
  );
}
