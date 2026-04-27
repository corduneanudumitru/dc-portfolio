import type { MetadataRoute } from 'next';
import { getAllProjects, getAllPosts } from '@/sanity/lib/queries';

const BASE_URL = 'https://dumitrucorduneanu.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: any[] = [];
  let posts: any[] = [];

  try {
    [projects, posts] = await Promise.all([
      getAllProjects(),
      getAllPosts(),
    ]);
  } catch (err) {
    console.error('sitemap: failed to fetch from Sanity', err);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE_URL}/work`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/journal`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = (projects || []).map((p) => ({
    url: `${BASE_URL}/work/${p.slug?.current}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const postRoutes: MetadataRoute.Sitemap = (posts || []).map((p) => ({
    url: `${BASE_URL}/journal/${p.slug?.current}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
