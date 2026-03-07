'use client';

import Image from 'next/image';
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

  const getGridClass = (index: number) => {
    const featured = projects[index]?.featured;
    if (featured && index < 2) {
      return 'sm:col-span-2 sm:row-span-2';
    }
    if (index % 5 === 0 && index > 0) {
      return 'sm:col-span-2';
    }
    if (index % 5 === 3) {
      return 'sm:row-span-2';
    }
    return '';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-[300px] sm:auto-rows-[350px]">
        {projects.map((project, index) => {
          const hasImage = project.coverImage && !imageErrors.has(project._id);
          const imageUrl = hasImage ? urlFor(project.coverImage).width(800).height(600).url() : null;

          return (
            <Link
              key={project._id}
              href={`/work/${project.slug.current}`}
              className={`relative overflow-hidden bg-surface border border-border group ${getGridClass(
                index
              )}`}
            >
              {hasImage && imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => handleImageError(project._id)}
                  />
                  {/* Dark overlay that appears on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                </>
              ) : (
                <div className="w-full h-full bg-surface/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl text-muted/30 mb-2">📸</div>
                    <p className="text-xs text-muted/50">No image</p>
                  </div>
                </div>
              )}

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-text mb-1">
                    {project.title}
                  </h3>
                  {project.category && (
                    <p className="text-xs sm:text-sm text-accent uppercase tracking-wider">
                      {project.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile title overlay (always visible) */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:hidden bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div>
                  <h3 className="text-base font-serif font-bold text-text mb-0.5">
                    {project.title}
                  </h3>
                  {project.category && (
                    <p className="text-xs text-accent uppercase tracking-wider">
                      {project.category}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
