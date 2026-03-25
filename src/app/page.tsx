import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import ProjectGrid from '@/components/ProjectGrid';
import JournalScroll from '@/components/JournalScroll';
import T from '@/components/TranslatedText';
import { getFeaturedProjects, getRecentPosts, getSiteSettings } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/client';

async function HeroSection() {
  const settings = await getSiteSettings();
  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1920).height(1080).url()
    : null;

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
      {heroImageUrl ? (
        <Image src={heroImageUrl} alt="Hero" fill className="object-cover" priority />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-bg" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-4 sm:px-8">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-text mb-4 sm:mb-6 leading-tight">
          {settings?.siteName || 'DC'}
        </h1>
        <div className="w-12 h-0.5 bg-accent mx-auto mb-4 sm:mb-6" />
        <T tKey="hero.tagline" as="p" className="text-lg sm:text-2xl text-text/80 font-light max-w-2xl mx-auto mb-8 sm:mb-12" />
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Link href="/work" className="px-8 py-3 bg-accent text-bg text-sm sm:text-base font-medium hover:bg-accent/80 transition-colors">
            <T tKey="hero.exploreWork" />
          </Link>
          <Link href="/contact" className="px-8 py-3 border border-text/50 text-text text-sm sm:text-base font-medium hover:border-accent hover:text-accent transition-colors">
            <T tKey="hero.getInTouch" />
          </Link>
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
      <Suspense fallback={<div className="text-center py-20"><T tKey="loading.projects" /></div>}>
        <ProjectGrid projects={projects || []} />
      </Suspense>
      <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 text-center">
        <Link href="/work" className="inline-block px-8 py-3 bg-accent/10 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors">
          <T tKey="work.viewAll" />
        </Link>
      </div>
    </section>
  );
}

async function JournalSection() {
  const posts = await getRecentPosts(6);
  return (
    <section className="py-20 sm:py-32 lg:py-40 border-t border-border">
      <div className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="w-10 h-0.5 bg-cool mb-6" />
        <T tKey="journal.title" as="h2" className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-text mb-4" />
        <T tKey="journal.desc" as="p" className="text-base sm:text-lg text-muted max-w-2xl" />
      </div>
      <Suspense fallback={<div className="text-center py-20"><T tKey="loading.posts" /></div>}>
        <JournalScroll posts={posts || []} />
      </Suspense>
      <div className="px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 text-center">
        <Link href="/journal" className="inline-block px-8 py-3 bg-cool/10 border border-cool text-cool text-sm font-medium hover:bg-cool hover:text-bg transition-colors">
          <T tKey="journal.readAll" />
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
      <JournalSection />
      <AboutTeaser />
    </>
  );
}
