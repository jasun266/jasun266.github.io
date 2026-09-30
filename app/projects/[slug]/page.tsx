import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/data";
import { projectMedia } from "@/lib/media";
import { PageTransition } from "@/components/motion/page-transition";
import { SplitHeading } from "@/components/motion/split-heading";
import { MediaFrame } from "@/components/projects/media-frame";
import { AdapterDiagram, LayeredDiagram, PosModulesDiagram, XeroSyncDiagram } from "@/components/diagrams";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

const diagrams = {
  layered: [LayeredDiagram, AdapterDiagram],
  "pos-modules": [PosModulesDiagram],
  "xero-sync": [XeroSyncDiagram],
};

const accent = (a: string) => ({ "--tone": `var(--${a})` }) as React.CSSProperties;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: `${p.kind}. ${p.highlights[0]}.`,
    alternates: { canonical: `/projects/${p.slug}/` },
  };
}

export default async function CaseStudy({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const mobile = projectMedia(p.slug, "mobile");

  return (
    <PageTransition>
      <article className="mx-auto max-w-7xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40" style={accent(p.accent)}>
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> All work
        </Link>

        <header className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mb-6 font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
              <span className="text-(--tone)">Case study {String(i + 1).padStart(2, "0")}</span> / {p.kind}
            </p>
            <SplitHeading as="h1" className="sm:text-7xl lg:text-8xl">
              {p.title}
            </SplitHeading>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="btn-fill inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              Visit live site <ArrowUpRight className="size-4" />
            </a>
          </div>
        </header>

        <div className="mt-14 flex flex-col gap-6 lg:flex-row lg:items-end">
          <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
            <MediaFrame project={p} media={projectMedia(p.slug, "desktop")} className="flex-1" />
          </ViewTransition>
          {(mobile.webm || mobile.mp4) && (
            <MediaFrame project={p} media={mobile} mobile className="mx-auto w-56 shrink-0 lg:mx-0" />
          )}
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="space-y-8 lg:sticky lg:top-32">
              <div>
                <dt className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Product</dt>
                <dd className="mt-2 text-lg">{p.kind}</dd>
              </div>
              <div>
                <dt className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Stack</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="rounded-full border border-border px-3 py-1 font-mono text-xs">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Live</dt>
                <dd className="mt-2">
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-(--tone) hover:underline">
                    {new URL(p.url).host} ↗
                  </a>
                </dd>
              </div>
            </dl>
          </aside>

          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Key technical decisions</h2>
            <ol className="mt-10 space-y-4">
              {p.highlights.map((h, n) => (
                <li key={h} className="reveal glass flex gap-6 rounded-[1.75rem] p-6 sm:p-8">
                  <span className="font-display text-3xl font-semibold text-(--tone) sm:text-4xl">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-relaxed">{h}</p>
                </li>
              ))}
            </ol>

            <h2 className="mt-24 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Architecture</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {diagrams[p.diagram].map((Diagram, n, all) => (
                <div
                  key={n}
                  className={`glass rounded-[2rem] p-6 sm:p-8 ${all.length === 1 ? "md:col-span-2" : ""}`}
                >
                  <div className="mx-auto max-w-md">
                    <Diagram />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <Link
        href={`/projects/${next.slug}/`}
        data-cursor="Next"
        className="group block border-t border-border"
        style={accent(next.accent)}
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Next project</p>
          <p className="mt-4 flex items-center gap-4 font-display text-5xl font-semibold tracking-tight transition-transform duration-700 ease-out-expo group-hover:translate-x-3 sm:text-8xl">
            {next.title}
            <ArrowRight className="size-10 shrink-0 text-(--tone) sm:size-16" />
          </p>
          <p className="mt-3 text-muted-foreground">{next.kind}</p>
        </div>
      </Link>
    </PageTransition>
  );
}
