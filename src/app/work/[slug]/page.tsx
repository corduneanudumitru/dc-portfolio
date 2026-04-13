import Link from 'next/link';
import { getProjectBySlug } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/client';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import ProjectGallery from '@/components/ProjectGallery';
import T from '@/components/TranslatedText';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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

// Dynamic OG metadata for Facebook/Twitter sharing
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ photo?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { photo } = await searchParams;

  let project: Project | null = null;
  try {
    project = await getProjectBySlug(slug);
  } catch {
    return {};
  }

  if (!project) return {};

  const baseUrl = 'https://dumitrucorduneanu.com';
  const projectUrl = `${baseUrl}/work/${slug}`;

  let ogImageUrl: string | undefined;
  let ogTitle = `${project.title} | Dumitru Corduneanu Photography`;
  let ogDescription = project.description || `${project.title} — photography by Dumitru Corduneanu`;

  if (photo && project.gallery) {
    const photoIndex = parseInt(photo, 10) - 1;
    if (photoIndex >= 0 && photoIndex < project.gallery.length) {
      const image = project.gallery[photoIndex];
      if (image?.asset) {
        ogImageUrl = urlFor(image.asset).width(1200).height(630).fit('crop').auto('format').url();
        ogTitle = `${project.title} — Photo ${photo} | Dumitru Corduneanu`;
        ogDescription = `Photo ${photo} of ${project.gallery.length} from "${project.title}" by Dumitru Corduneanu`;
      }
    }
  }

  if (!ogImageUrl) {
    if (project.coverImage) {
      ogImageUrl = urlFor(project.coverImage).width(1200).height(630).fit('crop').auto('format').url();
    } else if (project.gallery && project.gallery.length > 0 && project.gallery[0]?.asset) {
      ogImageUrl = urlFor(project.gallery[0].asset).width(1200).height(630).fit('crop').auto('format').url();
    }
  }

  const pageUrl = photo ? `${projectUrl}?photo=${photo}` : projectUrl;

  return {
    title: ogTitle,
    description: ogDescription,
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: pageUrl,
      title: ogTitle,
      description: ogDescription,
      siteName: 'Dumitru Corduneanu Photography',
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
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
          <T tKey="project.backToWork" />
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
                <p className="text-muted uppercase tracking-wider text-xs mb-2"><T tKey="project.category" /></p>
                <p className="text-text font-medium capitalize">{project.category}</p>
              </div>
            )}
            {project.location && (
              <div>
                <p className="text-muted uppercase tracking-wider text-xs mb-2"><T tKey="project.location" /></p>
                <p className="text-text font-medium">{project.location}</p>
              </div>
            )}
            {formattedDate && (
              <div>
                <p className="text-muted uppercase tracking-wider text-xs mb-2"><T tKey="project.date" /></p>
                <p className="text-text font-medium">{formattedDate}</p>
              </div>
            )}
            {project.description && (
              <div className="col-span-2 sm:col-span-3">
                <p className="text-muted uppercase tracking-wider text-xs mb-2"><T tKey="project.description" /></p>
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

      <ProjectGallery images={galleryImages} projectSlug={slug} />

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
          <T tKey="project.backToAll" />
        </Link>
      </div>
    </div>
  );
}
