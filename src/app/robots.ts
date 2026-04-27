import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api'],
      },
    ],
    sitemap: 'https://dumitrucorduneanu.com/sitemap.xml',
    host: 'https://dumitrucorduneanu.com',
  };
}
