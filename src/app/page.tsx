import Image from 'next/image';
import Link from 'next/link';
import ProjectGrid from '@/components/ProjectGrid';
import T from '@/components/TranslatedText';
import { getFeaturedProjects, getSiteSettings } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/client';

async function HeroSection() {
  const settings = await getSiteSettings();
  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1920).height(1080).url()
    : null;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {heroImageUrl ? (
        <Image
          src={heroImageUrl}
          alt={
            settings?.heroImage?.alt ||
            'Documentary photography by Dumitru Corduneanu'
          }
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-bg" />
      )}
      {/* Subtle top vignette — only treats the top band, leaves the photo to breathe */}
      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/55 via-black/15 to-transparent pointer-events-none" />

      {/* Masthead — anchored tight under the nav so DC + name read as one editorial unit */}
      <div className="absolute top-16 sm:top-20 left-0 z-10 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <div className="flex items-stretch gap-4 sm:gap-5">
          <div className="w-px bg-accent/70 self-stretch" />
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-serif font-normal text-white leading-[1.15] tracking-tight max-w-md">
              {settings?.siteName || 'Dumitru Corduneanu'}
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-accent font-medium mt-3">
              Documentary &amp; Fine-Art Photography
            </p>
            <T
              tKey="hero.tagline"
              as="p"
              className="text-sm text-white/75 font-light italic leading-snug mt-3 max-w-[18rem]"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

async function WorkSection() {
  const projects = await getFeaturedProjects();
  return (
    <section id="work" className="py-20 sm:py-32 lg:py-40">
      <div className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="w-10 h-0.5 bg-accent mb-6" />
        <T tKey="work.featured" as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-4" />
        <T tKey="work.featuredDesc" as="p" className="text-base sm:text-lg text-muted max-w-2xl" />
      </div>
      <ProjectGrid projects={projects || []} />
      <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 text-center">
        <Link href="/work" className="inline-block px-8 py-3 bg-accent/10 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors">
          <T tKey="work.viewAll" />
        </Link>
      </div>
    </section>
  );
}

async function AboutTeaser() {
  return (
    <section className="py-20 sm:py-32 lg:py-40 border-t border-border">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
          <div className="relative w-full aspect-square bg-surface border border-border flex items-center justify-center">
            <div className="text-5xl text-muted/30">📷</div>
          </div>
          <div>
            <div className="w-10 h-0.5 bg-accent mb-6" />
            <T tKey="about.title" as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-6" />
            <T tKey="about.teaser1" as="p" className="text-base sm:text-lg text-text leading-relaxed mb-6" />
            <T tKey="about.teaser2" as="p" className="text-base sm:text-lg text-muted leading-relaxed mb-8" />
            <Link href="/about" className="inline-block px-8 py-3 bg-accent/10 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors">
              <T tKey="about.learnMore" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <WorkSection />
      <AboutTeaser />
    </>
  );
}
