'use client';

import { useState, useEffect, useRef } from 'react';
import { urlFor } from '@/sanity/lib/client';
import Lightbox from '@/components/Lightbox';

interface ProjectGalleryImage {
  asset?: any;
  alt?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
}

export default function ProjectGallery({ images }: { images: ProjectGalleryImage[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [dimensions, setDimensions] = useState<Map<number, ImageDimensions>>(new Map());
  const [loaded, setLoaded] = useState(false);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index.toString()]));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Preload images to detect dimensions
  useEffect(() => {
    if (images.length === 0) return;

    let loadedCount = 0;
    const dimMap = new Map<number, ImageDimensions>();

    images.forEach((image, index) => {
      if (!image.asset) {
        loadedCount++;
        if (loadedCount >= images.length) {
          setDimensions(dimMap);
          setLoaded(true);
        }
        return;
      }

      const img = new Image();
      const thumbUrl = urlFor(image.asset).width(100).auto('format').url();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const ratio = w / h;
        let orientation: 'portrait' | 'landscape' | 'square' = 'square';
        if (ratio > 1.2) orientation = 'landscape';
        else if (ratio < 0.8) orientation = 'portrait';

        dimMap.set(index, { width: w, height: h, orientation });
        loadedCount++;
        if (loadedCount >= images.length) {
          setDimensions(dimMap);
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= images.length) {
          setDimensions(dimMap);
          setLoaded(true);
        }
      };
      img.src = thumbUrl;
    });
  }, [images]);

  if (images.length === 0) return null;

  // Assign grid spans based on orientation
  const getGridClasses = (index: number): string => {
    const dim = dimensions.get(index);
    if (!dim) return 'col-span-1 row-span-1';

    if (dim.orientation === 'landscape') {
      return 'col-span-2 row-span-1';
    }
    if (dim.orientation === 'portrait') {
      return 'col-span-1 row-span-2';
    }
    return 'col-span-1 row-span-1';
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div
          className="grid gap-1 sm:gap-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gridAutoRows: '200px',
            gridAutoFlow: 'dense',
          }}
        >
          {images.map((image, index) => {
            const hasError = imageErrors.has(index.toString());
            const imageUrl = image.asset && !hasError
              ? urlFor(image.asset).width(800).auto('format').url()
              : null;

            if (!imageUrl) return null;

            return (
              <div
                key={index}
                className={`relative cursor-pointer group overflow-hidden ${loaded ? getGridClasses(index) : 'col-span-1 row-span-1'}`}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={imageUrl}
                  alt={image.alt || 'Gallery image ' + (index + 1)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(index)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
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
