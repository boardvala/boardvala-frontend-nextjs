import ProjectDetailClient from "./ProjectDetailClient";

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const project = data.project;
    if (!project) return { title: "Project Not Found" };
    return {
      title: `${project.title} | BoardVala`,
      description: project.description || `${project.title} - ${project.category} project by BoardVala`,
    };
  } catch {
    return { title: "Project | BoardVala" };
  }
}

export default async function ProjectPage({ params }) {
  let project = null;
  try {
    const { id } = await params;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    project = data.project || null;
  } catch {
    project = null;
  }

  return <ProjectDetailClient initialProject={project} />;
}