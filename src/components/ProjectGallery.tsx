'use client';

import { useState } from 'react';
import { urlFor } from '@/sanity/lib/client';
import Lightbox from '@/components/Lightbox';

interface ProjectGalleryImage {
  asset?: any;
  alt?: string;
}

export default function ProjectGallery({ images }: { images: ProjectGalleryImage[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index.toString()]));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
          {images.map((image, index) => {
            const hasError = imageErrors.has(index.toString());
            const imageUrl = image.asset && !hasError
              ? urlFor(image.asset).width(800).auto('format').url()
              : null;

            if (!imageUrl) return null;

            return (
              <div
                key={index}
                className="mb-4 sm:mb-6 break-inside-avoid cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={imageUrl}
                  alt={image.alt || 'Gallery image ' + (index + 1)}
                  className="w-full h-auto block cursor-pointer group-hover:opacity-90 transition-opacity duration-300"
                  onError={() => handleImageError(index)}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>

      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
