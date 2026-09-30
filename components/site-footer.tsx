import { site } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="border-t border-border print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js, hosted on GitHub Pages.
        </p>
        <ul className="flex gap-6">
          <li>
            <a className="hover:text-foreground" href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a className="hover:text-foreground" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="hover:text-foreground" href={`mailto:${site.email}`}>
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
