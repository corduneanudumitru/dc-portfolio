'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import { getAllPosts } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/client';
import { useLocale } from '@/i18n/LocaleContext';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
}

export default function JournalPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { t } = useLocale();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data || []);
        setFilteredPosts(data || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (activeFilter) {
      setFilteredPosts(posts.filter((post) => post.category === activeFilter));
    } else {
      setFilteredPosts(posts);
    }
  }, [activeFilter, posts]);

  const handleImageError = (postId: string) => {
    setImageErrors((prev) => new Set([...prev, postId]));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted">{t('loading.journal')}</p>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24">
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-b border-border">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text mb-4">{t('journal.title')}</h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl">{t('journal.pageDesc')}</p>
      </div>

      <div className="border-b border-border py-6 sm:py-8">
        <FilterBar onFilterChange={setActiveFilter} activeFilter={activeFilter} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted text-lg">{t('journal.noPosts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            {filteredPosts.map((post) => {
              const hasImage = post.coverImage && !imageErrors.has(post._id);
              const imageUrl = hasImage ? urlFor(post.coverImage).width(500).height(400).url() : null;
              const publishDate = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : null;

              return (
                <Link key={post._id} href={`/journal/${post.slug.current}`} className="group">
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-surface border border-border mb-5 sm:mb-6">
                    {hasImage && imageUrl ? (
                      <Image src={imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" onError={() => handleImageError(post._id)} />
                    ) : (
                      <div className="w-full h-full bg-surface/50 flex items-center justify-center">
                        <div className="text-center"><div className="text-5xl text-muted/30">📖</div></div>
                      </div>
                    )}
                  </div>
                  <div>
                    {post.category && <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">{post.category}</p>}
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-text mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted mb-4 line-clamp-3">{post.excerpt}</p>}
                    {publishDate && <p className="text-xs text-muted/70">{publishDate}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
