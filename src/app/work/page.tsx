'use client';

import { useState, useEffect } from 'react';
import ProjectGrid from '@/components/ProjectGrid';
import { getAllProjects, getProjectCategories } from '@/sanity/lib/queries';

export default function WorkPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allProjects, allCategories] = await Promise.all([
          getAllProjects(),
          getProjectCategories(),
        ]);
        setProjects(allProjects || []);
        setCategories((allCategories || []).filter(Boolean));
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProjects = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects;

  return (
    <main className="min-h-screen pt-24">
      <div className="px-4 sm:px-6 lg:px-8 mb-4">
        <div className="w-10 h-0.5 bg-accent mb-6" />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
          Work
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl mb-8">
          A collection of documentary and travel photography projects.
        </p>

        {/* Category filter tabs */}
        {categories.length > 0 && (
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
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 text-muted">No projects in this category yet.</div>
      ) : (
        <ProjectGrid projects={filteredProjects} />
      )}
    </main>
  );
}
