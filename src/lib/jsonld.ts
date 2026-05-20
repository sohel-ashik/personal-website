import { profile } from "@/content/profile";
import { siteConfig } from "@/content/seo";
import type { Project } from "@/content/projects";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
    email: profile.email,
    jobTitle: profile.role,
    worksFor: {
      "@type": "Organization",
      name: "Nyntax",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Daffodil International University",
    },
    sameAs: Object.values(profile.socials),
    knowsAbout: [
      "Node.js",
      "TypeScript",
      "GraphQL",
      "AWS",
      "Compliance Automation",
      "Backend Development",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: profile.name,
    },
  };
}

export function creativeWorkJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    author: {
      "@type": "Person",
      name: profile.name,
    },
    dateCreated: project.year,
    keywords: project.stack.join(", "),
    url: project.links[0]?.href ?? siteConfig.url,
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}
