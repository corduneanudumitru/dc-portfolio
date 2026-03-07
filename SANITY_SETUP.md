# Sanity CMS Setup Guide

This photography portfolio uses Sanity CMS as a headless CMS backend. All content—projects, blog posts, navigation, site settings, and the about page—can be edited directly from the Sanity Studio interface.

## Quick Start

### 1. Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io) and create an account
2. Create a new project
3. Note your **Project ID** and **Dataset name** (usually "production")

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your Sanity credentials:

```bash
cp .env.example .env.local
```

Update `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 4. Initialize Your Dataset

If using Sanity CLI:

```bash
npm install -g @sanity/cli
sanity init
sanity dataset create production
```

### 5. Deploy to Sanity

```bash
npm run build
sanity deploy
```

This publishes your schema to the Sanity backend.

## Schema Overview

### Projects (`project.ts`)
Photography projects are the core of the portfolio. Each project includes:
- **Title** - Project name
- **Slug** - URL-friendly identifier (auto-generated from title)
- **Cover Image** - Main hero image with hotspot support
- **Gallery** - Array of images with optional captions
- **Category** - One of: street, travel, landscape, portrait, architecture, documentary
- **Tags** - Searchable tags
- **Description** - Brief overview for listings
- **Body** - Rich formatted content with images and text
- **Image Count** - Total images in project
- **Location** - Where photographed
- **Date** - Project completion date
- **Featured** - Pin to homepage
- **Order** - Display order (lower = earlier)
- **Published At** - Publication timestamp

### Blog Posts (`post.ts`)
Journal and blog content:
- **Title** - Post title
- **Slug** - URL-friendly identifier
- **Cover Image** - Featured image
- **Excerpt** - Summary for listings
- **Body** - Rich formatted content
- **Category** - One of: photo-essay, travel-notes, gear, behind-the-images
- **Published At** - Publication timestamp

### Navigation (`navigation.ts`)
Editable navigation menu with:
- **Label** - Menu item text
- **Href** - URL or path
- **Is External** - Whether it's an external link
- **Order** - Display order

### Site Settings (`siteSettings.ts`)
Global configuration (singleton document):
- **Site Name** - Your portfolio name
- **Tagline** - Short descriptor
- **Hero Image** - Homepage banner image
- **SEO Title** - Meta title for search engines
- **SEO Description** - Meta description
- **Social Links** - Array of social media profiles
- **Contact Email** - For inquiries
- **Footer Text** - Copyright/footer message

### About Page (`about.ts`)
Your biography (singleton document):
- **Portrait** - Your photo
- **Title** - Page title (e.g., "About Me")
- **Bio** - Full biography with rich formatting
- **Short Bio** - Homepage teaser (2-3 sentences)
- **Equipment** - List of cameras/lenses you use
- **Exhibitions** - Your exhibitions and shows

## Using the Sanity Studio

### Accessing the Studio

**Local Development:**
```bash
npm run dev
# Studio available at http://localhost:3000/studio
```

**Deployed Studio:**
- Go to `https://[your-studio-domain].sanity.studio`

### Content Management Workflow

#### Creating a Project
1. In Sanity Studio, click "Projects"
2. Click "Create"
3. Fill in required fields (title, cover image, category)
4. Add images to the gallery
5. Write description and body content
6. Set project metadata (date, location, order)
7. Click "Publish"

#### Creating a Blog Post
1. Click "Blog Posts"
2. Click "Create"
3. Add title, cover image, excerpt, and category
4. Write rich body content
5. Set publication date
6. Click "Publish"

#### Editing Navigation
1. Click "Navigation"
2. Edit or add menu items
3. Adjust order numbers
4. Mark external links as needed
5. Publish changes

#### Configuring Site Settings
1. Click "Site Settings"
2. Update site name, tagline, SEO metadata
3. Add/edit social media links
4. Set contact email and footer text
5. Publish changes

#### Managing About Page
1. Click "About Page"
2. Upload your portrait
3. Write your biography
4. Add short bio for homepage
5. List your equipment and exhibitions
6. Publish changes

## API & Query Examples

### Fetch All Projects

```typescript
import { getAllProjects } from '@/sanity/lib/queries';

const projects = await getAllProjects();
```

### Filter Projects by Category

```typescript
const landscapeProjects = await getAllProjects('landscape');
```

### Get Featured Projects

```typescript
import { getFeaturedProjects } from '@/sanity/lib/queries';

const featured = await getFeaturedProjects();
```

### Get Single Project by Slug

```typescript
import { getProjectBySlug } from '@/sanity/lib/queries';

const project = await getProjectBySlug('iceland-adventure');
```

### Fetch All Blog Posts

```typescript
import { getAllPosts } from '@/sanity/lib/queries';

const posts = await getAllPosts();
```

### Filter Posts by Category

```typescript
const essays = await getAllPosts('photo-essay');
```

### Get Recent Posts

```typescript
import { getRecentPosts } from '@/sanity/lib/queries';

const latest = await getRecentPosts(5); // 5 most recent
```

### Fetch Navigation

```typescript
import { getNavigation } from '@/sanity/lib/queries';

const nav = await getNavigation();
// Returns: { items: [ {label, href, isExternal, order} ] }
```

### Fetch Site Settings

```typescript
import { getSiteSettings } from '@/sanity/lib/queries';

const settings = await getSiteSettings();
```

### Fetch About Page

```typescript
import { getAboutPage } from '@/sanity/lib/queries';

const about = await getAboutPage();
```

## Image Optimization

The `sanity/lib/image.ts` file provides helpers for optimized images:

```typescript
import { getImageUrl, getResponsiveImageUrls, getThumbnailUrl } from '@/sanity/lib/image';

// Basic optimized URL
const url = getImageUrl(project.coverImage, { width: 800, quality: 85 });

// Responsive URLs for different breakpoints
const responsive = getResponsiveImageUrls(project.coverImage);
// Returns: { mobile, tablet, desktop, original }

// Thumbnail for listings
const thumb = getThumbnailUrl(project.coverImage, 300);

// Hero image optimization
const hero = getHeroImageUrl(siteSettings.heroImage);
```

## Project Structure

```
sanity/
├── schemas/
│   ├── index.ts              # Schema exports
│   ├── blockContent.ts        # Rich text/portable text
│   ├── project.ts            # Photography projects
│   ├── post.ts               # Blog posts
│   ├── navigation.ts         # Navigation menu
│   ├── siteSettings.ts       # Global settings (singleton)
│   └── about.ts              # About page (singleton)
├── lib/
│   ├── client.ts             # Sanity client configuration
│   ├── image.ts              # Image URL builders and optimizers
│   └── queries.ts            # GROQ queries for fetching content
└── sanity.config.ts          # Studio configuration

.env.example                   # Environment variables template
```

## Common Tasks

### Change Site Name
1. Go to Site Settings
2. Edit "Site Name"
3. Publish

### Add a New Project
1. Click Projects → Create
2. Fill in all fields
3. Add gallery images
4. Publish

### Update Navigation
1. Click Navigation
2. Reorder items by changing "Order" numbers
3. Add new items as needed
4. Publish

### Publish a Blog Post
1. Click Blog Posts → Create
2. Fill in content
3. Set "Published At" to current date/time
4. Publish

### Feature a Project
1. Open a project
2. Toggle "Featured Project" to true
3. Publish

## Sanity Best Practices

### SEO
- Use descriptive titles (under 70 characters)
- Write meaningful alt text for all images
- Fill in the SEO title and description in Site Settings

### Content Organization
- Use consistent capitalization in titles
- Tag projects to enable filtering
- Keep descriptions concise (150-500 words)
- Use rich text formatting for readability

### Images
- Use high-quality source images (at least 2000px wide)
- Enable hotspot for cover images (for smart cropping)
- Add alt text to all images for accessibility
- Use consistent image dimensions within galleries

### Publishing
- Always set a publish date for content
- Use meaningful slugs (auto-generated from title)
- Feature only your best work
- Keep portfolio fresh with recent projects

## Troubleshooting

### Images Not Loading
1. Check alt text is filled in
2. Verify image is fully uploaded
3. Clear browser cache
4. Check that the image asset exists in your dataset

### GROQ Query Errors
- Ensure your dataset name matches in `.env.local`
- Verify the project ID is correct
- Check that schema types match your query

### Environment Variables
- Copy `.env.example` to `.env.local` exactly
- Restart development server after changing `.env.local`
- Use `NEXT_PUBLIC_` prefix for client-side variables only

### Slug Not Generating
- Ensure title field is filled in first
- Click regenerate button next to slug field
- Slugs must be unique across projects/posts

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Image URL API](https://www.sanity.io/docs/image-url)
- [Portable Text (Block Content)](https://www.sanity.io/docs/block-content-specification)
- [TypeScript with Sanity](https://www.sanity.io/docs/typescript)

## Support

For issues with:
- **Content editing** → Check Sanity Studio docs
- **Queries/API** → Review `sanity/lib/queries.ts` examples
- **Images** → See image optimization guide above
- **Environment setup** → Verify `.env.local` configuration
