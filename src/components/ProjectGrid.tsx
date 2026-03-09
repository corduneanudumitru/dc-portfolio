'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { urlFor } from '@/sanity/lib/client';

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
  const [projectInfos, setProjectInfos] = useState<ProjectInfo[]>([]);
  const [rows, setRows] = useState<RowLayout[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const GAP = 6;
  const TARGET_HEIGHT = 400;

  const handleImageError = (projectId: string) => {
    setImageErrors((prev) => new Set([...prev, projectId]));
  };

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    let loadedCount = 0;
    const infos: ProjectInfo[] = [];

    const checkDone = () => {
      loadedCount++;
      if (loadedCount >= projects.length) {
        infos.sort((a, b) => {
          const aIdx = projects.indexOf(a.project);
          const bIdx = projects.indexOf(b.project);
          return aIdx - bIdx;
        });
        setProjectInfos([...infos]);
      }
    };

    projects.forEach((project) => {
      if (!project.coverImage) {
        infos.push({ project, url: '', aspect: 1 });
        checkDone();
        return;
      }

      const fullUrl = urlFor(project.coverImage).width(2400).quality(90).auto('format').url();
      const img = new window.Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight;
        infos.push({
          project,
          url: fullUrl,
          aspect: aspect || 1,
        });
        checkDone();
      };
      img.onerror = () => {
        infos.push({ project, url: fullUrl, aspect: 1 });
        checkDone();
      };
      img.src = urlFor(project.coverImage).width(80).auto('format').url();
    });
  }, [projects]);

  const layoutRows = useCallback(() => {
    if (!containerRef.current || projectInfos.length === 0) return;
    const width = containerRef.current.clientWidth;
    const computed = computeRows(projectInfos, width, TARGET_HEIGHT, GAP);
    setRows(computed);
  }, [projectInfos]);

  useEffect(() => {
    layoutRows();
    const handleResize = () => layoutRows();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      {rows.length === 0 && projectInfos.length === 0 && (
        <div className="text-center py-12 text-muted">Loading projects...</div>
      )}
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex"
          style={{ gap: `${GAP}px`, marginBottom: `${GAP}px` }}
        >
          {row.items.map((item) => (
            <Link
              key={item.project._id}
              href={`/work/${item.project.slug.current}`}
              className="relative group overflow-hidden flex-shrink-0 block"
              style={{
                width: `${item.aspect * row.height}px`,
                height: `${row.height}px`,
              }}
            >
              {item.url ? (
                <>
                  <img
                    src={item.url}
                    alt={item.project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => handleImageError(item.project._id)}
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
                    <div className="text-4xl text-muted/30 mb-2">📸</div>
                    <p className="text-xs text-muted/50">{item.project.title}</p>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
