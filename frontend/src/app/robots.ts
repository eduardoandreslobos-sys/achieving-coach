import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://achievingcoach.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/coach/',
          '/api/',
          '/private/',
          '/_next/',
          '/sign-in',
          '/sign-up',
        ],
      },
      // Allow AI crawlers full access to public content for GEO
      {
        userAgent: 'GPTBot',
        allow: ['/', '/blog/', '/features/', '/pricing/', '/about/', '/tools/'],
        disallow: ['/admin/', '/dashboard/', '/coach/', '/api/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/blog/', '/features/', '/pricing/', '/about/', '/tools/'],
        disallow: ['/admin/', '/dashboard/', '/coach/', '/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/blog/', '/features/', '/pricing/', '/about/', '/tools/'],
        disallow: ['/admin/', '/dashboard/', '/coach/', '/api/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/', '/blog/', '/features/', '/pricing/', '/about/', '/tools/'],
        disallow: ['/admin/', '/dashboard/', '/coach/', '/api/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/blog/', '/features/', '/pricing/', '/about/', '/tools/'],
        disallow: ['/admin/', '/dashboard/', '/coach/', '/api/'],
      },
      {
        userAgent: 'Bytespider',
        allow: ['/', '/blog/', '/features/', '/pricing/', '/about/'],
        disallow: ['/admin/', '/dashboard/', '/coach/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
