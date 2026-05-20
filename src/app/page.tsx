import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Skills } from "@/components/sections/Skills";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <div className="section-divider mx-auto max-w-6xl px-6" aria-hidden="true" />
      <Experience />
      <div className="section-divider mx-auto max-w-6xl px-6" aria-hidden="true" />
      <FeaturedProjects />
      <div className="section-divider mx-auto max-w-6xl px-6" aria-hidden="true" />
      <Skills />
      <div className="section-divider mx-auto max-w-6xl px-6" aria-hidden="true" />
      <Education />
      <div className="section-divider mx-auto max-w-6xl px-6" aria-hidden="true" />
      <Contact />
    </>
  );
}
