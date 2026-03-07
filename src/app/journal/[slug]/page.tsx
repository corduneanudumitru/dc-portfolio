import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, getPostSlugs } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/client';
import PortableTextRenderer from '@/components/PortableTextRenderer';
import { notFound } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  excerpt?: string;
  body?: any;
  category?: string;
  publishedAt?: string;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: BlogPost | null = null;

  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    console.error('Failed to fetch post:', error);
  }

  if (!post) {
    notFound();
  }

  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <main className="pt-20 sm:pt-24">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Link href="/journal" className="text-sm text-accent hover:text-accent/80 transition-colors">
          Back to Journal
        </Link>
      </div>

      {post.coverImage && (
        <div className="relative w-full aspect-video sm:aspect-auto sm:h-96">
          <Image
            src={urlFor(post.coverImage).width(1920).height(1080).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <div className="max-w-3xl">
          {post.category && (
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-4">
              {post.category}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-6">
            {post.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
            {publishDate && <p className="text-sm text-muted">{publishDate}</p>}
            {post.excerpt && (
              <p className="text-base text-text/80 italic leading-relaxed">{post.excerpt}</p>
            )}
          </div>
        </div>
      </div>

      {post.body && (
        <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <PortableTextRenderer blocks={post.body} />
          </div>
        </div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-border">
        <Link
          href="/journal"
          className="inline-block px-8 py-3 border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-bg transition-colors"
        >
          Back to Journal
        </Link>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    return slugs.map((item: any) => ({
      slug: item.slug.current,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}
