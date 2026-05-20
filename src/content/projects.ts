/**
 * All project data is stored in src/data/portfolio.json
 * Edit that file to add, remove, or update projects.
 * This file re-exports typed data and provides helper functions.
 */
import data from "@/data/portfolio.json";

export type ProjectCategory = "Web" | "App" | "Research" | "Automation";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  role: string;
  year: string;
  category: ProjectCategory;
  stack: string[];
  highlights: string[];
  links: { label: string; href: string }[];
  cover: string;
  featured: boolean;
  proprietary?: boolean;
}

export const projects = data.projects as Project[];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
