# Portfolio

Personal portfolio of **Rohan Patil** — software engineer & ML enthusiast.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

## Features

- **MDX content layer** — projects and blog posts live as `.mdx` files in `content/`; adding a file adds a page, no code changes
- **Command palette** — press <kbd>Ctrl</kbd> <kbd>K</kbd> to navigate anywhere
- **Terminal easter egg** — press <kbd>Ctrl</kbd> <kbd>`</kbd> and type `help`
- **Fully static** — every route is pre-rendered at build time (SSG)
- **Motion design** — Framer Motion entrance, scroll, and page-transition animations with `prefers-reduced-motion` support

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first tokens) |
| Animation | Framer Motion |
| Content | MDX via `gray-matter` + `next-mdx-remote` |
| Icons | Lucide |

## Structure

```
app/            routes (/, /projects, /projects/[slug], /blog, /blog/[slug], /resume)
components/     ui primitives, page sections, layout shell
content/        .mdx projects and blog posts (the content layer)
data/           resume/skills data
lib/            content loader, utilities
```

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes SSG)
```

## Adding content

Drop a new file into `content/projects/` or `content/blog/` with frontmatter:

```mdx
---
title: "Project Name"
description: "One-line summary."
stack: ["Python", "FastAPI"]
github: "https://github.com/..."
date: "2026-07-01"
---

Write the body in Markdown/MDX.
```

It appears on the site at the next build — no code changes required.
