import { Metadata } from 'next';

const BASE_URL = 'https://achievingcoach.com';

interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  path: string;
}

export function generateMetadata({
  title,
  description,
  keywords,
  ogImage = `${BASE_URL}/images/og-default.jpg`,
  path,
}: PageMetadata): Metadata {
  const fullTitle = `${title} | AchievingCoach`;
  const url = `${BASE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'AchievingCoach' }],
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'AchievingCoach',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
