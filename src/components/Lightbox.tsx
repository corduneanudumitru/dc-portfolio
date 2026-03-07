'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/client';

export interface LightboxProps {
  images: Array<{ asset?: any; alt?: string }>;
  initialIndex?: number;
  onClose?: () => void;
  isOpen: boolean;
}

export default function Lightbox({
  images,
  initialIndex = 0,
  onClose,
  isOpen,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];
  const imageUrl = currentImage.asset
    ? urlFor(currentImage.asset).width(1600).height(1200).url()
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 text-white hover:text-accent transition-colors z-10 text-2xl sm:text-3xl"
        aria-label="Close lightbox"
      >
        ×
      </button>

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4 sm:px-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={currentImage.alt || `Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority
          />
        )}

        {/* Navigation arrows - Desktop only */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors p-2 z-10"
          aria-label="Previous image"
        >
          <span className="text-4xl">←</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors p-2 z-10"
          aria-label="Next image"
        >
          <span className="text-4xl">→</span>
        </button>
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white text-sm sm:text-base">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Mobile hint */}
      <div className="absolute bottom-16 sm:bottom-24 text-white/50 text-xs sm:text-sm text-center px-4 sm:px-0">
        Swipe to navigate
      </div>
    </div>
  );
}
