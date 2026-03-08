'use client';

import { useState } from 'react';
import ProjectGrid from '@/components/ProjectGrid';

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  category?: string;
  featured?: boolean;
}

interface WorkPageClientProps {
  projects: Project[];
  categories: string[];
}

export default function WorkPageClient({ projects, categories }: WorkPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProjects = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects;

  return (
    <>
      {categories.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === null
                  ? 'bg-accent text-bg'
                  : 'bg-surface border border-border text-muted hover:text-text hover:border-accent/40'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  activeCategory === cat
                    ? 'bg-accent text-bg'
                    : 'bg-surface border border-border text-muted hover:text-text hover:border-accent/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-muted">No projects in this category yet.</div>
      ) : (
        <ProjectGrid projects={filteredProjects} />
      )}
    </>
  );
}
