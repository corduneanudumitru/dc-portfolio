import { Suspense } from 'react';
import ProjectGrid from '@/components/ProjectGrid';
import { getAllProjects } from '@/sanity/lib/queries';

export const metadata = {
  title: 'Work | Dumitru Corduneanu Photography',
  description: 'Travel and documentary photography projects from around the world.',
};

export default async function WorkPage() {
  const projects = await getAllProjects();

  return (
    <main className="min-h-screen pt-24">
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">
          Work
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl">
          A collection of documentary and travel photography projects.
        </p>
      </div>
      <Suspense fallback={<div className="text-center py-20">Loading projects...</div>}>
        <ProjectGrid projects={projects || []} />
      </Suspense>
    </main>
  );
}
