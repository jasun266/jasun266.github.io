import type { Metadata } from "next";
import { site } from "@/lib/data";
import { PageTransition } from "@/components/motion/page-transition";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Architecture } from "@/components/sections/architecture";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.title,
  url: site.url,
  email: `mailto:${site.email}`,
  image: `${site.url}/images/jasun-cutout.webp`,
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  worksFor: { "@type": "Organization", name: "Vista Systech Limited" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "American International University-Bangladesh" },
  sameAs: [site.github, site.linkedin],
};

export default function Home() {
  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <About />
      <Projects />
      <Architecture />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </PageTransition>
  );
}
