import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if(process.env.NEXT_PUBLIC_SITE_PREVIEW === 'true') return {rules:{userAgent:'*',disallow:'/'}};
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
