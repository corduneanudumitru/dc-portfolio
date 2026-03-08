import { getAllProjects } from '@/sanity/lib/queries';
import WorkPageClient from '@/components/WorkPageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Work | Dumitru Corduneanu Photography',
  description: 'Travel and documentary photography projects from around the world.',
};

export default async function WorkPage() {
  const projects = await getAllProjects();
  const allProjects = projects || [];

  const categories = [...new Set(
    allProjects
      .map((p: any) => p.category)
      .filter((c: any) => c && typeof c === 'string')
  )] as string[];

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
      </div>

      <WorkPageClient
        projects={allProjects}
        categories={categories}
      />
    </main>
  );
}
