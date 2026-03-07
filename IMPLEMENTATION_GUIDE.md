# DC Photography Portfolio - Implementation Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Get these values from your Sanity project settings.

### 3. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to see the site.

### 4. Create Sanity Content
Add content to your Sanity CMS:
- Projects (with title, slug, cover image, gallery, category, location, date)
- Posts (with title, slug, cover image, excerpt, body, category, publish date)
- Site Settings (name, tagline, hero image, social links)
- About Page (portrait, bio, equipment list, exhibitions)
- Navigation Structure (menu items with links)

---

## File Structure Overview

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout wrapper
│   ├── globals.css              # Global styles
│   ├── page.tsx                 # Homepage
│   ├── about/page.tsx           # About page
│   ├── contact/page.tsx         # Contact form
│   ├── journal/page.tsx         # Blog listing
│   ├── journal/[slug]/page.tsx  # Blog post detail
│   ├── work/[slug]/page.tsx     # Project detail
│   └── api/contact/route.ts     # Contact API
└── components/                   # Reusable components
    ├── Navigation.tsx
    ├── Footer.tsx
    ├── ProjectGrid.tsx
    ├── FilterBar.tsx
    ├── JournalScroll.tsx
    ├── Lightbox.tsx
    └── PortableTextRenderer.tsx
```

---

## Component Usage Reference

### ProjectGrid
Display a grid of projects with asymmetric layout.

```tsx
import ProjectGrid from '@/components/ProjectGrid';

const projects = await getAllProjects();

<ProjectGrid projects={projects} />
```

**Props:**
- `projects`: Array of project objects with _id, title, slug, coverImage, category, featured

### FilterBar
Display filterable chips for category selection.

```tsx
'use client';

import { useState } from 'react';
import FilterBar from '@/components/FilterBar';

const [activeFilter, setActiveFilter] = useState<string | null>(null);

<FilterBar 
  onFilterChange={setActiveFilter}
  activeFilter={activeFilter}
/>
```

**Props:**
- `onFilterChange`: Callback function receiving category string or null
- `activeFilter`: Currently active filter (optional)

### JournalScroll
Horizontal carousel of journal posts.

```tsx
import JournalScroll from '@/components/JournalScroll';

const posts = await getRecentPosts(6);

<JournalScroll posts={posts} />
```

**Props:**
- `posts`: Array of post objects with _id, title, slug, coverImage, excerpt, publishedAt, category

### Lightbox
Fullscreen image viewer with keyboard/touch navigation.

```tsx
'use client';

import { useState } from 'react';
import Lightbox from '@/components/Lightbox';

const [isOpen, setIsOpen] = useState(false);
const [index, setIndex] = useState(0);

<Lightbox
  images={galleryImages}
  initialIndex={index}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**Props:**
- `images`: Array of image objects with asset and alt properties
- `initialIndex`: Starting image index (optional)
- `isOpen`: Boolean controlling visibility
- `onClose`: Callback when closing

### PortableTextRenderer
Render Sanity portable text content with formatting.

```tsx
import PortableTextRenderer from '@/components/PortableTextRenderer';

<PortableTextRenderer blocks={post.body} />
```

**Props:**
- `blocks`: Array of block objects from Sanity portable text
- `className`: Additional CSS classes (optional)

### Navigation
Fixed navigation bar with mobile menu (auto-connected to Sanity).

```tsx
import Navigation from '@/components/Navigation';

// Use in layout.tsx - auto-fetches from Sanity
<Navigation />
```

### Footer
Footer with navigation and social links (auto-connected to Sanity).

```tsx
import Footer from '@/components/Footer';

// Use in layout.tsx - auto-fetches from Sanity
<Footer />
```

---

## Customization Guide

### Change Colors
Edit `tailwind.config.ts`:

```typescript
colors: {
  bg: '#0a0a0a',          // Main background
  surface: '#131212',     // Card/surface background
  border: '#232120',      // Borders
  text: '#e6e3de',        // Primary text
  muted: '#7a7570',       // Secondary text
  accent: '#b8a99a',      // Primary accent
  cool: '#8a9aa0',        // Secondary accent
},
```

### Change Typography
Edit `tailwind.config.ts`:

```typescript
fontFamily: {
  serif: ['Cormorant Garamond', 'serif'],
  sans: ['Inter', 'sans-serif'],
},
```

Or import different fonts in `layout.tsx`:

```tsx
import { Playfair_Display, Poppins } from 'next/font/google';

const serif = Playfair_Display({ ... });
const sans = Poppins({ ... });
```

### Adjust Breakpoints
Mobile-first classes are built into components:
- `sm:` - Tablet (640px)
- `lg:` - Desktop (1024px)

To change, edit `tailwind.config.ts`:

```typescript
extend: {
  screens: {
    sm: '640px',   // Tablet
    md: '768px',   // Medium
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large desktop
  },
},
```

### Modify Navigation Links
Edit the Sanity navigation document (referenced by `getNavigation()`):

Each item should have:
```json
{
  "label": "Work",
  "href": "/work",
  "isExternal": false,
  "order": 1
}
```

Or hardcode fallback in `Navigation.tsx`:

```tsx
const navItems = [
  { label: 'Work', href: '/work' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
];
```

---

## Feature Implementation Examples

### Add Email Integration to Contact Form

Update `src/app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate data...

    // Send email
    const response = await resend.emails.send({
      from: 'noreply@dcphotography.com',
      to: process.env.CONTACT_EMAIL!,
      replyTo: data.email,
      subject: `New Contact: ${data.name}`,
      html: `<p>${data.message}</p>`,
    });

    if (!response.data) throw new Error('Failed to send email');

    return NextResponse.json({ message: 'Email sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

### Add Analytics

Install Vercel Analytics:
```bash
npm install @vercel/analytics @vercel/web-vitals
```

Update `layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Add Image Placeholders

For projects without cover images, update `ProjectGrid.tsx`:

```tsx
const placeholders = [
  '📸', '🖼️', '🌅', '🎨', '📷'
];

const randomEmoji = placeholders[Math.floor(Math.random() * placeholders.length)];

// In JSX:
{!hasImage && (
  <div className="text-6xl">{randomEmoji}</div>
)}
```

---

## Performance Optimization Tips

### Enable ISR (Incremental Static Regeneration)

For frequently updated content, add revalidate interval to routes:

```tsx
// src/app/journal/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export default function JournalPage() {
  // ...
}
```

### Optimize Images

Adjust Sanity image URLs for different screen sizes:

```tsx
const mobileUrl = urlFor(image)
  .width(600)
  .height(400)
  .url();

const desktopUrl = urlFor(image)
  .width(1200)
  .height(800)
  .url();
```

### Code Splitting

Keep component bundles small:

```tsx
// Only load lightbox when needed
import dynamic from 'next/dynamic';

const Lightbox = dynamic(() => import('@/components/Lightbox'), {
  loading: () => <p>Loading...</p>,
});
```

---

## Debugging Tips

### Check Sanity Connection

Add logging to queries:

```typescript
export async function getProjectBySlug(slug: string) {
  const query = `*[_type == "project" && slug.current == "${slug}"][0] { ... }`;
  
  console.log('Fetching project with slug:', slug);
  const data = await client.fetch(query);
  console.log('Received data:', data);
  
  return data;
}
```

### Monitor Network Requests

Check browser DevTools → Network tab:
- Image URLs should load from Sanity CDN
- API requests to `/api/contact` should return 200

### Check Console Errors

Browser DevTools → Console:
- Look for image load errors
- Form submission errors
- Sanity API errors

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
4. Deploy automatically on push

### Pre-deployment Checklist

- [ ] All Sanity documents created and published
- [ ] Environment variables configured
- [ ] Contact form email integration working
- [ ] Images optimized (not too large)
- [ ] Navigation links correct
- [ ] Mobile layout tested on device
- [ ] SEO metadata filled in
- [ ] Analytics configured (optional)
- [ ] Error tracking set up (optional)

---

## Troubleshooting

### Images Not Loading

**Issue:** Gray placeholder boxes instead of images

**Solutions:**
1. Check Sanity project ID in .env.local
2. Verify image assets exist in Sanity
3. Check browser console for 404 errors
4. Test Sanity image URL directly in browser

### Sanity Not Connecting

**Issue:** "Missing environment variables" error

**Solutions:**
1. Create .env.local file in project root
2. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
3. Restart development server with `npm run dev`

### Mobile Menu Not Working

**Issue:** Hamburger menu doesn't open/close

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify Navigation component is imported in layout.tsx
3. Test touch/click on mobile device (not just browser resize)

### Contact Form Not Submitting

**Issue:** Form stays loading or shows error

**Solutions:**
1. Check browser console for fetch errors
2. Verify `/api/contact` endpoint exists and is accessible
3. Check form validation (name, email format, message length)
4. Look for CORS issues in network tab

---

## Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Sanity Docs:** https://www.sanity.io/docs
- **React Docs:** https://react.dev

---

For questions or issues, refer to the COMPONENT_STRUCTURE.md file for detailed component documentation.
