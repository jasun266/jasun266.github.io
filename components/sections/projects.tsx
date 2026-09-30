import { projects } from "@/lib/data";
import { projectMedia } from "@/lib/media";
import { ProjectGallery } from "@/components/projects/gallery";

export function Projects() {
  return (
    <ProjectGallery
      items={projects.map((project) => ({ project, media: projectMedia(project.slug, "desktop") }))}
    />
  );
}
