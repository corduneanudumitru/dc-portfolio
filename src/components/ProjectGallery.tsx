'use client';

import { type CSSProperties, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { urlFor } from '@/sanity/lib/client';
import { getImageAspectRatio } from '@/sanity/lib/imageDimensions';
import Lightbox from '@/components/Lightbox';

interface ProjectGalleryImage {
  asset?: any;
  alt?: string;
}

interface ImageInfo {
  index: number;
  url: string;
  aspect: number;
}

interface RowLayout {
  images: ImageInfo[];
  height: number;
}

function computeRows(images: ImageInfo[], containerWidth: number, targetHeight: number, gap: number): RowLayout[] {
  const rows: RowLayout[] = [];
  let currentRow: ImageInfo[] = [];
  let currentWidth = 0;

  for (const img of images) {
    const imgWidth = img.aspect * targetHeight;
    currentRow.push(img);
    currentWidth += imgWidth + (currentRow.length > 1 ? gap : 0);

    if (currentWidth >= containerWidth && currentRow.length > 0) {
      const totalGap = (currentRow.length - 1) * gap;
      const totalAspect = currentRow.reduce((sum, i) => sum + i.aspect, 0);
      const rowHeight = (containerWidth - totalGap) / totalAspect;
      rows.push({ images: [...currentRow], height: rowHeight });
      currentRow = [];
      currentWidth = 0;
    }
  }

  if (currentRow.length > 0) {
    const totalGap = (currentRow.length - 1) * gap;
    const totalAspect = currentRow.reduce((sum, i) => sum + i.aspect, 0);
    let rowHeight = (containerWidth - totalGap) / totalAspect;
    if (rowHeight > targetHeight * 1.5) {
      rowHeight = targetHeight;
    }
    rows.push({ images: currentRow, height: rowHeight });
  }

  return rows;
}

export default function ProjectGallery({ images, projectSlug }: { images: ProjectGalleryImage[]; projectSlug?: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<RowLayout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const GAP = 8;
  const TARGET_HEIGHT = 350;

  const imageInfos = useMemo(
    () =>
      images
        .map((image, index) => {
          if (!image.asset) return null;

          return {
            index,
            url: urlFor(image).width(1000).quality(85).auto('format').url(),
            aspect: getImageAspectRatio(image, 1.5),
          };
        })
        .filter(Boolean) as ImageInfo[],
    [images]
  );

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index.toString()]));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const layoutRows = useCallback(() => {
    if (!containerRef.current || imageInfos.length === 0) return;
    const width = containerRef.current.clientWidth;
    if (width === 0) return;
    const computed = computeRows(imageInfos, width, TARGET_HEIGHT, GAP);
    setRows(computed);
  }, [imageInfos]);

  useEffect(() => {
    layoutRows();

    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') {
      const handleResize = () => layoutRows();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    const observer = new ResizeObserver(() => layoutRows());
    observer.observe(container);
    return () => observer.disconnect();
  }, [layoutRows]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12" ref={containerRef}>
        {rows.length > 0 ? (
          rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex"
              style={{ gap: `${GAP}px`, marginBottom: `${GAP}px` }}
            >
              {row.images.map((img) => (
                <GalleryImage
                  key={img.index}
                  image={img}
                  alt={images[img.index]?.alt}
                  imageFailed={imageErrors.has(img.index.toString())}
                  onImageError={handleImageError}
                  onOpen={openLightbox}
                  style={{
                    width: `${img.aspect * row.height}px`,
                    height: `${row.height}px`,
                  }}
                />
              ))}
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {imageInfos.map((img) => (
              <GalleryImage
                key={img.index}
                image={img}
                alt={images[img.index]?.alt}
                imageFailed={imageErrors.has(img.index.toString())}
                onImageError={handleImageError}
                onOpen={openLightbox}
                style={{ aspectRatio: img.aspect }}
              />
            ))}
          </div>
        )}
      </div>

      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        projectSlug={projectSlug}
      />
    </>
  );
}

function GalleryImage({
  image,
  alt,
  imageFailed,
  onImageError,
  onOpen,
  className = '',
  style,
}: {
  image: ImageInfo;
  alt?: string;
  imageFailed: boolean;
  onImageError: (index: number) => void;
  onOpen: (index: number) => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`relative cursor-pointer group overflow-hidden flex-shrink-0 block text-left ${className}`}
      style={style}
      onClick={() => onOpen(image.index)}
      aria-label={`Open image ${image.index + 1}`}
    >
      {!imageFailed ? (
        <img
          src={image.url}
          alt={alt || 'Gallery image ' + (image.index + 1)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => onImageError(image.index)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-surface border border-border" />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </button>
  );
}
