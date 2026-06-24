import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface ProjectFrontmatter {
  title: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  date: string;
  image?: string;
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags?: string[];
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  content: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

function getItems<T>(folder: string): (T & { slug: string; content: string })[] {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return { ...(data as T), slug, content };
    })
    .sort((a, b) => new Date((b as any).date).getTime() - new Date((a as any).date).getTime());
}

export function getProjects(): Project[] {
  return getItems<ProjectFrontmatter>("projects");
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getPosts(): Post[] {
  return getItems<PostFrontmatter>("blog");
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
