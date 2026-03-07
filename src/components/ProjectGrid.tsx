'use client';

import Link from 'next/link';
import { useState } from 'react';
import { urlFor } from '@/sanity/lib/client';

interface ProjectGridProps {
  projects: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    coverImage?: any;
    category?: string;
    featured?: boolean;
  }>;
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  if (!projects || projects.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-center text-muted text-lg">
          No projects to display yet. Check back soon.
        </p>
      </div>
    );
  }

  const handleImageError = (projectId: string) => {
    setImageErrors((prev) => new Set([...prev, projectId]));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 lg:gap-6">
        {projects.map((project) => {
          const hasImage = project.coverImage && !imageErrors.has(project._id);
          const imageUrl = hasImage
            ? urlFor(project.coverImage).width(800).auto('format').url()
            : null;

          return (
            <Link
              key={project._id}
              href={`/work/${project.slug.current}`}
              className="block mb-4 sm:mb-5 lg:mb-6 break-inside-avoid group relative overflow-hidden bg-surface border border-border hover:border-accent/40 transition-colors duration-300"
            >
              {hasImage && imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={project.title}
                    className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-500"
                    onError={() => handleImageError(project._id)}
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

                  {/* Title overlay on hover (desktop) */}
                  <div className="absolute inset-0 hidden sm:flex flex-col justify-end p-5 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg font-serif font-bold text-text mb-1">
                      {project.title}
                    </h3>
                    {project.category && (
                      <p className="text-xs text-accent uppercase tracking-wider font-medium">
                        {project.category}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[4/3] bg-surface/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-muted/30 mb-2">📸</div>
                    <p className="text-xs text-muted/50">No image</p>
                  </div>
                </div>
              )}

              {/* Title bar below image (always visible on mobile, visible on desktop too) */}
              <div className="p-3 sm:p-4 bg-surface border-t border-border/50">
                <h3 className="text-sm sm:text-base font-serif font-semibold text-text">
                  {project.title}
                </h3>
                {project.category && (
                  <p className="text-xs text-accent uppercase tracking-wider mt-1">
                    {project.category}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
