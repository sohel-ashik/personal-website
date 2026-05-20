# Sohel Siddique Ashik — Personal Portfolio

Modern portfolio site built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Styling**: Tailwind CSS v4 (CSS-first `@theme` config)
- **Motion**: Framer Motion 11
- **Icons**: Lucide React
- **Theme**: next-themes (dark default, light toggle)
- **Forms**: React Hook Form + Zod + Resend
- **Blog**: MongoDB (Mongoose) + react-markdown + key-gated private editor
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

Create a `.env.local` file in the project root (see `.env.local.example` for all vars):

```env
# Required for correct canonical URLs, OG images, and sitemap
NEXT_PUBLIC_SITE_URL=https://sohelashik.com

# Required for contact form email delivery (via Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Required for blog (MongoDB)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio

# Secret you type at /blog/write/ashik to access the editor
BLOG_WRITE_KEY=your-super-secret-write-key

# 32+ char secret for signing the session cookie
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
BLOG_SESSION_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (Hero, Stats, About, Experience, Projects, Skills, Education, Contact) |
| `/projects` | All projects index |
| `/projects/[slug]` | Individual project case study |
| `/resume` | Interactive CV + embedded PDF |
| `/blog` | Blog listing (published posts from MongoDB) |
| `/blog/[slug]` | Individual post (Notion + dev-style rendering) |
| `/blog/rss.xml` | RSS feed (20 latest posts) |
| `/blog/write/ashik` | Private: key gate → dashboard |
| `/blog/write/ashik/new` | Private: create a new post |
| `/blog/write/ashik/edit/[slug]` | Private: edit an existing post |
| `/sitemap.xml` | Auto-generated (includes blog posts) |
| `/robots.txt` | Search engine directives |

## Blog System

### How to write a post

1. Visit `/blog/write/ashik`
2. Enter your `BLOG_WRITE_KEY`
3. Click **New post**
4. Fill in the title, slug, summary, tags
5. Expand the **SEO & Metadata** panel to set a custom title, description, keywords
6. Write in the markdown textarea (toolbar available for formatting)
7. Toggle **Preview** to see exactly how readers will see it
8. Click **Save draft** to save without publishing
9. Click **Publish** to make it live instantly

### Publish flow

- **Publish**: post appears at `/blog/[slug]` immediately (ISR revalidates the listing within 60s)
- **Unpublish**: post is hidden from public immediately, slug remains for re-publishing
- **Delete**: permanently removes from DB and sitemap

### Markdown features

- GFM: tables, task lists, strikethrough
- Fenced code blocks with language tag and **copy button**
- Callouts: `> [!NOTE]`, `> [!WARNING]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!CAUTION]`
- Anchor links on every heading (for TOC and deep linking)
- Auto-generated sticky **Table of Contents** on desktop (from `##` and `###` headings)

### Image uploads

Image bucket selection is deferred — paste an image URL directly for now.
This will be implemented in a future update once the storage bucket (S3/R2/Cloudflare) is chosen.

## Project Structure

```
src/
  app/
    blog/
      page.tsx              # Public listing
      [slug]/page.tsx       # Public post view
      rss.xml/route.ts      # RSS feed
      write/ashik/          # Private editor (key-gated)
    api/blog/               # REST API: auth, posts CRUD, publish
  components/
    blog/                   # Editor, Dashboard, AuthGate, PostCard, ...
    sections/               # Page sections (Hero, About, Experience, etc.)
    layout/                 # Navbar, Footer, ThemeProvider, ThemeToggle
    ui/                     # Reusable UI primitives
    motion/                 # Animation components
  content/                  # Static data (profile, projects, skills, seo)
  data/
    portfolio.json          # Single source of truth — edit to update the site
  lib/
    db.ts                   # Mongoose connection singleton
    models/Post.ts          # Post schema + serializer
    blog-auth.ts            # HMAC cookie auth
    markdown.tsx            # <MarkdownContent /> renderer
    metadata.ts             # buildMetadata() SEO helper
    jsonld.ts               # JSON-LD schema builders
    email.ts                # Resend wrapper
public/
  images/                   # Avatar and project screenshots
  resume.pdf                # Downloadable CV
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
