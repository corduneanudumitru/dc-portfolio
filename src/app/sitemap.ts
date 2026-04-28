import type { MetadataRoute } from 'next';
import { getProjectListings } from '@/sanity/lib/queries';

const BASE_URL = 'https://dumitrucorduneanu.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: any[] = [];

  try {
    projects = await getProjectListings();
  } catch (err) {
    console.error('sitemap: failed to fetch from Sanity', err);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/work`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const seenProjectSlugs = new Set<string>();
  const projectRoutes: MetadataRoute.Sitemap = (projects || [])
    .filter((p) => {
      const slug = p.slug?.current;
      if (!slug || seenProjectSlugs.has(slug)) return false;
      seenProjectSlugs.add(slug);
      return true;
    })
    .map((p) => ({
      url: `${BASE_URL}/work/${p.slug.current}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
      changeFrequency: 'monthly',
      priority: 0.9,
    }));

  return [...staticRoutes, ...projectRoutes];
}
