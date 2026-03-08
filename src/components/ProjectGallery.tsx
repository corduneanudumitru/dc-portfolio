'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { urlFor } from '@/sanity/lib/client';
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

export default function ProjectGallery({ images }: { images: ProjectGalleryImage[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [imageInfos, setImageInfos] = useState<ImageInfo[]>([]);
  const [rows, setRows] = useState<RowLayout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const GAP = 4;
  const TARGET_HEIGHT = 350;

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set([...prev, index.toString()]));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (images.length === 0) return;

    let loadedCount = 0;
    const infos: (ImageInfo | null)[] = new Array(images.length).fill(null);

    images.forEach((image, index) => {
      if (!image.asset) {
        loadedCount++;
        if (loadedCount >= images.length) {
          setImageInfos(infos.filter(Boolean) as ImageInfo[]);
        }
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight;
        infos[index] = {
          index,
          url: urlFor(image.asset).width(800).auto('format').url(),
          aspect: aspect || 1,
        };
        loadedCount++;
        if (loadedCount >= images.length) {
          setImageInfos(infos.filter(Boolean) as ImageInfo[]);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= images.length) {
          setImageInfos(infos.filter(Boolean) as ImageInfo[]);
        }
      };
      img.src = urlFor(image.asset).width(80).auto('format').url();
    });
  }, [images]);

  const layoutRows = useCallback(() => {
    if (!containerRef.current || imageInfos.length === 0) return;
    const width = containerRef.current.clientWidth;
    const computed = computeRows(imageInfos, width, TARGET_HEIGHT, GAP);
    setRows(computed);
  }, [imageInfos]);

  useEffect(() => {
    layoutRows();

    const handleResize = () => layoutRows();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [layoutRows]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12" ref={containerRef}>
        {rows.length === 0 && imageInfos.length === 0 && (
          <div className="text-center py-12 text-muted">Loading gallery...</div>
        )}
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex"
            style={{ gap: `${GAP}px`, marginBottom: `${GAP}px` }}
          >
            {row.images.map((img) => (
              <div
                key={img.index}
                className="relative cursor-pointer group overflow-hidden flex-shrink-0"
                style={{
                  width: `${img.aspect * row.height}px`,
                  height: `${row.height}px`,
                }}
                onClick={() => openLightbox(img.index)}
              >
                <img
                  src={img.url}
                  alt={images[img.index]?.alt || 'Gallery image ' + (img.index + 1)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(img.index)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        ))}
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
