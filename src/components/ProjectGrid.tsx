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
    location?: string;
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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {projects.map((project) => {
          const hasImage = project.coverImage && !imageErrors.has(project._id);
          const imageUrl = hasImage
            ? urlFor(project.coverImage).width(800).height(1000).fit('crop').url()
            : null;

          return (
            <Link
              key={project._id}
              href={`/work/${project.slug.current}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface border border-border mb-4">
                {hasImage && imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={() => handleImageError(project._id)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-4xl text-muted/30">\u{1F4F7}</div>
                  </div>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-text mb-1">
                {project.title}
              </h3>
              {(project.category || project.location) && (
                <p className="text-sm text-muted">
                  {[project.category, project.location].filter(Boolean).join(' \u{2014} ')}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
