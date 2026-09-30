import { ViewTransition } from "react";

// Wrap each page's content. Route navigations are React transitions, so the
// browser's View Transitions API animates old → new (CSS in globals.css).
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
