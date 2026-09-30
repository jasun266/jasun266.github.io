"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { nav } from "@/lib/data";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the home page, smooth-scroll to sections instead of jumping.
  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    if (pathname !== "/" || !href.startsWith("/#")) return;
    e.preventDefault();
    const hash = href.slice(1);
    if (lenis) lenis.scrollTo(hash, { offset: -80 });
    else document.querySelector(hash)?.scrollIntoView();
    history.replaceState(null, "", hash);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-border bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          onClick={(e) => go(e, "/#top")}
          className="font-display text-lg font-semibold tracking-tight"
          aria-label="Shah Ul Jasun — home"
        >
          SJ<span className="text-primary">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Magnetic className="hidden sm:inline-block">
            <Link
              href="/#contact"
              onClick={(e) => go(e, "/#contact")}
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Let&apos;s talk
            </Link>
          </Magnetic>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border px-5 pb-6 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => go(e, item.href)}
              className="block border-b border-border py-4 font-display text-2xl"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle colour theme"
      className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
    >
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </button>
  );
}
