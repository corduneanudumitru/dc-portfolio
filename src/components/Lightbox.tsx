'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { urlFor } from '@/sanity/lib/client';

export interface LightboxProps {
  images: Array<{ asset?: any; alt?: string }>;
  initialIndex?: number;
  onClose?: () => void;
  isOpen: boolean;
  projectSlug?: string;
}

function getImageUrl(image: { asset?: any } | undefined) {
  if (!image?.asset) return null;
  return urlFor(image.asset).width(1600).auto('format').url();
}

export default function Lightbox({ images, initialIndex = 0, onClose, isOpen, projectSlug }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [dragX, setDragX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const isSingleTouch = useRef(true);
  const touchStartX = useRef(0);

  // Sync currentIndex when initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setDragX(0);
    }
  }, [initialIndex, isOpen]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    const screenWidth = window.innerWidth;
    setIsAnimating(true);
    setDragX(-screenWidth);
    setTimeout(() => {
      setIsAnimating(false);
      setDragX(0);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 300);
  }, [images.length, isAnimating]);

  const goToPrevious = useCallback(() => {
    if (isAnimating) return;
    const screenWidth = window.innerWidth;
    setIsAnimating(true);
    setDragX(screenWidth);
    setTimeout(() => {
      setIsAnimating(false);
      setDragX(0);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, 300);
  }, [images.length, isAnimating]);

  // Share current image
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!projectSlug) return;

    const photoNumber = currentIndex + 1;
    const shareUrl = `https://dumitrucorduneanu.com/work/${projectSlug}?photo=${photoNumber}`;

    // Try native share first (mobile), fall back to clipboard
    if (navigator.share) {
      try {
        await navigator.share({
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

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
    [(currentIndex + 1) % images.length, (currentIndex - 1 + images.length) % images.length].forEach((idx) => {
      const img = images[idx];
      if (img?.asset) {
        const preload = new Image();
        preload.src = urlFor(img.asset).width(1600).auto('format').url();
      }
    });
  }, [currentIndex, isOpen, images]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    if (e.targetTouches.length === 1) {
      isSingleTouch.current = true;
      touchStartX.current = e.targetTouches[0].clientX;
    } else {
      isSingleTouch.current = false;
      setDragX(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches.length > 1) {
      isSingleTouch.current = false;
      setDragX(0);
      return;
    }
    if (!isSingleTouch.current || isAnimating) return;
    const diff = e.targetTouches[0].clientX - touchStartX.current;
    setDragX(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSingleTouch.current || isAnimating) {
      setDragX(0);
      return;
    }
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEnd;
    const threshold = window.innerWidth * 0.15;

    if (distance > threshold) {
      goToNext();
    } else if (distance < -threshold) {
      goToPrevious();
    } else {
      // Snap back
      setIsAnimating(true);
      setDragX(0);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  if (!isOpen || !images || images.length === 0) return null;

  const prevIndex = (currentIndex - 1 + images.length) % images.length;
  const nextIndex = (currentIndex + 1) % images.length;

  const currentUrl = getImageUrl(images[currentIndex]);
  const prevUrl = images.length > 1 ? getImageUrl(images[prevIndex]) : null;
  const nextUrl = images.length > 1 ? getImageUrl(images[nextIndex]) : null;

  const stripTransform = `translateX(calc(-100vw + ${dragX}px))`;
  const stripTransition = isAnimating ? 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';

  return (
    <div
      className="fixed inset-0 bg-black z-50"
      onClick={onClose}
    >
      {/* Top bar: close + share */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 sm:px-6 py-4 z-10">
        {/* Share button */}
        {projectSlug && (
          <button
            onClick={handleShare}
            className="relative text-white/50 hover:text-white transition-colors p-2"
            aria-label="Share this image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {/* "Link copied" tooltip */}
            {showCopied && (
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-black text-xs px-3 py-1.5 rounded whitespace-nowrap">
                Link copied
              </span>
            )}
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors p-2 ml-auto text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Image strip: 3 panels side by side */}
      <div
        className="overflow-hidden"
        style={{ height: '100dvh' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex h-full"
          style={{
            width: '300vw',
            transform: stripTransform,
            transition: stripTransition,
            willChange: 'transform',
          }}
        >
          {/* Previous image panel */}
          <div className="w-screen h-full flex items-center justify-center px-1 lg:px-20 py-4 lg:py-12 flex-shrink-0">
            {prevUrl && (
              <img
                src={prevUrl}
                alt={images[prevIndex]?.alt || 'Previous'}
                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
            )}
          </div>

          {/* Current image panel */}
          <div className="w-screen h-full flex items-center justify-center px-1 lg:px-20 py-4 lg:py-12 flex-shrink-0">
            {currentUrl && (
              <img
                src={currentUrl}
                alt={images[currentIndex]?.alt || 'Image ' + (currentIndex + 1)}
                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
            )}
          </div>

          {/* Next image panel */}
          <div className="w-screen h-full flex items-center justify-center px-1 lg:px-20 py-4 lg:py-12 flex-shrink-0">
            {nextUrl && (
              <img
                src={nextUrl}
                alt={images[nextIndex]?.alt || 'Next'}
                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
            )}
          </div>
        </div>
      </div>

      {/* Prev arrow (desktop) */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-4xl z-10 w-12 h-12 items-center justify-center"
          aria-label="Previous"
        >
          &#8249;
        </button>
      )}

      {/* Next arrow (desktop) */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors text-4xl z-10 w-12 h-12 items-center justify-center"
          aria-label="Next"
        >
          &#8250;
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm z-10">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
