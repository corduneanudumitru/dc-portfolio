import Link from 'next/link';
import { getProjectBySlug } from '@/sanity/lib/queries';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import ProjectGallery from '@/components/ProjectGallery';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project: Project | null = null;

  try {
    project = await getProjectBySlug(slug);
  } catch (error) {
    console.error('Failed to fetch project:', error);
  }

  if (!project) {
    notFound();
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
    <div className="pt-20 sm:pt-24">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link href="/work" className="text-sm text-accent hover:text-accent/80 transition-colors">
          Back to Work
        </Link>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-6">
            {project.title}
          </h1>
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
          {project.tags && project.tags.length > 0 && (
            <div className="mt-8">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs border border-border text-muted rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectGallery images={galleryImages} />

      {project.body && (
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <PortableTextRenderer blocks={project.body} />
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border">
        <Link
          href="/work"
          className="inline-block px-8 py-3 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors"
        >
          Back to All Projects
        </Link>
      </div>
    </div>
  );
}
