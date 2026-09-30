import fs from "node:fs";
import path from "node:path";

// Build-time lookup (server components only) of the demo files that
// scripts/capture-demos.ts wrote to public/media/projects/<slug>/.
export type Media = { webm?: string; mp4?: string; poster?: string };

export function projectMedia(slug: string, variant: "desktop" | "mobile"): Media {
  const dir = path.join(process.cwd(), "public", "media", "projects", slug);
  const url = (ext: string) =>
    fs.existsSync(path.join(dir, `${variant}.${ext}`))
      ? `/media/projects/${slug}/${variant}.${ext}`
      : undefined;
  return { webm: url("webm"), mp4: url("mp4"), poster: url("webp") };
}
