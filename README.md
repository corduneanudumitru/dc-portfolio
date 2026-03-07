# DC Photography Portfolio

A modern, dark-themed photography portfolio website built with Next.js 14, Tailwind CSS, and Sanity CMS.

## Features

- **Dark Cinematic Design**: Custom color palette (#0a0a0a background, warm accent colors)
- **Mobile-First Responsive**: Works seamlessly on all devices (mobile, tablet, desktop)
- **Image Gallery**: Asymmetric grid layout with hover effects and lightbox functionality
- **Blog/Journal Section**: Horizontal scroll carousel with category filtering
- **Contact Form**: Elegant contact page with API validation
- **Sanity CMS Integration**: Fully connected to Sanity for easy content management
- **Performance Optimized**: Static generation, image optimization, code splitting
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels, high contrast

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **CMS**: Sanity
- **Fonts**: Cormorant Garamond (serif), Inter (sans)
- **Image Handling**: Next.js Image component with Sanity integration

## Project Structure

```
dc-portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── page.tsx                # Homepage
│   │   ├── about/page.tsx          # About page
│   │   ├── contact/page.tsx        # Contact form
│   │   ├── journal/
│   │   │   ├── page.tsx            # Blog listing
│   │   │   └── [slug]/page.tsx     # Blog post detail
│   │   ├── work/
│   │   │   └── [slug]/page.tsx     # Project detail
│   │   └── api/contact/route.ts    # Contact API
│   ├── components/
│   │   ├── Navigation.tsx          # Fixed navigation
│   │   ├── Footer.tsx              # Footer
│   │   ├── ProjectGrid.tsx         # Project grid
│   │   ├── FilterBar.tsx           # Filter chips
│   │   ├── JournalScroll.tsx       # Journal carousel
│   │   ├── Lightbox.tsx            # Image viewer
│   │   └── PortableTextRenderer.tsx# Text renderer
│   ├── sanity/
│   │   ├── lib/
│   │   │   ├── client.ts           # Sanity client
│   │   │   └── queries.ts          # Data queries
│   │   └── schemas/                # CMS schemas
│   └── styles/
├── public/
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── COMPONENT_STRUCTURE.md          # Component documentation
├── IMPLEMENTATION_GUIDE.md         # Setup and customization guide
└── FILES_CREATED.txt               # File summary

```

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd dc-portfolio
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 to see the site.

### 4. Build for Production

```bash
npm run build
npm run start
```

## Pages

### Homepage (`/`)
- Full-screen hero section with CTA buttons
- Featured projects grid
- Recent journal posts carousel
- About section teaser
- Call-to-action band

### Work (`/work/[slug]`)
- Full-bleed project hero image
- Project metadata (category, location, date)
- Image gallery with click-to-open lightbox
- Project description with rich text
- Back navigation

### Journal (`/journal`)
- Grid of blog post cards
- Category filtering (client-side)
- Post metadata (category, date, excerpt)
- Responsive image handling

### Blog Post (`/journal/[slug]`)
- Hero image
- Post metadata and date
- Rich text content with formatting
- Image support within content

### About (`/about`)
- Portrait image
- Biography text
- Equipment list
- Exhibition history

### Contact (`/contact`)
- Contact form (name, email, message)
- Contact information
- Social media links
- Pre-submission tips

## Components

### Navigation
- Fixed positioning with scroll detection
- Mobile hamburger menu
- Desktop horizontal menu
- Contact CTA button
- Auto-fetches menu items from Sanity

### ProjectGrid
- Asymmetric layout (1 col mobile → 2 cols tablet → 3 cols desktop)
- Featured projects span multiple columns
- Hover scale effect on images
- Overlay with title and category on hover
- Graceful error handling for missing images

### FilterBar
- Horizontal scroll with navigation arrows
- 7 filter categories
- Active state styling
- Client-side filtering

### JournalScroll
- Horizontal carousel
- Fixed-width cards
- Scroll snap behavior
- Navigation arrows

### Lightbox
- Fullscreen dark overlay
- Keyboard navigation (arrows, escape)
- Touch swipe support
- Image counter
- Auto-close on overlay click

### PortableTextRenderer
- Renders Sanity portable text
- Supports headings, paragraphs, blockquotes
- Inline formatting (bold, italic, code)
- Image blocks with captions
- Ordered and unordered lists

### Footer
- Three-column layout (desktop)
- Navigation links
- Social media links
- Copyright text
- Auto-fetches settings from Sanity

## Design Tokens

### Colors
- **Background**: `#0a0a0a` - Dark, cinematic
- **Surface**: `#131212` - Cards and sections
- **Border**: `#232120` - Dividers and borders
- **Text**: `#e6e3de` - Primary (warm white)
- **Muted**: `#7a7570` - Secondary text
- **Accent**: `#b8a99a` - Primary accent (warm beige)
- **Cool**: `#8a9aa0` - Secondary accent (slate)

### Typography
- **Serif**: Cormorant Garamond (headlines)
- **Sans**: Inter (body text)

### Responsive Breakpoints
- Mobile: 320px+
- Tablet: 640px+ (sm:)
- Desktop: 1024px+ (lg:)

## Sanity Integration

The project connects to Sanity CMS for:
- Projects with images and metadata
- Blog posts with rich text
- Site settings and branding
- Navigation structure
- About page content

Key Sanity queries available:
- `getAllProjects()` - All projects
- `getFeaturedProjects()` - Featured projects only
- `getProjectBySlug()` - Single project detail
- `getAllPosts()` - All blog posts
- `getPostBySlug()` - Single blog post
- `getRecentPosts()` - Latest posts
- `getNavigation()` - Menu structure
- `getSiteSettings()` - Global settings
- `getAboutPage()` - About page content

See `/sanity/lib/queries.ts` for all available queries.

## Customization

### Change Colors
Edit `tailwind.config.ts` to modify the color palette.

### Change Fonts
Update font imports in `layout.tsx` and `tailwind.config.ts`.

### Adjust Layout
Modify Tailwind classes in components for different responsive behavior.

### Add Email Integration
Update `src/app/api/contact/route.ts` with email service (Resend, SendGrid, etc.).

See **IMPLEMENTATION_GUIDE.md** for detailed customization instructions.

## Performance

- **Image Optimization**: Next.js Image component with automatic sizing
- **Static Generation**: SSG for projects and posts via `generateStaticParams()`
- **Code Splitting**: Client components load only when needed
- **Bundle Size**: Minimal dependencies, Tailwind tree-shaking

## Accessibility

- **Semantic HTML**: Proper heading hierarchy, landmarks
- **Keyboard Navigation**: All interactive elements tab-accessible
- **Focus States**: 2px accent outline on focus
- **ARIA Labels**: Navigation, buttons properly labeled
- **Color Contrast**: WCAG AA compliant
- **Touch Targets**: Min 44x44px for mobile

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

Works on any platform supporting Node.js and Next.js:
- AWS Amplify
- Netlify
- Digital Ocean
- Self-hosted servers

## Environment Variables

### Required
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET` - Your Sanity dataset (usually "production")

### Optional
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (defaults to 2024-01-01)
- `CONTACT_EMAIL` - Email for contact form (for email integration)
- Email service API keys (Resend, SendGrid, etc.)

## Documentation

- **COMPONENT_STRUCTURE.md** - Detailed component documentation
- **IMPLEMENTATION_GUIDE.md** - Setup, customization, and troubleshooting
- **FILES_CREATED.txt** - Summary of created files

## Troubleshooting

### Images not loading
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
- Verify images exist in Sanity CMS
- Check browser console for errors

### Sanity connection error
- Verify environment variables are set
- Restart development server: `npm run dev`
- Check Sanity project settings

### Form not submitting
- Check browser console for errors
- Verify `/api/contact` endpoint is accessible
- Ensure form validation passes

See **IMPLEMENTATION_GUIDE.md** for more troubleshooting steps.

## Future Enhancements

- Email integration (Resend, SendGrid)
- Analytics (Vercel Analytics, Google Analytics)
- Sentry error tracking
- Incremental Static Regeneration (ISR)
- Search functionality
- Comments system

## License

MIT License - feel free to use this template for your projects.

## Support

For questions or issues:
1. Check the documentation files
2. Review Sanity CMS docs: https://www.sanity.io/docs
3. Check Next.js docs: https://nextjs.org/docs

---

Built with Next.js, Tailwind CSS, and Sanity CMS.
