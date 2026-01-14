import { Metadata } from 'next';
import { seoConfig } from '@/config/analytics';

interface SEOMetaProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  alternates?: {
    languages?: Record<string, string>;
  };
}

/**
 * Generate comprehensive SEO metadata for any page
 */
export function generatePageMetadata({
  title,
  description,
  path,
  image = seoConfig.defaultImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  noindex = false,
  alternates,
}: SEOMetaProps): Metadata {
  const fullUrl = `${seoConfig.siteUrl}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;

  const metadata: Metadata = {
    title: {
      absolute: `${title} | ${seoConfig.siteName}`,
    },
    description,
    keywords: tags,

    // Canonical and alternates
    alternates: {
      canonical: fullUrl,
      languages: alternates?.languages,
    },

    // Robots
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },

    // Open Graph
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: type === 'article' ? 'article' : 'website',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: seoConfig.twitterHandle,
      site: seoConfig.twitterHandle,
    },

    // Other
    authors: author ? [{ name: author }] : undefined,
    category: section,
  };

  return metadata;
}

/**
 * Generate JSON-LD for articles/blog posts
 */
export function generateArticleJsonLd({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  author = 'AchievingCoach Team',
  section,
}: SEOMetaProps) {
  const fullUrl = `${seoConfig.siteUrl}${path}`;
  const fullImageUrl = image?.startsWith('http') ? image : `${seoConfig.siteUrl}${image || seoConfig.defaultImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${fullUrl}#article`,
    headline: title,
    description,
    image: fullImageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Organization',
      name: author,
      url: seoConfig.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    articleSection: section,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    // GEO: Indicate this is factual content
    creativeWorkStatus: 'Published',
    copyrightHolder: {
      '@type': 'Organization',
      name: seoConfig.siteName,
    },
  };
}

/**
 * Generate JSON-LD for product/tool pages
 */
export function generateToolJsonLd({
  toolId,
  toolName,
  description,
  category,
}: {
  toolId: string;
  toolName: string;
  description: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `https://achievingcoach.com/tools/${toolId}#tool`,
    name: toolName,
    description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: category,
    operatingSystem: 'Web',
    url: `https://achievingcoach.com/tools/${toolId}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Available with AchievingCoach subscription',
      availability: 'https://schema.org/InStock',
    },
    isPartOf: {
      '@type': 'SoftwareApplication',
      name: 'AchievingCoach',
      url: 'https://achievingcoach.com',
    },
    // GEO: Coaching-specific context
    audience: {
      '@type': 'Audience',
      audienceType: 'Professional Coaches',
    },
  };
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.siteUrl}${item.path}`,
    })),
  };
}

/**
 * Generate video JSON-LD
 */
export function generateVideoJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 format, e.g., "PT1M33S"
  embedUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    embedUrl,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
  };
}
