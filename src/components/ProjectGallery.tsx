'use client';

import { useState } from 'react';
import Image from 'next/image';
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
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-8 sm:space-y-12 lg:space-y-16">
          {images.map((image, index) => {
            const hasError = imageErrors.has(index.toString());
            const imageUrl = image.asset && !hasError
              ? urlFor(image.asset).width(1200).height(800).url()
              : null;

            return (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative w-full aspect-video bg-surface border border-border overflow-hidden hover:opacity-90 transition-opacity">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface/50">
                      <div className="text-center">
                        <p className="text-sm text-muted/50">Image not available</p>
                      </div>
                    </div>
                  )}
                </div>
                {image.alt && (
                  <p className="text-xs sm:text-sm text-muted mt-3 italic">{image.alt}</p>
                )}
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
