# Sanity CMS Files - Complete Index

Complete list of all Sanity CMS configuration and schema files created for your photography portfolio.

## Directory Structure

```
dc-portfolio/
├── sanity/
│   ├── schemas/
│   │   ├── index.ts                    (101 bytes) [Schema exports]
│   │   ├── blockContent.ts             (3.2 KB) [Rich text type]
│   │   ├── project.ts                  (5.8 KB) [Photography projects]
│   │   ├── post.ts                     (3.4 KB) [Blog posts]
│   │   ├── navigation.ts               (2.1 KB) [Navigation menu]
│   │   ├── siteSettings.ts             (4.5 KB) [Global settings]
│   │   └── about.ts                    (3.6 KB) [About page]
│   │
│   ├── lib/
│   │   ├── client.ts                   (0.8 KB) [Client initialization]
│   │   ├── image.ts                    (3.2 KB) [Image URL builders]
│   │   └── queries.ts                  (9.5 KB) [GROQ queries]
│   │
│   ├── types.ts                        (7.8 KB) [TypeScript definitions]
│   └── sanity.config.ts                (2.3 KB) [Studio configuration]
│
├── .env.example                        (0.3 KB) [Env variables template]
├── CMS_QUICK_START.md                  (7.2 KB) [Photographer guide]
├── SANITY_SETUP.md                     (12.5 KB) [Setup instructions]
├── DEPENDENCIES.md                     (4.8 KB) [Required packages]
├── README_SANITY.md                    (14.2 KB) [Technical reference]
└── SANITY_FILES_INDEX.md               (This file)
```

## File Descriptions

### Core Schema Files

#### `/sanity/schemas/index.ts`
**Purpose:** Central export point for all schemas
**Contents:** Imports and exports all schema types
**Imports by:** sanity.config.ts
**Size:** ~101 bytes

#### `/sanity/schemas/blockContent.ts`
**Purpose:** Defines rich text/portable text block type
**Contents:**
- Block type with heading styles (h1-h4) and quote
- Lists (bullet and numbered)
- Text marks (bold, italic, code, underline, strikethrough)
- Link annotations with open in new tab
- Embedded images with alt text and captions
**Used in:** project.ts (body), post.ts (body), about.ts (bio)
**Size:** ~3.2 KB

#### `/sanity/schemas/project.ts`
**Purpose:** Photography project schema
**Fields:**
- title (string, required)
- slug (auto from title, unique)
- coverImage (image with hotspot)
- gallery (array of images with captions)
- category (street, travel, landscape, portrait, architecture, documentary)
- tags (array)
- description (text)
- body (blockContent)
- imageCount (number)
- location (string)
- date (date)
- featured (boolean)
- order (number)
- publishedAt (datetime)
**Use case:** Store individual photography projects
**Size:** ~5.8 KB

#### `/sanity/schemas/post.ts`
**Purpose:** Blog/journal post schema
**Fields:**
- title (string, required)
- slug (auto from title, unique)
- coverImage (image)
- excerpt (text)
- body (blockContent)
- category (photo-essay, travel-notes, gear, behind-the-images)
- publishedAt (datetime)
**Use case:** Blog posts, photo essays, gear reviews
**Size:** ~3.4 KB

#### `/sanity/schemas/navigation.ts`
**Purpose:** Navigation menu configuration
**Fields:**
- items (array of:
  - label (string, required)
  - href (string, required)
  - isExternal (boolean)
  - order (number, required))
**Use case:** Editable site navigation/menu
**Size:** ~2.1 KB

#### `/sanity/schemas/siteSettings.ts`
**Purpose:** Global site configuration (singleton)
**Fields:**
- siteName (string, required)
- tagline (string)
- heroImage (image)
- seoTitle (string)
- seoDescription (text)
- socialLinks (array of: platform, url)
- contactEmail (string)
- footerText (text)
**Use case:** Site-wide settings, SEO metadata, social links
**Note:** Singleton document - only one instance
**Size:** ~4.5 KB

#### `/sanity/schemas/about.ts`
**Purpose:** About/biography page (singleton)
**Fields:**
- portrait (image)
- title (string, required)
- bio (blockContent)
- shortBio (text)
- equipment (array of strings)
- exhibitions (array of: title, venue, year)
**Use case:** Photographer biography page
**Note:** Singleton document - only one instance
**Size:** ~3.6 KB

### Library/Utility Files

#### `/sanity/lib/client.ts`
**Purpose:** Sanity client initialization and configuration
**Contents:**
- Creates Sanity client instance
- Configures API version and dataset
- Initializes image URL builder
- Exports `urlFor()` helper
**Exports:** `client`, `builder`, `urlFor()`
**Dependencies:** @sanity/client, @sanity/image-url
**Environment:** Reads from NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
**Size:** ~0.8 KB

#### `/sanity/lib/image.ts`
**Purpose:** Image optimization and URL generation
**Functions:**
- `getImageUrl(source, options)` — Customized image URL with dimensions, quality, fitting
- `getResponsiveImageUrls(source)` — Responsive URLs for mobile/tablet/desktop
- `getThumbnailUrl(source, size)` — Quick thumbnail URLs
- `getHeroImageUrl(source, width)` — Optimized hero/banner images
**Used in:** Frontend components for image rendering
**Size:** ~3.2 KB

#### `/sanity/lib/queries.ts`
**Purpose:** Pre-built GROQ queries for all content types
**Query Functions:**

**Projects:**
- `getAllProjects(category?)` — All projects with optional category filter
- `getFeaturedProjects()` — Featured projects only
- `getProjectBySlug(slug)` — Single project with full details
- `getProjectSlugs()` — All project slugs for static generation
- `getProjectCategories()` — Distinct categories
- `searchProjectsByTags(tags)` — Filter by multiple tags
- `getProjectStats()` — Count and analytics

**Posts:**
- `getAllPosts(category?)` — All posts with optional category filter
- `getPostBySlug(slug)` — Single post with content
- `getPostSlugs()` — All post slugs
- `getRecentPosts(limit)` — Latest N posts
- `getPostCategories()` — Distinct categories
- `getPostStats()` — Count and analytics

**Configuration:**
- `getNavigation()` — Navigation structure
- `getSiteSettings()` — Global settings
- `getAboutPage()` — About page content

**Size:** ~9.5 KB

#### `/sanity/types.ts`
**Purpose:** TypeScript type definitions for all schema types
**Types Exported:**
- `PortableTextBlock`, `PortableTextImage`, `PortableText`
- `SanityImage`, `Slug`
- `Project`, `Post`
- `NavItem`, `Navigation`
- `SocialLink`, `SiteSettings`
- `Exhibition`, `About`
**Type Guards:**
- `isProject()`, `isPost()`, `isNavigation()`, etc.
**Constants:**
- `PROJECT_CATEGORIES` — 'street' | 'travel' | 'landscape' | 'portrait' | 'architecture' | 'documentary'
- `POST_CATEGORIES` — 'photo-essay' | 'travel-notes' | 'gear' | 'behind-the-images'
- `SOCIAL_PLATFORMS` — 'instagram' | 'twitter' | 'facebook' | etc.
**Usage:** Import types and guards for frontend components
**Size:** ~7.8 KB

### Configuration Files

#### `/sanity/sanity.config.ts`
**Purpose:** Sanity Studio configuration
**Contents:**
- Studio plugins (structureTool, visionTool)
- Custom content structure/menu
- Schema type registration
- Project and dataset configuration
**Plugins:**
- structureTool — Custom content organization
- visionTool — GROQ query playground
**Size:** ~2.3 KB

### Documentation & Setup Files

#### `/.env.example`
**Purpose:** Environment variables template
**Variables:**
- NEXT_PUBLIC_SANITY_PROJECT_ID — Your Sanity project ID
- NEXT_PUBLIC_SANITY_DATASET — Your dataset (usually "production")
- NEXT_PUBLIC_SANITY_API_VERSION — API version (default: 2024-01-01)
**Instructions:** Copy to .env.local and fill in your values
**Size:** ~0.3 KB

#### `/CMS_QUICK_START.md`
**Purpose:** Photographer-friendly guide to using the CMS
**Contents:**
- How to access the studio
- Common tasks (add projects, write posts, edit settings)
- Tips and best practices
- Formatting text guide
- Managing images
- Common mistakes to avoid
**Audience:** Photographers/content creators
**Size:** ~7.2 KB

#### `/SANITY_SETUP.md`
**Purpose:** Detailed setup and configuration guide
**Contents:**
- Step-by-step installation
- Schema overview for each type
- Using the Sanity Studio
- API and query examples
- Image optimization guide
- Project structure overview
- Common tasks and workflows
- Best practices
- Troubleshooting
**Audience:** Developers and technical users
**Size:** ~12.5 KB

#### `/DEPENDENCIES.md`
**Purpose:** Required npm packages and versions
**Contents:**
- Core packages (sanity, @sanity/client, @sanity/image-url)
- Studio tools (@sanity/structure, @sanity/vision)
- TypeScript support
- Full package.json example
- Version compatibility info
- Installation steps
- Optional enhancements
**Audience:** Developers
**Size:** ~4.8 KB

#### `/README_SANITY.md`
**Purpose:** Complete technical reference and architecture guide
**Contents:**
- Project overview and features
- Complete project structure
- Quick start guide
- Detailed file descriptions
- Usage examples for all queries
- Environment variable setup
- Deployment instructions
- Schema categories and options
- Best practices
- Troubleshooting guide
- Resources and next steps
**Audience:** Developers
**Size:** ~14.2 KB

#### `/SANITY_FILES_INDEX.md`
**Purpose:** This file - complete index of all Sanity files
**Contents:** Directory structure, file descriptions, file sizes, purposes
**Size:** Variable

## File Statistics

| Category | Count | Size |
|----------|-------|------|
| Schema files | 7 | ~23.1 KB |
| Library files | 3 | ~13.5 KB |
| Types file | 1 | ~7.8 KB |
| Config file | 1 | ~2.3 KB |
| Documentation | 5 | ~39.0 KB |
| **Total** | **17** | **~85.7 KB** |

## Dependencies Summary

### Required NPM Packages
```
sanity ^3.0.0
@sanity/client ^6.0.0
@sanity/image-url ^1.0.0
@sanity/structure ^3.0.0
@sanity/vision ^3.0.0
```

### Installation
```bash
npm install @sanity/client @sanity/image-url sanity @sanity/structure @sanity/vision
```

## Quick Integration Checklist

- [ ] Install dependencies
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add Sanity Project ID to `.env.local`
- [ ] Run `npm run sanity:build` to deploy schema
- [ ] Access Studio at `https://[project].sanity.studio`
- [ ] Create initial content (about page, site settings)
- [ ] Test queries in queries.ts
- [ ] Import types.ts in your components
- [ ] Use image.ts for optimized image URLs

## Import Examples

```typescript
// Schemas
import { schemaTypes } from '@/sanity/schemas';

// Client and images
import { client, urlFor } from '@/sanity/lib/client';
import { getImageUrl, getResponsiveImageUrls } from '@/sanity/lib/image';

// Queries
import {
  getAllProjects,
  getProjectBySlug,
  getAllPosts,
  getSiteSettings,
  getAboutPage,
  getNavigation
} from '@/sanity/lib/queries';

// Types
import {
  Project,
  Post,
  SiteSettings,
  About,
  isProject,
  PROJECT_CATEGORIES
} from '@/sanity/types';

// Configuration
import sanityConfig from '@/sanity/sanity.config';
```

## File Locations

All files are located under: `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/`

### Absolute Paths

- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/blockContent.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/project.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/post.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/navigation.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/siteSettings.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/about.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/schemas/index.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/lib/client.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/lib/image.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/lib/queries.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/types.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/sanity/sanity.config.ts`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/.env.example`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/CMS_QUICK_START.md`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/SANITY_SETUP.md`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/DEPENDENCIES.md`
- `/sessions/eager-tender-keller/mnt/outputs/dc-portfolio/README_SANITY.md`

## Next Steps

1. **Read** `README_SANITY.md` for technical overview
2. **Follow** `SANITY_SETUP.md` for installation
3. **Install** packages from `DEPENDENCIES.md`
4. **Configure** `.env.local` with your credentials
5. **Deploy** schema with `npm run sanity:build`
6. **Access** Studio at project URL
7. **Reference** `CMS_QUICK_START.md` for daily use

---

**Total Files Created:** 17
**Total Size:** ~85.7 KB
**Status:** ✅ Production-ready
