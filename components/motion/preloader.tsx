import { site } from "@/lib/data";

// Pure-CSS name reveal (< 1.5 s). An inline script in <head> sets
// html[data-preloaded] on repeat visits in the same session, which hides it.
export function Preloader() {
  return (
    <div className="preloader" aria-hidden>
      <p className="preloader-name font-display">
        {site.name.split("").map((c, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>
            {c === " " ? " " : c}
          </span>
        ))}
      </p>
    </div>
  );
}

export const preloaderScript = `try{sessionStorage.getItem('pl')?document.documentElement.setAttribute('data-preloaded',''):sessionStorage.setItem('pl','1')}catch(e){}`;
export const themeScript = `try{localStorage.getItem('theme')==='light'&&document.documentElement.classList.remove('dark')}catch(e){}history.scrollRestoration='manual';`;
