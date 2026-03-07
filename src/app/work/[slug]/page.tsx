'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectBySlug, getProjectSlugs } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/client';
import Lightbox from '@/components/Lightbox';
import PortableTextRenderer from '@/components/PortableTextRenderer';

interface ProjectGalleryImage {
  asset?: any;
  alt?: string;
}

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  gallery?: ProjectGalleryImage[];
  category?: string;
  location?: string;
  date?: string;
  description?: string;
  body?: any;
  tags?: string[];
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProjectBySlug(params.slug);
        setProject(data || null);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [params.slug]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index.toString()]));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-serif font-bold text-text mb-4">Project Not Found</h1>
        <p className="text-muted mb-8">Sorry, we couldn't find that project.</p>
        <Link href="/#work" className="px-6 py-2 border border-accent text-accent hover:bg-accent hover:text-bg transition-colors">
          Back to Work
        </Link>
      </div>
    );
  }

  const galleryImages = project.gallery || [];
  const formattedDate = project.date
    ? new Date(project.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <main className="pt-20 sm:pt-24">
      {/* Back link */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link href="/#work" className="text-sm text-accent hover:text-accent/80 transition-colors">
          ← Back to Work
        </Link>
      </div>

      {/* Cover image */}
      {project.coverImage && (
        <div className="relative w-full aspect-video sm:aspect-auto sm:h-screen">
          <Image
            src={urlFor(project.coverImage).width(1920).height(1080).url()}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Project metadata */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-6">
            {project.title}
          </h1>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            {project.category && (
              <div>
                <p className="text-muted uppercase tracking-wider text-xs mb-2">Category</p>
                <p className="text-text font-medium capitalize">{project.category}</p>
              </div>
            )}

            {project.location && (
              <div>
                <p className="text-muted uppercase tracking-wider text-xs mb-2">Location</p>
                <p className="text-text font-medium">{project.location}</p>
              </div>
            )}

            {formattedDate && (
              <div>
                <p className="text-muted uppercase tracking-wider text-xs mb-2">Date</p>
                <p className="text-text font-medium">{formattedDate}</p>
              </div>
            )}

            {project.description && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-muted uppercase tracking-wider text-xs mb-2">Description</p>
                <p className="text-text/80">{project.description}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs border border-border text-muted rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery grid */}
      {galleryImages.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            {galleryImages.map((image, index) => {
              const hasError = imageErrors.has(index.toString());
              const imageUrl = image.asset && !hasError
                ? urlFor(image.asset).width(1200).height(800).url()
                : null;

              return (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative w-full aspect-video bg-surface border border-border overflow-hidden hover:opacity-90 transition-opacity">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={image.alt || `Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(index)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface/50">
                        <div className="text-center">
                          <div className="text-5xl text-muted/30 mb-2">📸</div>
                          <p className="text-sm text-muted/50">Image not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {image.alt && (
                    <p className="text-xs sm:text-sm text-muted mt-3 italic">{image.alt}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project body/description */}
      {project.body && (
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <PortableTextRenderer blocks={project.body} />
          </div>
        </div>
      )}

      {/* Navigation to other projects */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border">
        <Link
          href="/#work"
          className="inline-block px-8 py-3 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors"
        >
          ← Back to All Projects
        </Link>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const slugs = await getProjectSlugs();
    return slugs.map((item: any) => ({
      slug: item.slug.current,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}
