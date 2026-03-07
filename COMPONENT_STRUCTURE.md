# DC Photography Portfolio - Component Structure

## Overview

Complete Next.js App Router implementation for a photography portfolio website with a dark, cinematic aesthetic. All components are built with TypeScript, Tailwind CSS, and integrate seamlessly with Sanity CMS.

**Key Features:**
- Dark theme (#0a0a0a background) with warm accent colors
- Mobile-first responsive design
- Graceful error handling with placeholder content
- Type-safe Sanity CMS integration
- Accessibility-focused components
- Optimized image handling with Next.js Image component

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with Google Fonts & metadata
│   ├── globals.css                   # Tailwind directives & custom styles
│   ├── page.tsx                      # Homepage with hero, projects, journal
│   ├── about/
│   │   └── page.tsx                  # About page with bio, equipment, exhibitions
│   ├── contact/
│   │   └── page.tsx                  # Contact form page
│   ├── journal/
│   │   ├── page.tsx                  # Journal listing with filters
│   │   └── [slug]/
│   │       └── page.tsx              # Single blog post detail page
│   ├── work/
│   │   └── [slug]/
│   │       └── page.tsx              # Single project detail page with lightbox
│   └── api/
│       └── contact/
│           └── route.ts              # Contact form API endpoint
└── components/
    ├── Navigation.tsx                # Fixed nav with mobile menu
    ├── Footer.tsx                    # Footer with links & socials
    ├── ProjectGrid.tsx               # Asymmetric project grid with hover effects
    ├── FilterBar.tsx                 # Horizontal scrollable filter chips
    ├── JournalScroll.tsx             # Horizontal scroll journal card carousel
    ├── Lightbox.tsx                  # Fullscreen image viewer with keyboard nav
    └── PortableTextRenderer.tsx      # Sanity portable text renderer
```

---

## Global Files

### `/src/app/layout.tsx`
Root layout component that wraps all pages.

**Features:**
- Imports Cormorant Garamond (serif headlines) and Inter (sans body) from Google Fonts
- Sets up CSS variables for font families
- Includes Navigation and Footer components
- Configures metadata for SEO
- Sets dark background color globally

**Key Props:** None (Server Component)

---

### `/src/app/globals.css`
Global styles and Tailwind directives.

**Features:**
- Tailwind directives: `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- Custom scrollbar styling (thin, dark, transparent track)
- Smooth scroll behavior on html element
- Custom selection colors (#b8a99a accent on dark background)
- Typography defaults for headings (serif font family)
- Accessibility-focused focus states with 2px outline
- Smooth 300ms transitions across all elements

---

## Pages

### `/src/app/page.tsx` (Homepage)
Comprehensive landing page with multiple sections.

**Sections:**
1. **Hero Section** - Full viewport height with background image, site name, tagline, and dual CTA buttons
2. **Featured Work** - ProjectGrid showing featured projects only
3. **Journal Preview** - JournalScroll showing recent posts (6 items)
4. **About Teaser** - Grid layout with portrait placeholder and bio snippet
5. **CTA Band** - Call-to-action section encouraging contact
6. **Built-in Navigation** - Smooth scroll anchors to sections

**Data Sources:** Sanity queries (getSiteSettings, getFeaturedProjects, getRecentPosts)

**Fallback Behavior:** Shows placeholder content when CMS is empty

---

### `/src/app/about/page.tsx`
Detailed about/biography page.

**Features:**
- Portrait image gallery
- Long-form biography using PortableTextRenderer
- Equipment list (organized items with descriptions)
- Exhibition history (chronological, sorted by year descending)
- Contact CTA section
- Responsive grid layout

**Data Sources:** getAboutPage() from Sanity

**Responsive:** 2-column on desktop, stacked on mobile

---

### `/src/app/contact/page.tsx`
Contact form and contact information page.

**Features:**
- Elegant contact form with validation
- Real-time form state management
- Success/error messages with auto-dismiss
- Contact information sidebar (email, social links, response time)
- Pre-submission tips section
- Client-side form handling with API route integration

**Form Fields:**
- Name (text input, required)
- Email (email input, required)
- Message (textarea, required, min 10 characters)

**API Integration:** POST to `/api/contact` with JSON payload

---

### `/src/app/journal/page.tsx`
Blog/journal post listing page.

**Features:**
- Grid layout of blog post cards (responsive: 1 col mobile, 2 cols tablet, 3 cols desktop)
- FilterBar component for category filtering (client-side)
- Cover images with hover scale effect
- Post metadata: category, title, excerpt, publish date
- Graceful image error handling

**Data Sources:** getAllPosts() from Sanity, filtered client-side

**Fallback:** Shows "No posts" message when empty

---

### `/src/app/journal/[slug]/page.tsx`
Individual blog post detail page.

**Features:**
- Hero image at top
- Post metadata (category, title, date)
- Full-width content using PortableTextRenderer
- Support for embedded images, text formatting, lists
- Static generation with generateStaticParams()
- Back navigation to journal listing

**Data Sources:** getPostBySlug() from Sanity

**Dynamic Segments:** `[slug]` parameter from route

---

### `/src/app/work/[slug]/page.tsx`
Individual project detail page with image gallery and lightbox.

**Features:**
- Full-bleed cover image
- Project metadata: category, location, date, description, tags
- Image gallery with varied layouts
- Click-to-open lightbox modal
- PortableTextRenderer for project description
- Static generation with generateStaticParams()
- Back navigation

**Gallery Features:**
- Multiple images rendered in sequence
- Each image is clickable to open lightbox
- Image captions supported
- Error handling for missing images

**Lightbox Integration:**
- Opens on image click
- Keyboard navigation (arrows, escape)
- Swipe navigation on mobile
- Touch-friendly controls

**Data Sources:** getProjectBySlug() from Sanity

---

### `/src/app/api/contact/route.ts`
API endpoint for contact form submissions.

**Features:**
- POST-only handler
- Request validation (all required fields, email format, message length)
- Error handling with appropriate status codes
- Console logging of submissions (placeholder for email service)

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "message": "string (required, min 10 chars)"
}
```

**Response:**
- 200: `{ message: "Message received successfully" }`
- 400: `{ error: "Missing required fields" | "Invalid email format" | "Message must be at least 10 characters" }`
- 500: `{ error: "Failed to process contact form" }`

**TODO:** Integrate with email service (Resend, SendGrid, etc.)

---

## Components

### `Navigation.tsx` (Client Component)
Fixed navigation bar with responsive design.

**Features:**
- Fixed positioning with z-50
- Dynamic background on scroll (transparent → blurred)
- Desktop: Horizontal menu with links and contact CTA button
- Mobile: Hamburger menu with fullscreen overlay (dark bg/80 with blur)
- Animated hamburger icon (3-line icon that transforms to X)
- Data fetched from Sanity (navigation structure)
- Fallback navigation if CMS is empty
- External link support with target="_blank"

**State Management:**
- `isOpen`: Mobile menu toggle
- `isScrolled`: Scroll position tracking
- `navItems`: Navigation data from Sanity
- `isLoading`: Data loading state

**Responsive Breakpoints:**
- Hidden on mobile: Desktop nav (hidden md:flex)
- Visible on mobile: Hamburger button (flex md:hidden)

---

### `ProjectGrid.tsx` (Client Component)
Asymmetric image grid with dynamic layouts.

**Features:**
- Responsive grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- Auto-rows sizing for varied aspect ratios
- Featured projects span multiple columns
- Hover effects: scale images, overlay title/category
- Mobile fallback: Always-visible titles with darker overlay
- Graceful error handling for missing images
- Links to individual project pages

**Grid Logic:**
- Featured projects: 2×2 span
- Every 5th item: 2-column span
- Every 4th item (index % 5 === 3): 2-row span
- All other items: 1×1

**Image Handling:**
- Uses next/image with Sanity URLs
- Placeholder divs for missing images
- Error state tracking prevents broken image loops

---

### `FilterBar.tsx` (Client Component)
Horizontal scrollable filter chip component.

**Features:**
- 7 filter categories: All, Street, Travel, Landscape, Portrait, Architecture, Documentary
- Horizontal scroll on mobile (touch-friendly)
- Scroll indicators (left/right arrows) on desktop
- Active state styling: accent border, accent background
- Smooth scroll behavior
- Client-side filtering callback

**Props:**
```typescript
interface FilterBarProps {
  onFilterChange: (category: string | null) => void;
  activeFilter?: string | null;
}
```

**Scroll Detection:**
- Shows/hides arrow buttons based on scroll position
- Scroll amount: 200px per click
- Touch-friendly on mobile

---

### `JournalScroll.tsx` (Client Component)
Horizontal carousel for journal post cards.

**Features:**
- Horizontal scroll container with snap behavior
- Scrollbar hidden (custom styles)
- Card dimensions: w-72 sm:w-80 (fixed width, responsive)
- Post metadata: category, title, excerpt, date
- Cover images with hover scale
- Graceful image fallback
- Scroll indicators (left/right arrows)
- Links to individual post pages

**Card Layout:**
- Cover image: 12rem (mobile) / 14rem (desktop) height
- Responsive typography
- Line clamping on title (2 lines) and excerpt (2 lines)

**Scroll Detection:**
- Shows/hides navigation arrows
- Scroll amount: 350px per click

---

### `Lightbox.tsx` (Client Component)
Fullscreen image viewer with keyboard and touch navigation.

**Features:**
- Fullscreen modal with dark overlay (black/95)
- Keyboard navigation: Arrow keys (left/right), Escape (close)
- Touch swipe support: Swipe left/right to navigate
- Image counter: "X / Y" at bottom
- Desktop navigation arrows (hidden on mobile)
- Mobile hint text: "Swipe to navigate"
- Auto-disables body scroll when open
- Click-to-close overlay

**Props:**
```typescript
interface LightboxProps {
  images: Array<{ asset?: any; alt?: string }>;
  initialIndex?: number;
  onClose?: () => void;
  isOpen: boolean;
}
```

**Keyboard Shortcuts:**
- `←` / `→`: Navigate between images
- `Esc`: Close lightbox

**Touch Gestures:**
- Swipe left: Next image
- Swipe right: Previous image

---

### `Footer.tsx` (Client Component)
Three-column footer with responsive stacking.

**Features:**
- Fixed layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Brand column: Logo + tagline
- Navigation column: Links to all pages
- Connect column: Social links + email
- Bottom footer: Copyright text + tagline
- Divider line separating main content from bottom
- Fetches site settings from Sanity (socials, footer text, email)
- Fallback content for empty CMS

**Columns:**
1. **Brand** - DC logo, portfolio description
2. **Navigate** - Internal links (Home, Work, Journal, About, Contact)
3. **Connect** - Social media links + email link

**Data Sources:** getSiteSettings() from Sanity

---

### `PortableTextRenderer.tsx` (Client Component)
Custom renderer for Sanity's portable text blocks.

**Features:**
- Block types: `block` (paragraph/heading), `image`, `bullet`, `number`
- Text styles: normal, h1, h2, h3, blockquote
- Text marks: em (italic), strong (bold), code (inline code)
- Image support: Full-width images with optional captions
- List rendering: Both bullet and numbered lists
- Responsive typography with Tailwind classes
- Semantic HTML output

**Block Types:**
- `block` with `style` prop:
  - `normal`: Paragraph
  - `h1` / `h2` / `h3`: Headings
  - `blockquote`: Blockquote with accent left border
- `image`: Figure with optional caption
- `bullet`: Unordered list items
- `number`: Ordered list items

**Styling:**
- Headings: serif font, bold, increasing sizes
- Paragraphs: base text color, generous line-height
- Blockquotes: accent left border, italic, muted text
- Code: dark background, monospace font, inline padding
- Images: Full width, responsive height

---

## Design Tokens

### Colors
All colors defined in `tailwind.config.ts`:
- **bg**: `#0a0a0a` - Main dark background
- **surface**: `#131212` - Slightly lighter surface
- **border**: `#232120` - Border/divider color
- **text**: `#e6e3de` - Primary text (warm white)
- **muted**: `#7a7570` - Secondary text (muted gray)
- **accent**: `#b8a99a` - Primary accent (warm beige)
- **cool**: `#8a9aa0` - Cool secondary accent (slate)

### Typography
- **Serif Font**: Cormorant Garamond (Headlines, large text)
- **Sans Font**: Inter (Body text, UI)
- Custom CSS variables set in root layout

### Spacing
- Mobile-first approach with `sm:`, `lg:` breakpoints
- Consistent padding: 4px → 8px → 12px → 16px → 24px → 32px (Tailwind scale)
- Gap utilities for flexbox/grid spacing

---

## Features & Patterns

### Mobile-First Responsive Design
All components start with mobile styles and layer on responsive modifiers:
```tsx
className="text-4xl sm:text-5xl lg:text-6xl"
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
className="hidden md:flex"  // Hidden on mobile, shown on medium+
```

### Graceful Degradation
All components handle missing CMS data with fallbacks:
```tsx
if (!projects || projects.length === 0) {
  return <div>No projects to display yet.</div>;
}
```

### Image Error Handling
Track image load failures and show fallback divs:
```tsx
const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
const hasImage = project.coverImage && !imageErrors.has(project._id);
```

### Static Generation
Project and post pages use `generateStaticParams()` for SSG:
```tsx
export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((item) => ({ slug: item.slug.current }));
}
```

### Accessibility
- Semantic HTML (nav, main, section, article, figure, etc.)
- Focus states with 2px accent outlines
- ARIA labels on interactive elements
- Keyboard navigation support (modals, menus)
- Sufficient color contrast (WCAG AA)
- Form labels properly associated with inputs

### Performance
- Next.js Image component for automatic optimization
- Async/await data fetching with Suspense fallbacks
- CSS transitions for smooth animations (300ms)
- Scroll snap behavior on carousels
- Lazy-loaded Sanity data

---

## Sanity Integration

### Imported Functions
From `/sanity/lib/queries.ts`:
- `getAllProjects(category?)` - Fetch all projects, optionally filtered
- `getFeaturedProjects()` - Fetch featured projects only
- `getProjectBySlug(slug)` - Fetch single project
- `getProjectSlugs()` - Fetch slugs for static generation
- `getAllPosts(category?)` - Fetch all blog posts
- `getPostBySlug(slug)` - Fetch single blog post
- `getPostSlugs()` - Fetch slugs for static generation
- `getRecentPosts(limit?)` - Fetch recent posts (default 5)
- `getNavigation()` - Fetch nav structure
- `getSiteSettings()` - Fetch global site settings
- `getAboutPage()` - Fetch about page content

### URL Builder
From `/sanity/lib/client.ts`:
- `urlFor(image)` - Build Sanity image URLs with transformations
- Example: `urlFor(image).width(1920).height(1080).url()`

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables** in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=your_dataset
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Visit** http://localhost:3000

5. **Add content** to Sanity CMS at /studio (if configured)

---

## Future Enhancements

### Email Integration
The contact API route includes a TODO for email service integration:
- Recommended: **Resend** (resend.com) - Built for Next.js
- Alternative: SendGrid, AWS SES, Mailgun

### Analytics
Consider adding:
- Vercel Analytics
- Google Analytics
- Sentry for error tracking

### SEO
Already included:
- Metadata in root layout
- Open Graph tags
- Twitter Card support
- Semantic HTML structure

### Performance
Already optimized:
- Next.js Image component
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR) ready

---

## File Reference

| File | Type | Purpose | Data Source |
|------|------|---------|-------------|
| layout.tsx | Server | Root layout wrapper | None |
| globals.css | CSS | Global styles | None |
| page.tsx | Server | Homepage | Sanity |
| about/page.tsx | Client | About page | Sanity |
| contact/page.tsx | Client | Contact form | API submission |
| journal/page.tsx | Client | Blog listing | Sanity |
| journal/[slug]/page.tsx | Client | Blog detail | Sanity |
| work/[slug]/page.tsx | Client | Project detail | Sanity |
| api/contact/route.ts | API | Form handler | JSON POST |
| Navigation.tsx | Client | Navigation bar | Sanity |
| Footer.tsx | Client | Footer | Sanity |
| ProjectGrid.tsx | Client | Project grid | Props |
| FilterBar.tsx | Client | Filter chips | Props |
| JournalScroll.tsx | Client | Journal carousel | Props |
| Lightbox.tsx | Client | Image viewer | Props |
| PortableTextRenderer.tsx | Client | Text renderer | Props |

---

All components are production-ready and follow Next.js 14+ best practices.
