import { ArrowUpRight, MapPin } from "lucide-react";
import { site } from "@/lib/data";
import { Eyebrow, SplitHeading } from "@/components/motion/split-heading";
import { CopyEmail } from "@/components/contact/copy-email";
import { ContactForm } from "@/components/contact/contact-form";

const socials = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
];

export function Contact() {
  return (
    <section id="contact" className="relative isolate mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div
        aria-hidden
        className="aurora absolute inset-x-[-20%] top-1/4 bottom-0 -z-10 opacity-50 mask-[radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
      <Eyebrow index="07">Contact</Eyebrow>
      <SplitHeading className="max-w-5xl">
        Have something worth building? <span className="text-primary">Let&apos;s talk.</span>
      </SplitHeading>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          <CopyEmail email={site.email} />
          <ul className="divide-y divide-border border-y border-border">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between py-5 font-display text-2xl font-semibold tracking-tight"
                >
                  {s.label}
                  <ArrowUpRight className="size-6 text-muted-foreground transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                </a>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {site.location}
          </p>
        </div>
        <ContactForm className="lg:col-span-7" />
      </div>
    </section>
  );
}
