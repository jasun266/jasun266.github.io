// Every fact on the site lives here. Don't invent numbers — edit this file.
// Never add a phone number: this site is public.

export const site = {
  url: "https://jasun266.github.io",
  name: "Shah Ul Jasun",
  title: "Full Stack Software Engineer",
  role: "Lead Developer at Vista Systech Limited",
  location: "Uttara, Dhaka, Bangladesh",
  email: "jasun266@gmail.com",
  github: "https://github.com/jasun266",
  linkedin: "https://www.linkedin.com/in/shah-ul-jasun-7969a11bb",
  // Formspree endpoint (static hosting has no server; this was already used by the old site).
  formEndpoint: "https://formspree.io/f/xrgrnwye",
  summary:
    "4+ years taking production web apps from architecture to deployment and long-term maintenance. Strong in layered/modular system design, SOLID, relational data modelling, and high-performance REST APIs.",
  roles: [
    "Full Stack Software Engineer",
    "Lead Developer",
    "System Architect",
    "API Engineer",
  ],
};

export const stats = [
  { value: 4, suffix: "+", label: "years shipping production apps" },
  { value: 30, suffix: "+", label: "daily users on the Lumiere portal" },
  { value: 4, suffix: "", label: "live products" },
];

export type Accent = "violet" | "cyan" | "pink";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  url: string;
  demoUrl: string; // page recorded by scripts/capture-demos.ts
  stack: string[];
  highlights: string[];
  accent: Accent;
  diagram: "layered" | "pos-modules" | "xero-sync";
};

export const projects: Project[] = [
  {
    slug: "asthafy",
    title: "Asthafy",
    kind: "Multi-vendor e-commerce platform",
    url: "https://asthafy.com",
    demoUrl: "https://asthafy.com/mart",
    stack: ["Express.js", "Next.js", "PostgreSQL", "Redis"],
    highlights: [
      "Layered architecture (controller → service → repository); the Repository pattern decouples business logic from the ORM",
      "Shopify & WordPress integrations as Adapters behind a common interface, created via a Factory (open/closed)",
      "Normalised multi-vendor schema, indexed hot paths, Redis cache with targeted invalidation",
    ],
    accent: "violet",
    diagram: "layered",
  },
  {
    slug: "asthafy-pos",
    title: "Asthafy POS",
    kind: "SaaS point of sale",
    url: "https://pos.asthafy.com",
    demoUrl: "https://pos.asthafy.com/dashboard",
    stack: ["Next.js", "Express.js", "PostgreSQL"],
    highlights: [
      "Independent modules: sales, inventory, payments, reporting",
      "ACID transactions + idempotent checkout — no double-charging or stock drift across concurrent terminals",
      "Shares domain + auth layer with the storefront via dependency inversion",
    ],
    accent: "cyan",
    diagram: "pos-modules",
  },
  {
    slug: "lumiere",
    title: "Lumiere Solutions Portal",
    kind: "Workflow automation for an Australian client",
    url: "https://portal.lumieresolutions.com.au",
    demoUrl: "https://portal.lumieresolutions.com.au",
    stack: ["Laravel", "MySQL", "Xero API"],
    highlights: [
      "Event-driven pipeline (Laravel queues + observers) replacing manual data entry; 30+ daily users",
      "Fault-tolerant Xero sync: token refresh, retry-with-backoff, idempotent writes",
      "Sole technical owner: requirements → design → RBAC → deployment → releases",
    ],
    accent: "pink",
    diagram: "xero-sync",
  },
];

export const experience = [
  {
    company: "Vista Systech Limited",
    role: "Software Engineer / Lead Developer",
    period: "Aug 2024 – Present",
    points: [
      "Lead architecture and delivery across e-commerce, POS and service-management",
      "Enforce SOLID and design patterns",
      "Lead the team: sprints, code reviews, mentoring",
      "Own deployment, production troubleshooting, query/cache tuning",
    ],
  },
  {
    company: "Service Engine Ltd.",
    role: "Jr. Software Engineer",
    period: "Jun 2022 – Jul 2024",
    points: [
      "Full-stack JS/PHP apps",
      "Elasticsearch for large-scale search",
      "Redis caching to cut DB load and API latency",
      "Unit + integration tests",
    ],
  },
];

export const education = [
  {
    title: "B.Sc. Computer Science & Engineering",
    org: "American International University-Bangladesh",
    detail: "CGPA 3.79 / 4.00",
  },
  {
    title: "Full Stack Web Development",
    org: "Codeworks Bootcamp",
    detail: "On-site bootcamp",
  },
];

// usedIn only lists places the resume actually backs up; empty = no claim.
export const skills: { group: string; items: { name: string; usedIn?: string[] }[] }[] = [
  {
    group: "Backend",
    items: [
      { name: "Node.js", usedIn: ["Asthafy", "Asthafy POS"] },
      { name: "Express.js", usedIn: ["Asthafy", "Asthafy POS"] },
      { name: "Laravel", usedIn: ["Lumiere Solutions Portal"] },
      { name: "PHP", usedIn: ["Lumiere Solutions Portal", "Service Engine"] },
      { name: "REST API design", usedIn: ["Asthafy", "Asthafy POS"] },
    ],
  },
  {
    group: "Frontend",
    items: [
      { name: "React", usedIn: ["Asthafy", "Asthafy POS"] },
      { name: "Next.js", usedIn: ["Asthafy", "Asthafy POS"] },
      { name: "Vue.js" },
      { name: "Nuxt.js" },
      { name: "TypeScript" },
      { name: "JavaScript", usedIn: ["Service Engine"] },
      { name: "HTML5" },
      { name: "CSS3" },
      { name: "Bootstrap" },
    ],
  },
  {
    group: "Databases",
    items: [
      { name: "PostgreSQL", usedIn: ["Asthafy", "Asthafy POS"] },
      { name: "MySQL", usedIn: ["Lumiere Solutions Portal"] },
      { name: "MongoDB" },
      { name: "Elasticsearch", usedIn: ["Service Engine"] },
      { name: "Redis", usedIn: ["Asthafy", "Service Engine"] },
    ],
  },
  {
    group: "Architecture",
    items: [
      { name: "SOLID", usedIn: ["Vista Systech"] },
      { name: "Layered / modular", usedIn: ["Asthafy", "Asthafy POS"] },
      { name: "Repository", usedIn: ["Asthafy"] },
      { name: "Factory", usedIn: ["Asthafy"] },
      { name: "Adapter", usedIn: ["Asthafy"] },
      { name: "Observer", usedIn: ["Lumiere Solutions Portal"] },
      { name: "MVC" },
      { name: "DRY" },
    ],
  },
  {
    group: "DevOps & tools",
    items: [
      { name: "Git" },
      { name: "Docker" },
      { name: "AWS" },
      { name: "CI/CD" },
      { name: "Agile/Scrum", usedIn: ["Vista Systech"] },
    ],
  },
  {
    group: "Integrations",
    items: [
      { name: "Shopify", usedIn: ["Asthafy"] },
      { name: "WordPress", usedIn: ["Asthafy"] },
      { name: "Xero", usedIn: ["Lumiere Solutions Portal"] },
      { name: "Payment gateways" },
    ],
  },
  {
    group: "Testing",
    items: [{ name: "Cypress" }, { name: "Playwright" }, { name: "Vitest" }],
  },
];

export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/resume/", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];
