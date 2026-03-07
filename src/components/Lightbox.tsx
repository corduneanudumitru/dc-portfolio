'use client';

import { useState, useEffect, useCallback } from 'react';
import { urlFor } from '@/sanity/lib/client';

export interface LightboxProps {
  images: Array<{ asset?: any; alt?: string }>;
  initialIndex?: number;
  onClose?: () => void;
  isOpen: boolean;
}

export default function Lightbox({ images, initialIndex = 0, onClose, isOpen }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync currentIndex when initialIndex changes (user clicks different image)
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowLeft') goToPrevious();
      else if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrevious, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen || images.length <= 1) return;
    const preloadIndexes = [
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ];
    preloadIndexes.forEach((idx) => {
      const img = images[idx];
      if (img?.asset) {
        const preload = new Image();
        preload.src = urlFor(img.asset).width(1600).auto('format').url();
      }
    });
  }, [currentIndex, isOpen, images]);

  // Touch swipe
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 50) goToNext();
    else if (distance < -50) goToPrevious();
  };

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  // No forced height - let image keep natural aspect ratio
  const imageUrl = currentImage?.asset
    ? urlFor(currentImage.asset).width(1600).auto('format').url()
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors z-10 text-3xl leading-none"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Image */}
      <div
        className="relative flex items-center justify-center w-full h-full px-12 sm:px-20 py-16"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={currentImage.alt || 'Image ' + (currentIndex + 1)}
            className="max-w-full max-h-full object-contain"
            key={currentIndex}
          />
        )}

        {/* Prev arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-4xl z-10 w-12 h-12 items-center justify-center"
            aria-label="Previous"
          >
            &#8249;
          </button>
        )}

        {/* Next arrow */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-4xl z-10 w-12 h-12 items-center justify-center"
            aria-label="Next"
          >
            &#8250;
          </button>
        )}
      </div>

      {/* Counter */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
