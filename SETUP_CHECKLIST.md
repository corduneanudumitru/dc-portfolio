# Sanity CMS Setup Checklist

Step-by-step checklist to get your photography portfolio CMS running.

## Pre-Setup

- [ ] You have a Sanity account (sign up at [sanity.io](https://www.sanity.io))
- [ ] You have Node.js 16+ installed
- [ ] You have npm or yarn installed
- [ ] You have a Next.js project ready or know where to integrate

## Step 1: Get Your Sanity Credentials

- [ ] Go to [manage.sanity.io](https://manage.sanity.io)
- [ ] Select or create your project
- [ ] Copy your **Project ID**
- [ ] Note your **Dataset name** (usually "production")
- [ ] Keep these safe—you'll need them for `.env.local`

## Step 2: Prepare Your Environment

```bash
# Navigate to your project root
cd your-project-folder

# Copy the example environment file
cp .env.example .env.local
```

- [ ] `.env.local` file created
- [ ] Opened `.env.local` in your editor
- [ ] Filled in `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] Filled in `NEXT_PUBLIC_SANITY_DATASET`
- [ ] Filled in `NEXT_PUBLIC_SANITY_API_VERSION` (optional, defaults to 2024-01-01)

**Your `.env.local` should look like:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz789
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

## Step 3: Install Dependencies

```bash
npm install @sanity/client @sanity/image-url sanity @sanity/structure @sanity/vision
```

Or with yarn:
```bash
yarn add @sanity/client @sanity/image-url sanity @sanity/structure @sanity/vision
```

- [ ] All packages installed successfully
- [ ] No error messages during installation
- [ ] `package.json` updated with new dependencies
- [ ] `node_modules` folder created

## Step 4: Verify Schema Files

Check that all schema files are in place:

- [ ] `sanity/schemas/index.ts`
- [ ] `sanity/schemas/blockContent.ts`
- [ ] `sanity/schemas/project.ts`
- [ ] `sanity/schemas/post.ts`
- [ ] `sanity/schemas/navigation.ts`
- [ ] `sanity/schemas/siteSettings.ts`
- [ ] `sanity/schemas/about.ts`

## Step 5: Verify Library Files

Check that all library files are in place:

- [ ] `sanity/lib/client.ts`
- [ ] `sanity/lib/image.ts`
- [ ] `sanity/lib/queries.ts`

## Step 6: Verify Configuration Files

- [ ] `sanity/sanity.config.ts`
- [ ] `sanity/types.ts`

## Step 7: Deploy Schema to Sanity

This step registers your schema with Sanity's backend.

```bash
npm run sanity:build
```

Or using Sanity CLI directly:
```bash
npx sanity deploy
```

- [ ] Command ran without errors
- [ ] You saw confirmation message
- [ ] Schema deployed to Sanity backend

## Step 8: Access Sanity Studio

Choose one of these options:

### Option A: Local Development
```bash
npm run dev
```
Then visit: `http://localhost:3000/studio`

- [ ] Development server started
- [ ] Studio accessible at localhost
- [ ] Can see the content management interface

### Option B: Managed Studio
- [ ] Go to `https://[your-project-id].sanity.studio`
- [ ] Log in with your Sanity account
- [ ] See the content management interface

## Step 9: Create Initial Content

Create these singleton documents first:

### Site Settings
- [ ] Click "Site Settings" in the left menu
- [ ] Fill in:
  - [ ] Site Name (your portfolio name)
  - [ ] Tagline (optional)
  - [ ] SEO Title
  - [ ] SEO Description
  - [ ] Contact Email
  - [ ] Add social media links (Instagram, etc.)
- [ ] Click "Publish"

### About Page
- [ ] Click "About Page" in the left menu
- [ ] Fill in:
  - [ ] Your portrait image
  - [ ] Title (e.g., "About Me")
  - [ ] Short bio (2-3 sentences)
  - [ ] Full bio (with rich formatting)
  - [ ] Equipment list (optional)
- [ ] Click "Publish"

### Navigation
- [ ] Click "Navigation" in the left menu
- [ ] Add menu items:
  - [ ] Home (/)
  - [ ] Projects (/projects)
  - [ ] Blog (/blog)
  - [ ] About (/about)
  - [ ] Contact (/contact)
- [ ] Set order numbers
- [ ] Click "Publish"

## Step 10: Test Creating Content

### Create a Test Project
- [ ] Click "Projects" → "Create"
- [ ] Fill in:
  - [ ] Title
  - [ ] Category
  - [ ] Cover Image
  - [ ] Description
  - [ ] Add 1-2 gallery images
- [ ] Click "Publish"
- [ ] ✅ You should see it in the Projects list

### Create a Test Blog Post
- [ ] Click "Blog Posts" → "Create"
- [ ] Fill in:
  - [ ] Title
  - [ ] Category
  - [ ] Excerpt
  - [ ] Body content
- [ ] Set publish date
- [ ] Click "Publish"
- [ ] ✅ You should see it in the Posts list

## Step 11: Test Queries

If using Next.js, test fetching data:

```typescript
// pages/api/test.ts (or your route)
import { getAllProjects, getSiteSettings } from '@/sanity/lib/queries';

export default async function handler(req, res) {
  try {
    const projects = await getAllProjects();
    const settings = await getSiteSettings();

    res.status(200).json({
      projects: projects.length,
      siteName: settings?.siteName,
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

- [ ] API route created and tested
- [ ] Data fetches successfully
- [ ] No console errors

## Step 12: Documentation Review

Read these in order:

1. [ ] `README_SANITY.md` — Technical overview
2. [ ] `SANITY_SETUP.md` — Detailed guides
3. [ ] `CMS_QUICK_START.md` — For photographers/content creators
4. [ ] `DEPENDENCIES.md` — Package reference

## Step 13: Frontend Integration

When ready to build your site:

- [ ] Import queries from `sanity/lib/queries.ts`
- [ ] Import types from `sanity/types.ts`
- [ ] Use image URLs from `sanity/lib/image.ts`
- [ ] Create pages for projects, posts, etc.
- [ ] Test image loading and rendering

## Optional: Advanced Setup

### Enable Image Optimization
- [ ] Read `DEPENDENCIES.md` for optional packages
- [ ] Install recommended optimization packages

### Set Up Webhooks
- [ ] Go to Sanity project settings
- [ ] Add webhook for your hosting platform
- [ ] Configure rebuild trigger on document publish

### Add More Schemas
- [ ] Review schema patterns in existing files
- [ ] Create additional document types as needed
- [ ] Update `sanity/schemas/index.ts` with exports

## Troubleshooting

### Issue: "Cannot find module @sanity/client"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev  # restart dev server
```

### Issue: Studio not loading
**Solution:**
1. Check `.env.local` has correct Project ID
2. Clear browser cache
3. Restart development server

### Issue: "NEXT_PUBLIC_SANITY_PROJECT_ID not found"
**Solution:**
1. Copy `.env.example` to `.env.local`
2. Fill in all variables
3. Restart dev server (crucial!)

### Issue: Images not loading
**Solution:**
1. Verify image uploaded completely in Sanity
2. Check alt text is filled in
3. Clear browser cache
4. Verify image URL in console

### Issue: Slug not unique
**Solution:**
1. Change project/post title
2. Click regenerate icon next to slug
3. Or manually edit slug to be unique

### Issue: Query returning null
**Solution:**
1. Check document is published (not draft)
2. Verify field names match schema
3. Check slug parameter is correct
4. Try query in Vision tool in Studio

## Success Checklist

- [ ] Environment configured
- [ ] Dependencies installed
- [ ] Schema deployed
- [ ] Studio accessible
- [ ] Site Settings created
- [ ] About Page created
- [ ] Navigation created
- [ ] At least 1 project created
- [ ] At least 1 blog post created
- [ ] Queries tested successfully
- [ ] Documentation reviewed
- [ ] Ready to build frontend

## Next Steps

1. **Learn GROQ** — Read Sanity docs on GROQ query language
2. **Build your frontend** — Create Next.js pages for projects, blog, etc.
3. **Optimize images** — Use `sanity/lib/image.ts` helpers
4. **Deploy** — Push to production (Vercel, Netlify, etc.)
5. **Create content** — Use CMS to add your photography

## Quick Commands Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Deploy Sanity schema
npm run sanity:build

# Access Sanity CLI
npm run sanity -- [command]

# Start Sanity in isolation
npm run sanity start

# See Sanity logs
npm run sanity debug
```

## Support Resources

- **Sanity Docs:** https://www.sanity.io/docs
- **GROQ Guide:** https://www.sanity.io/docs/groq
- **Image API:** https://www.sanity.io/docs/image-url
- **TypeScript:** https://www.sanity.io/docs/typescript
- **Community:** https://slack.sanity.io

## When You're Done

- [ ] Bookmark your Studio URL
- [ ] Save your Project ID somewhere safe
- [ ] Share `CMS_QUICK_START.md` with your photographer/content creator
- [ ] Share `.env.example` (NOT `.env.local`!) with your team
- [ ] Begin creating amazing content!

---

**Estimated time to complete:** 30-60 minutes

**Status after checklist:** Ready to build your photography portfolio! 📸
