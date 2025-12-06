import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/coach/', '/(dashboard)/'],
      },
    ],
    sitemap: 'https://achievingcoach.com/sitemap.xml',
  };
}
