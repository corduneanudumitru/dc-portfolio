'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { urlFor } from '@/sanity/lib/client';

export interface LightboxProps {
  images: Array<{ asset?: any; alt?: string }>;
  initialIndex?: number;
  onClose?: () => void;
  isOpen: boolean;
}

export default function Lightbox({ images, initialIndex = 0, onClose, isOpen }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [offsetX, setOffsetX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'none' | 'left' | 'right'>('none');
  const isSingleTouch = useRef(true);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync currentIndex when initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setOffsetX(0);
      setSlideDirection('none');
    }
  }, [initialIndex, isOpen]);

  const animateToImage = useCallback((direction: 'left' | 'right') => {
    const screenWidth = window.innerWidth;
    setIsAnimating(true);
    setSlideDirection(direction);
    // Slide current image off screen
    setOffsetX(direction === 'left' ? -screenWidth : screenWidth);

    setTimeout(() => {
      // Switch to new image
      setCurrentIndex((prev) => {
        if (direction === 'left') return (prev + 1) % images.length;
        return (prev - 1 + images.length) % images.length;
      });
      // Position new image off screen on the opposite side (no transition)
      setIsAnimating(false);
      setOffsetX(direction === 'left' ? screenWidth : -screenWidth);

      // Next frame: animate new image sliding in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setOffsetX(0);
          setTimeout(() => {
            setIsAnimating(false);
            setSlideDirection('none');
          }, 300);
        });
      });
    }, 300);
  }, [images.length]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    animateToImage('left');
  }, [animateToImage, isAnimating]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    animateToImage('right');
  }, [animateToImage, isAnimating]);

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

  // Touch swipe with real-time tracking
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    if (e.targetTouches.length === 1) {
      isSingleTouch.current = true;
      touchStartX.current = e.targetTouches[0].clientX;
      setIsAnimating(false);
    } else {
      isSingleTouch.current = false;
      setOffsetX(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches.length > 1) {
      isSingleTouch.current = false;
      setOffsetX(0);
      return;
    }
    if (!isSingleTouch.current) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX.current;
    // Apply slight resistance at edges
    setOffsetX(diff * 0.8);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSingleTouch.current || isAnimating) {
      setOffsetX(0);
      return;
    }
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEnd;
    const threshold = window.innerWidth * 0.15; // 15% of screen width

    if (distance > threshold) {
      // Swiped left -> next image
      animateToImage('left');
    } else if (distance < -threshold) {
      // Swiped right -> previous image
      animateToImage('right');
    } else {
      // Snap back
      setIsAnimating(true);
      setOffsetX(0);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
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
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-full px-2 sm:px-20 py-12 sm:py-16 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={currentImage.alt || 'Image ' + (currentIndex + 1)}
            className="max-w-full max-h-full object-contain select-none pointer-events-none"
            draggable={false}
            style={{
              transform: `translateX(${offsetX}px)`,
              transition: isAnimating ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
              willChange: 'transform',
            }}
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
