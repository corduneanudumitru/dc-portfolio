'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/client';

interface JournalPost {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  excerpt?: string;
  publishedAt?: string;
  category?: string;
}

export interface JournalScrollProps {
  posts: JournalPost[];
}

export default function JournalScroll({ posts }: JournalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Check scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      setShowLeftScroll(container.scrollLeft > 0);
      setShowRightScroll(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 350;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleImageError = (postId: string) => {
    setImageErrors((prev) => new Set([...prev, postId]));
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-muted">No journal posts yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left scroll button */}
      {showLeftScroll && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-[250px] sm:h-[300px] px-2 sm:px-4 bg-gradient-to-r from-bg to-transparent hover:from-surface transition-colors flex items-center"
          aria-label="Scroll left"
        >
          <span className="text-lg text-muted">←</span>
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-6 sm:gap-8">
          {posts.map((post) => {
            const hasImage = post.coverImage && !imageErrors.has(post._id);
            const imageUrl = hasImage ? urlFor(post.coverImage).width(400).height(300).url() : null;
            const publishDate = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : null;

            return (
              <Link
                key={post._id}
                href={`/journal/${post.slug.current}`}
                className="flex-shrink-0 w-72 sm:w-80 group cursor-pointer"
              >
                {/* Image container */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-surface border border-border mb-4">
                  {hasImage && imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(post._id)}
                    />
                  ) : (
                    <div className="w-full h-full bg-surface/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-muted/30">📖</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  {post.category && (
                    <p className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
                      {post.category}
                    </p>
                  )}

                  <h3 className="text-base sm:text-lg font-serif font-bold text-text mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-muted mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {publishDate && (
                    <p className="text-xs text-muted/70">
                      {publishDate}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right scroll button */}
      {showRightScroll && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-[250px] sm:h-[300px] px-2 sm:px-4 bg-gradient-to-l from-bg to-transparent hover:from-surface transition-colors flex items-center"
          aria-label="Scroll right"
        >
          <span className="text-lg text-muted">→</span>
        </button>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
