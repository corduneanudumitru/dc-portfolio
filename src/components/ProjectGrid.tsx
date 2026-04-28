'use client';

import Link from 'next/link';
import { type CSSProperties, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { urlFor } from '@/sanity/lib/client';
import { getImageAspectRatio } from '@/sanity/lib/imageDimensions';

interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage?: any;
  category?: string;
  featured?: boolean;
}

interface ProjectGridProps {
  projects: Project[];
}

interface ProjectInfo {
  project: Project;
  url: string;
  aspect: number;
}

interface RowLayout {
  items: ProjectInfo[];
  height: number;
}

function computeRows(items: ProjectInfo[], containerWidth: number, targetHeight: number, gap: number): RowLayout[] {
  const rows: RowLayout[] = [];
  let currentRow: ProjectInfo[] = [];
  let currentWidth = 0;

  for (const item of items) {
    const imgWidth = item.aspect * targetHeight;
    currentRow.push(item);
    currentWidth += imgWidth + (currentRow.length > 1 ? gap : 0);

    if (currentWidth >= containerWidth && currentRow.length > 0) {
      const totalGap = (currentRow.length - 1) * gap;
      const totalAspect = currentRow.reduce((sum, i) => sum + i.aspect, 0);
      const rowHeight = (containerWidth - totalGap) / totalAspect;
      rows.push({ items: [...currentRow], height: rowHeight });
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
    rows.push({ items: currentRow, height: rowHeight });
  }

  return rows;
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [rows, setRows] = useState<RowLayout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const GAP = 6;
  const TARGET_HEIGHT = 400;

  const projectInfos = useMemo(
    () =>
      (projects || []).map((project) => ({
        project,
        url: project.coverImage
          ? urlFor(project.coverImage).width(1600).quality(85).auto('format').url()
          : '',
        aspect: getImageAspectRatio(project.coverImage, 1.5),
      })),
    [projects]
  );

  const handleImageError = (projectId: string) => {
    setImageErrors((prev) => new Set([...prev, projectId]));
  };

  const layoutRows = useCallback(() => {
    if (!containerRef.current || projectInfos.length === 0) return;
    const width = containerRef.current.clientWidth;
    if (width === 0) return;
    const computed = computeRows(projectInfos, width, TARGET_HEIGHT, GAP);
    setRows(computed);
  }, [projectInfos]);

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

  if (!projects || projects.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-center text-muted text-lg">
          No projects to display yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20" ref={containerRef}>
      {rows.length > 0 ? (
        rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex"
            style={{ gap: `${GAP}px`, marginBottom: `${GAP}px` }}
          >
            {row.items.map((item) => (
              <ProjectCard
                key={item.project._id}
                item={item}
                imageFailed={imageErrors.has(item.project._id)}
                onImageError={handleImageError}
                style={{
                  width: `${item.aspect * row.height}px`,
                  height: `${row.height}px`,
                }}
              />
            ))}
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[6px]">
          {projectInfos.map((item) => (
            <ProjectCard
              key={item.project._id}
              item={item}
              imageFailed={imageErrors.has(item.project._id)}
              onImageError={handleImageError}
              style={{ aspectRatio: item.aspect }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  item,
  imageFailed,
  onImageError,
  className = '',
  style,
}: {
  item: ProjectInfo;
  imageFailed: boolean;
  onImageError: (projectId: string) => void;
  className?: string;
  style?: CSSProperties;
}) {
  const hasImage = item.url && !imageFailed;

  return (
    <Link
      href={`/work/${item.project.slug.current}`}
      className={`relative group overflow-hidden flex-shrink-0 block ${className}`}
      style={style}
    >
      {hasImage ? (
        <>
          <img
            src={item.url}
            alt={item.project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => onImageError(item.project._id)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col justify-end p-4 sm:p-5">
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
                {item.project.title}
              </h3>
              {item.project.category && (
                <p className="text-xs text-accent uppercase tracking-wider font-medium">
                  {item.project.category}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-surface flex items-center justify-center border border-border">
          <div className="text-center">
            <div className="text-4xl text-muted/30 mb-2">DC</div>
            <p className="text-xs text-muted/50">{item.project.title}</p>
          </div>
        </div>
      )}
    </Link>
  );
}
