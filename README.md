# Sohel Siddique Ashik — Personal Portfolio

Modern portfolio site built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Styling**: Tailwind CSS v4 (CSS-first `@theme` config)
- **Motion**: Framer Motion 11
- **Icons**: Lucide React
- **Theme**: next-themes (dark default, light toggle)
- **Forms**: React Hook Form + Zod + Resend
- **Fonts**: Geist Sans + Geist Mono via `next/font`
- **Deployment**: Vercel (recommended)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Required for correct canonical URLs, OG images, and sitemap
NEXT_PUBLIC_SITE_URL=https://sohelashik.com

# Required for contact form email delivery (via Resend)
# Get your key at https://resend.com
# Without this, form submissions are logged locally but NOT emailed
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (Hero, Stats, About, Experience, Projects, Skills, Education, Contact) |
| `/projects` | All projects index |
| `/projects/[slug]` | Individual project case study |
| `/resume` | Interactive CV + embedded PDF |
| `/blog` | Writing placeholder (MDX blog coming soon) |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Search engine directives |

## Project Structure

```
src/
  app/            # Next.js App Router pages and routes
  components/
    sections/     # Page sections (Hero, About, Experience, etc.)
    layout/       # Navbar, Footer, ThemeProvider, ThemeToggle
    ui/           # Reusable UI primitives (Button, Card, Pill, etc.)
    motion/       # Animation components (Reveal, TypewriterText, CursorBlob)
  content/        # Static data: profile, projects, skills, seo config
  lib/            # Utilities: cn(), metadata builder, JSON-LD, email
public/
  images/         # Avatar and project screenshots
  resume.pdf      # Downloadable CV
```

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables in the Vercel dashboard
4. Deploy

**Custom domain suggestion**: `sohelashik.com`

### Netlify

Works with the [Next.js Runtime plugin](https://docs.netlify.com/frameworks/next-js/overview/).

## SEO

- Every route has `<title>`, `description`, `keywords`, `canonical`, OG image, and Twitter card.
- JSON-LD structured data: `Person` + `WebSite` on root, `CreativeWork` on project pages, `BreadcrumbList` on project detail pages.
- Native `sitemap.xml` and `robots.txt` via App Router file conventions.
- Lighthouse target: ≥ 95 across all four categories.

## Content Updates

All personal data lives in `src/content/`:

- `profile.ts` — name, bio, experience, education, skills, social links, stats
- `projects.ts` — project list with slugs, descriptions, stack, highlights
- `seo.ts` — site URL, title template, keywords

Edit those files to update the site. No database required.
