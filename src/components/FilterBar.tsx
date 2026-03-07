'use client';

import { useState, useRef, useEffect } from 'react';

export interface FilterBarProps {
  onFilterChange: (category: string | null) => void;
  activeFilter?: string | null;
}

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'street', label: 'Street' },
  { id: 'travel', label: 'Travel' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'portrait', label: 'Portrait' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'documentary', label: 'Documentary' },
];

export default function FilterBar({ onFilterChange, activeFilter = 'all' }: FilterBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

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

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleFilterClick = (filterId: string) => {
    onFilterChange(filterId === 'all' ? null : filterId);
  };

  return (
    <div className="relative">
      {/* Left scroll indicator */}
      {showLeftScroll && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full px-4 bg-gradient-to-r from-bg to-transparent hover:from-surface transition-colors hidden sm:flex items-center"
          aria-label="Scroll left"
        >
          <span className="text-xs text-muted">←</span>
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 px-4 sm:px-6 lg:px-8 scroll-smooth scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`px-4 sm:px-6 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
              activeFilter === filter.id || (filter.id === 'all' && !activeFilter)
                ? 'border-accent bg-accent/10 text-text'
                : 'border-border text-muted hover:border-accent hover:text-text'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Right scroll indicator */}
      {showRightScroll && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full px-4 bg-gradient-to-l from-bg to-transparent hover:from-surface transition-colors hidden sm:flex items-center"
          aria-label="Scroll right"
        >
          <span className="text-xs text-muted">→</span>
        </button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
