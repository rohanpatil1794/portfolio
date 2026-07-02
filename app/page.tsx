import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import TechMarquee from "@/components/sections/TechMarquee";
import { getProjects } from "@/lib/content";
import { skills } from "@/data/resume";

export default function Home() {
  // Strip the MDX body — only serializable frontmatter crosses to the client.
  const featured = getProjects()
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    .map(({ slug, title, description, stack, github, live, featured, date }) => ({
      slug,
      title,
      description,
      stack,
      github,
      live,
      featured,
      date,
    }));

  const techItems = Object.values(skills).flat();

  return (
    <>
      <Hero />
      <TechMarquee items={techItems} />
      <FeaturedProjects projects={featured} />
    </>
  );
}
