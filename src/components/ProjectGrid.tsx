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
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4">
        {projects.map((project) => {
          const hasImage = project.coverImage && !imageErrors.has(project._id);
          const imageUrl = hasImage
            ? urlFor(project.coverImage).width(800).auto('format').url()
            : null;

          return (
            <Link
              key={project._id}
              href={`/work/${project.slug.current}`}
              className="block mb-3 sm:mb-4 break-inside-avoid group relative overflow-hidden cursor-pointer"
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
                  {/* Dark overlay on hover with title */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-end p-4 sm:p-5">
                    <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
                        {project.title}
                      </h3>
                      {project.category && (
                        <p className="text-xs text-accent uppercase tracking-wider font-medium">
                          {project.category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[4/3] bg-surface flex items-center justify-center border border-border">
                  <div className="text-center">
                    <div className="text-4xl text-muted/30 mb-2">📸</div>
                    <p className="text-xs text-muted/50">No image</p>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
