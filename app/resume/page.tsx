import type { Metadata } from "next";
import { Download } from "lucide-react";
import { education, experience, projects, site, skills } from "@/lib/data";
import { PageTransition } from "@/components/motion/page-transition";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name}, ${site.title}.`,
  alternates: { canonical: "/resume/" },
};

// Printable web resume; `npm run resume:pdf` renders it to public/resume.pdf.
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-border py-10 sm:grid-cols-[9rem_1fr] print:py-5">
      <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">{title}</h2>
      <div className="space-y-7 print:space-y-4">{children}</div>
    </section>
  );
}

export default function Resume() {
  return (
    <PageTransition>
      <article className="mx-auto max-w-4xl px-5 pt-32 pb-24 sm:px-8 print:max-w-none print:p-0">
        <header className="flex flex-wrap items-end justify-between gap-6 pb-10 print:pb-6">
          <div>
            <h1 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl print:text-4xl">
              {site.name}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {site.title} · {site.role}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <li>{site.location}</li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.github} className="hover:text-foreground">
                  {host(site.github)}
                </a>
              </li>
              <li>
                <a href={site.linkedin} className="hover:text-foreground">
                  {host(site.linkedin)}
                </a>
              </li>
            </ul>
          </div>
          <a
            href="/resume.pdf"
            download
            className="btn-fill inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground print:hidden"
          >
            <Download className="size-4" /> Download PDF
          </a>
        </header>

        <Block title="Summary">
          <p className="leading-relaxed">{site.summary}</p>
        </Block>

        <Block title="Experience">
          {experience.map((job) => (
            <div key={job.company} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">
                  {job.role} · {job.company}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">{job.period}</p>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary">
                {job.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </Block>

        <Block title="Projects">
          {projects.map((p) => (
            <div key={p.slug} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold">
                  {p.title} <span className="font-normal text-muted-foreground">· {p.kind}</span>
                </h3>
                <a href={p.url} className="font-mono text-xs text-muted-foreground hover:text-foreground">
                  {host(p.url)}
                </a>
              </div>
              <p className="mt-1 font-mono text-xs text-primary">{p.stack.join(" · ")}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground marker:text-primary">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </Block>

        <Block title="Skills">
          <dl className="space-y-2 text-sm">
            {skills.map((g) => (
              <div key={g.group} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
                <dt className="font-medium">{g.group}</dt>
                <dd className="text-muted-foreground">{g.items.map((i) => i.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block title="Education">
          {education.map((e) => (
            <div key={e.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.org}</p>
              </div>
              <p className="text-sm">{e.detail}</p>
            </div>
          ))}
        </Block>
      </article>
    </PageTransition>
  );
}
