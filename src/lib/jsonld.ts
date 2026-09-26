import { profile } from "@/content/profile";
import { projects, type Project } from "@/content/projects";
import { siteConfig } from "@/content/seo";

const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/avatar.png`,
    email: profile.email,
    telephone: profile.phone,
    jobTitle: profile.role,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lalmatia",
      addressLocality: "Dhaka",
      postalCode: "1207",
      addressCountry: "BD",
    },
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
      "Express",
      "MongoDB",
      "GraphQL",
      "AWS",
      "Puppeteer",
      "Compliance Automation",
      "SOC 2",
      "HIPAA",
      "GDPR",
      "PCI",
      "Backend Development",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": personId },
    author: { "@id": personId },
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/#profile`,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: "en",
    mainEntity: { "@id": personId },
    isPartOf: { "@id": websiteId },
  };
}

export function creativeWorkJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteConfig.url}/projects/${project.slug}`,
    author: { "@id": personId },
    keywords: project.stack.join(", "),
    ...(project.links[0]?.href ? { sameAs: project.links[0].href } : {}),
  };
}

export function projectsItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Projects by Sohel Siddique Ashik",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: `${siteConfig.url}/projects/${project.slug}`,
    })),
  };
}

export function blogJsonLd(posts: { title: string; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteConfig.url}/blog#blog`,
    name: `${profile.name} — Writing`,
    description:
      "Articles by Sohel Siddique Ashik on backend engineering, compliance automation, AWS, and problem-solving.",
    url: `${siteConfig.url}/blog`,
    inLanguage: "en",
    author: { "@id": personId },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${siteConfig.url}/blog/${post.slug}`,
    })),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  updatedAt: string;
  tags: string[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.image,
    author: {
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      url: siteConfig.url,
    },
    publisher: { "@id": personId },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    inLanguage: "en",
    url: `${siteConfig.url}/blog/${post.slug}`,
    isPartOf: { "@id": `${siteConfig.url}/blog#blog` },
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
      item: item.href === "/" ? siteConfig.url : `${siteConfig.url}${item.href}`,
    })),
  };
}
