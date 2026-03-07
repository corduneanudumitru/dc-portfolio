# START HERE - Photography Portfolio with Sanity CMS

Welcome! This guide will help you get started with your fully-configured Sanity CMS photography portfolio.

## What You Have

A complete, production-ready Sanity CMS setup with:

- 7 schema files for content types (projects, posts, navigation, settings, about)
- 3 utility libraries (client configuration, image optimization, GROQ queries)
- Complete TypeScript type definitions
- 18 pre-built GROQ queries
- 5 comprehensive documentation files
- Setup checklist and quick start guides

All files are in `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/`

## Quick Links

### For Photographers / Content Creators
**Read first:** `CMS_QUICK_START.md` (5-10 min read)
- How to use the CMS interface
- How to add projects, blog posts
- Common tasks explained simply

### For Developers
**Read in order:**
1. `README_SANITY.md` (15-20 min) — Technical overview and architecture
2. `SANITY_SETUP.md` (20-30 min) — Detailed setup instructions
3. `DEPENDENCIES.md` (5 min) — Required packages

### For Setup & Testing
**Follow:** `SETUP_CHECKLIST.md` (30-60 min)
- Step-by-step setup verification
- Environment configuration
- Initial content creation
- Query testing

## File Structure Overview

```
dc-portfolio/
├── sanity/                          ← All CMS configuration
│   ├── schemas/                     ← Content type definitions (7 files)
│   ├── lib/                         ← Utility functions (3 files)
│   ├── types.ts                     ← TypeScript definitions
│   └── sanity.config.ts             ← Studio configuration
│
├── Documentation files (.md)         ← Read these!
├── Environment template (.env)
└── Visual references (.txt)
```

## What You Can Edit in the CMS

✓ **Projects** — Photography projects with galleries, categories, dates
✓ **Blog Posts** — Journal entries, photo essays, gear reviews
✓ **Navigation** — Edit your site menu
✓ **Site Settings** — Name, tagline, SEO, social media, contact
✓ **About Page** — Biography, portrait, equipment, exhibitions

## What's Included

### Schema Files (7)
- `blockContent.ts` — Rich text formatting with images
- `project.ts` — Photography project schema
- `post.ts` — Blog post schema
- `navigation.ts` — Navigation menu
- `siteSettings.ts` — Global site configuration
- `about.ts` — Photographer biography page
- `index.ts` — Schema exports

### Library Files (3)
- `client.ts` — Sanity client setup
- `image.ts` — Image optimization helpers
- `queries.ts` — 18 GROQ query functions

### Configuration
- `sanity.config.ts` — Studio configuration
- `types.ts` — Complete TypeScript definitions
- `.env.example` — Environment template

### Documentation (5 guides + more)
- `README_SANITY.md` — Technical reference
- `SANITY_SETUP.md` — Setup guide
- `CMS_QUICK_START.md` — User guide
- `DEPENDENCIES.md` — Packages needed
- `SETUP_CHECKLIST.md` — Setup checklist
- `FILE_TREE.txt` — Visual file structure
- `SANITY_FILES_INDEX.md` — Complete file index
- `CREATED_FILES_SUMMARY.txt` — Summary

## Getting Started (5 Steps)

### Step 1: Read the Right Guide
- Photographers → Start with `CMS_QUICK_START.md`
- Developers → Start with `README_SANITY.md`

### Step 2: Install Dependencies
```bash
npm install @sanity/client @sanity/image-url sanity @sanity/structure @sanity/vision
```

### Step 3: Configure Environment
```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET
```

### Step 4: Deploy Schema
```bash
npm run sanity:build
```

### Step 5: Access Studio & Create Content
- Go to `https://[your-project-id].sanity.studio`
- Create Site Settings, About Page, Navigation
- Add your first project and blog post

## Key Files Reference

### Most Important Files

| File | Purpose | Read Time |
|------|---------|-----------|
| `CMS_QUICK_START.md` | How to use the CMS | 5 min |
| `README_SANITY.md` | Technical overview | 15 min |
| `SETUP_CHECKLIST.md` | Step-by-step setup | 30 min |
| `sanity/schemas/project.ts` | Project schema | ref |
| `sanity/lib/queries.ts` | GROQ queries | ref |
| `sanity/types.ts` | TypeScript types | ref |

### Documentation Files

| File | Audience | Content |
|------|----------|---------|
| `CMS_QUICK_START.md` | Photographers | Daily CMS usage |
| `README_SANITY.md` | Developers | Technical reference |
| `SANITY_SETUP.md` | Developers | Detailed setup |
| `DEPENDENCIES.md` | Developers | Package info |
| `SETUP_CHECKLIST.md` | Everyone | Setup steps |
| `FILE_TREE.txt` | Reference | Visual structure |
| `SANITY_FILES_INDEX.md` | Reference | File index |

## Schema Categories & Options

### Photography Project Categories
- `street` — Street photography
- `travel` — Travel photography
- `landscape` — Landscape/nature
- `portrait` — Portraits
- `architecture` — Architecture
- `documentary` — Documentary

### Blog Post Categories
- `photo-essay` — Photo essays
- `travel-notes` — Travel stories
- `gear` — Camera/gear reviews
- `behind-the-images` — Behind-the-scenes

## Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Deploy Sanity schema
npm run sanity:build

# Access Sanity CLI
npm run sanity [command]
```

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

**How to get your Project ID:**
1. Go to https://manage.sanity.io
2. Select your project
3. Copy the Project ID

## Available Queries (18 Total)

### Projects (7 queries)
```typescript
getAllProjects()              // All projects with optional category filter
getFeaturedProjects()         // Featured projects only
getProjectBySlug(slug)        // Single project with full details
getProjectSlugs()             // All slugs for static generation
getProjectCategories()        // Unique categories
searchProjectsByTags(tags)    // Filter by tags
getProjectStats()             // Count and analytics
```

### Posts (6 queries)
```typescript
getAllPosts()                 // All posts with optional category filter
getPostBySlug(slug)          // Single post with content
getPostSlugs()               // All slugs
getRecentPosts(limit)        // Latest N posts
getPostCategories()          // Unique categories
getPostStats()               // Count and analytics
```

### Configuration (3 queries)
```typescript
getNavigation()              // Navigation menu structure
getSiteSettings()            // Global site configuration
getAboutPage()              // Biography and exhibitions
```

### Images (4 utilities)
```typescript
getImageUrl(source, opts)           // Customized image URL
getResponsiveImageUrls(source)      // Mobile/tablet/desktop versions
getThumbnailUrl(source, size)       // Quick thumbnails
getHeroImageUrl(source, width)      // Hero/banner optimization
```

## Integration Example

```typescript
// pages/projects/[slug].tsx
import { getProjectBySlug, getProjectSlugs } from '@/sanity/lib/queries';
import { getImageUrl } from '@/sanity/lib/image';
import { Project } from '@/sanity/types';

export async function getStaticPaths() {
  const slugs = await getProjectSlugs();
  return {
    paths: slugs.map(s => ({ params: { slug: s.slug.current } })),
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const project = await getProjectBySlug(params.slug);
  return { props: { project }, revalidate: 60 };
}

export default function ProjectPage({ project }: { project: Project }) {
  return (
    <div>
      <img src={getImageUrl(project.coverImage, { width: 1200 })} />
      <h1>{project.title}</h1>
      {/* Render project.body, project.gallery, etc. */}
    </div>
  );
}
```

## TypeScript Support

All types exported from `sanity/types.ts`:

```typescript
import {
  Project,
  Post,
  SiteSettings,
  About,
  Navigation,
  isProject,
  PROJECT_CATEGORIES,
  POST_CATEGORIES
} from '@/sanity/types';
```

## Troubleshooting

### "Cannot find module @sanity/client"
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev  # Restart dev server!
```

### Studio not loading
1. Check `.env.local` has correct Project ID
2. Clear browser cache
3. Restart dev server

### Images not loading
1. Verify image uploaded completely in Studio
2. Check alt text is filled in
3. Run query test in Vision tool

### More help?
- Read `SANITY_SETUP.md` — Detailed troubleshooting section
- Check `CMS_QUICK_START.md` — Common mistakes section
- Visit https://www.sanity.io/docs for official docs

## Next Steps

1. **Choose your path:**
   - Photographer? → Read `CMS_QUICK_START.md`
   - Developer? → Read `README_SANITY.md`

2. **Follow `SETUP_CHECKLIST.md`** for step-by-step setup

3. **Create initial content:**
   - Site Settings
   - About Page
   - Navigation Menu
   - First Project
   - First Blog Post

4. **Build your frontend:**
   - Use queries from `sanity/lib/queries.ts`
   - Import types from `sanity/types.ts`
   - Optimize images with `sanity/lib/image.ts`

5. **Deploy and enjoy!**

## File Locations

All files are in:
```
/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/
```

### Absolute Paths

**Schemas:**
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/*.ts`

**Libraries:**
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/lib/*.ts`

**Configuration:**
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/types.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/sanity.config.ts`

**Documentation:**
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/*.md`

## Resources

- **Sanity Docs:** https://www.sanity.io/docs
- **GROQ Guide:** https://www.sanity.io/docs/groq
- **Image API:** https://www.sanity.io/docs/image-url
- **TypeScript:** https://www.sanity.io/docs/typescript
- **Portable Text:** https://www.sanity.io/docs/block-content-specification

## Support

- Check the relevant `.md` file for your use case
- Sanity community Slack: https://slack.sanity.io
- GitHub: https://github.com/sanity-io

---

## Your Next Action

Pick one and start:

**For photographers:**
```
Read: CMS_QUICK_START.md
Then: SETUP_CHECKLIST.md
```

**For developers:**
```
Read: README_SANITY.md
Then: SANITY_SETUP.md
Then: SETUP_CHECKLIST.md
```

---

**You're all set!** Your photography portfolio CMS is ready to go. Happy creating! 📸
