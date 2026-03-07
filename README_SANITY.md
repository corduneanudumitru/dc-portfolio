# Photography Portfolio - Sanity CMS Configuration

Complete Sanity CMS setup for a photographer's portfolio with full content management capabilities.

## Overview

This portfolio uses **Sanity CMS** as a headless content management system. The photographer can edit everything—projects, blog posts, navigation, site settings, and the about page—directly from the Sanity Studio interface.

### Features

✅ **Photography Projects** with galleries, categories, tags, and metadata
✅ **Blog Posts** with rich text formatting and multiple categories
✅ **Editable Navigation** menu with custom links
✅ **Global Site Settings** (name, tagline, SEO, social links)
✅ **About Page** with biography, portrait, equipment, and exhibitions
✅ **Block Content/Portable Text** for rich, formatted content
✅ **Image Optimization** with responsive URLs and smart cropping
✅ **Type-Safe Queries** with comprehensive GROQ examples
✅ **TypeScript Support** with full type definitions

## Project Structure

```
dc-portfolio/
├── sanity/
│   ├── schemas/                    # Content schema definitions
│   │   ├── index.ts               # Export all schemas
│   │   ├── blockContent.ts        # Rich text/portable text type
│   │   ├── project.ts             # Photography project schema
│   │   ├── post.ts                # Blog post schema
│   │   ├── navigation.ts          # Navigation menu schema
│   │   ├── siteSettings.ts        # Global settings schema
│   │   └── about.ts               # About page schema
│   │
│   ├── lib/                        # Utility functions
│   │   ├── client.ts              # Sanity client initialization
│   │   ├── image.ts               # Image URL builders
│   │   └── queries.ts             # GROQ queries
│   │
│   ├── types.ts                    # TypeScript type definitions
│   └── sanity.config.ts            # Studio configuration
│
├── .env.example                    # Environment variables template
├── CMS_QUICK_START.md             # Photographer quick reference
├── SANITY_SETUP.md                # Detailed setup guide
├── DEPENDENCIES.md                # Required packages
└── README_SANITY.md               # This file
```

## Quick Start

### 1. Install Dependencies
```bash
npm install @sanity/client @sanity/image-url sanity @sanity/structure @sanity/vision
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Deploy Schema
```bash
npm run sanity:build
```

### 4. Access Studio
- **Local:** `http://localhost:3000/studio`
- **Production:** `https://[studio-name].sanity.studio`

## File Descriptions

### Schemas (`sanity/schemas/`)

#### `project.ts` — Photography Projects
Stores individual photography projects with:
- Title, slug, cover image with hotspot
- Gallery array (images + optional captions)
- Category (street, travel, landscape, portrait, architecture, documentary)
- Tags, description, rich body content
- Image count, location, date, featured flag, display order
- Published timestamp

#### `post.ts` — Blog Posts
Blog and journal entries with:
- Title, slug, cover image
- Excerpt for listings
- Rich body content
- Category (photo-essay, travel-notes, gear, behind-the-images)
- Publication date

#### `blockContent.ts` — Rich Text/Portable Text
Reusable block content type for formatted text:
- Headings (H1-H4), normal text, blockquotes
- Lists (bulleted and numbered)
- Inline styling (bold, italic, underline, code, strikethrough)
- Links with target control
- Embedded images with captions

#### `navigation.ts` — Navigation Menu
Editable navigation with:
- Label (menu text)
- Href (URL or path)
- Is External (boolean for external links)
- Order (display sequence)

#### `siteSettings.ts` — Global Configuration (Singleton)
Site-wide settings including:
- Site name, tagline, hero image
- SEO title and description
- Social media links array
- Contact email, footer text

#### `about.ts` — About Page (Singleton)
Photographer biography with:
- Portrait image
- Title (page heading)
- Full bio (portable text)
- Short bio (for homepage teaser)
- Equipment list
- Exhibitions array (title, venue, year)

### Library Files (`sanity/lib/`)

#### `client.ts`
Initializes the Sanity client with environment configuration:
- Creates reusable client instance
- Configures CDN based on environment
- Exports `urlFor()` for image URLs

**Usage:**
```typescript
import { client, urlFor } from '@/sanity/lib/client';

const projects = await client.fetch('*[_type == "project"]');
const imageUrl = urlFor(image).width(800).url();
```

#### `image.ts`
Image optimization helpers for responsive, optimized URLs:
- `getImageUrl()` — Customize dimensions, quality, fitting
- `getResponsiveImageUrls()` — Get mobile/tablet/desktop URLs
- `getThumbnailUrl()` — Quick thumbnails for listings
- `getHeroImageUrl()` — Optimized hero/banner images

**Usage:**
```typescript
import { getImageUrl, getResponsiveImageUrls } from '@/sanity/lib/image';

const url = getImageUrl(image, { width: 800, quality: 85 });
const responsive = getResponsiveImageUrls(image);
// { mobile, tablet, desktop, original }
```

#### `queries.ts`
Pre-built GROQ queries for all content types:

**Projects:**
- `getAllProjects(category?)` — All projects, optionally filtered by category
- `getFeaturedProjects()` — Featured projects only
- `getProjectBySlug(slug)` — Single project with full details
- `getProjectSlugs()` — All project slugs (for static generation)
- `getProjectCategories()` — Unique categories
- `searchProjectsByTags(tags)` — Filter by tags
- `getProjectStats()` — Project counts and analytics

**Blog Posts:**
- `getAllPosts(category?)` — All posts, optionally filtered
- `getPostBySlug(slug)` — Single post with content
- `getPostSlugs()` — All post slugs
- `getRecentPosts(limit)` — Latest posts
- `getPostCategories()` — Unique categories
- `getPostStats()` — Post counts

**Configuration:**
- `getNavigation()` — Menu structure
- `getSiteSettings()` — Global site config
- `getAboutPage()` — About page content

### Types (`sanity/types.ts`)

Complete TypeScript definitions for all document types:
- `Project`, `Post`, `Navigation`, `SiteSettings`, `About`
- `SanityImage`, `PortableText`, `Slug`, `NavItem`
- Type guards: `isProject()`, `isPost()`, etc.
- Enums: `PROJECT_CATEGORIES`, `POST_CATEGORIES`, `SOCIAL_PLATFORMS`

**Usage:**
```typescript
import { Project, Post, isProject } from '@/sanity/types';

const data = await getProjectBySlug('iceland');
if (isProject(data)) {
  console.log(data.title); // TypeScript knows data is a Project
}
```

### Configuration (`sanity.config.ts`)

Sanity Studio configuration with:
- Custom content structure menu
- Studio plugins (structure, vision)
- Schema registration
- Project and dataset configuration

## Usage Examples

### Fetch All Projects
```typescript
import { getAllProjects } from '@/sanity/lib/queries';

const projects = await getAllProjects();
// Returns: Project[]
```

### Filter Projects by Category
```typescript
const landscapes = await getAllProjects('landscape');
const streets = await getAllProjects('street');
```

### Get Featured Projects
```typescript
import { getFeaturedProjects } from '@/sanity/lib/queries';

const featured = await getFeaturedProjects();
// For homepage hero section
```

### Get Project for Slug Page
```typescript
import { getProjectBySlug } from '@/sanity/lib/queries';

const project = await getProjectBySlug('iceland-adventure');
console.log(project.title);
console.log(project.body); // Portable text content
console.log(project.gallery); // Array of gallery images
```

### Fetch Blog Posts
```typescript
import { getAllPosts, getRecentPosts } from '@/sanity/lib/queries';

const allPosts = await getAllPosts();
const recent = await getRecentPosts(5); // Last 5 posts
const essays = await getAllPosts('photo-essay'); // Filter by category
```

### Get Single Blog Post
```typescript
import { getPostBySlug } from '@/sanity/lib/queries';

const post = await getPostBySlug('my-Iceland-journey');
console.log(post.title);
console.log(post.body); // Rich content
console.log(post.excerpt); // Summary
```

### Optimize Images
```typescript
import { getImageUrl, getResponsiveImageUrls } from '@/sanity/lib/image';

// Single optimized URL
const thumbnail = getImageUrl(project.coverImage, {
  width: 400,
  height: 300,
  fit: 'crop',
  quality: 75,
});

// Responsive URLs for different screens
const responsive = getResponsiveImageUrls(project.coverImage);
// responsive.mobile (640px)
// responsive.tablet (1024px)
// responsive.desktop (1920px)
// responsive.original (auto format)
```

### Get Site Configuration
```typescript
import { getSiteSettings, getNavigation, getAboutPage } from '@/sanity/lib/queries';

const settings = await getSiteSettings();
console.log(settings.siteName); // "My Photography"
console.log(settings.seoTitle); // "My Photography | Visual Storyteller"
console.log(settings.socialLinks); // [{ platform, url }]

const nav = await getNavigation();
nav.items.forEach(item => {
  console.log(item.label, item.href, item.order);
});

const about = await getAboutPage();
console.log(about.shortBio); // Homepage teaser
console.log(about.bio); // Full portable text
console.log(about.equipment); // ["Canon R5", "Nikon Z9"]
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

**Getting your Project ID:**
1. Go to [manage.sanity.io](https://manage.sanity.io)
2. Select your project
3. Copy the Project ID
4. Dataset is usually "production"

## Deployment

### Build for Production
```bash
npm run build
npm run sanity:build
```

### Deploy Studio
```bash
sanity deploy
```

### Configure Webhooks (Optional)
Set up webhooks in Sanity to trigger rebuilds when content changes:
1. Go to Sanity project settings
2. Add webhook URL from your host (Vercel, Netlify, etc.)
3. Select which document types trigger rebuilds

## Schema Categories & Options

### Project Categories
- `street` — Street photography
- `travel` — Travel photography
- `landscape` — Landscape and nature
- `portrait` — Portrait photography
- `architecture` — Architectural photography
- `documentary` — Documentary photography

### Post Categories
- `photo-essay` — Photo essays and stories
- `travel-notes` — Travel-related posts
- `gear` — Camera and gear reviews
- `behind-the-images` — Behind-the-scenes content

### Social Platforms
- instagram, twitter, facebook, linkedin, behance, flickr, youtube, tiktok

## Best Practices

### Content Quality
- Use high-resolution images (2000px+)
- Write descriptive, keyword-rich titles
- Complete all alt text fields for accessibility
- Use meaningful slugs (auto-generated from title)
- Tag projects for better discoverability

### SEO
- Site Settings: Keep name and tagline consistent
- Write compelling meta descriptions (150-160 chars)
- Use appropriate keywords in titles
- Ensure all images have alt text

### Maintenance
- Update portfolio regularly with new projects
- Keep blog fresh with recent posts
- Verify social media links are current
- Review and update your about section annually

### Images
- Use hotspot on cover images for smart mobile cropping
- Keep gallery images in consistent aspect ratios
- Add captions to important gallery images
- Optimize file sizes before uploading

## Troubleshooting

### Images Not Loading
- Verify image is fully uploaded in Sanity
- Check alt text is filled in
- Ensure image asset exists in dataset
- Clear browser cache

### GROQ Query Errors
- Verify project ID and dataset in `.env.local`
- Check field names match schema definitions
- Ensure document types are published
- Review GROQ syntax in queries.ts

### TypeScript Errors
- Run `npm install` to get latest types
- Check that types.ts is imported correctly
- Verify Sanity version matches installation

### Slug Not Unique
- Change the title and regenerate
- Check for duplicate slugs across all docs
- Manually edit slug to be unique

### Environment Variables
- Copy `.env.example` exactly to `.env.local`
- Restart dev server after changing env vars
- Ensure Project ID is correct (no spaces)
- Check NEXT_PUBLIC_ prefix for client-side vars

## Resources

- **Sanity Docs:** https://www.sanity.io/docs
- **GROQ Reference:** https://www.sanity.io/docs/groq
- **Portable Text Spec:** https://www.sanity.io/docs/block-content-specification
- **Image URL API:** https://www.sanity.io/docs/image-url
- **TypeScript Guide:** https://www.sanity.io/docs/typescript
- **Schema Reference:** https://www.sanity.io/docs/schema-types

## Support Documents

1. **CMS_QUICK_START.md** — For photographers (how to use the CMS)
2. **SANITY_SETUP.md** — Detailed setup and configuration guide
3. **DEPENDENCIES.md** — Required packages and versions
4. **This file** — Technical reference and architecture

## Next Steps

1. Read `CMS_QUICK_START.md` for day-to-day content management
2. Follow `SANITY_SETUP.md` for detailed setup instructions
3. Review `DEPENDENCIES.md` to install required packages
4. Check example queries in `sanity/lib/queries.ts`
5. Use `sanity/types.ts` for TypeScript definitions in your app

---

**Happy creating!** Your photography portfolio is ready to manage with Sanity CMS. 📸
