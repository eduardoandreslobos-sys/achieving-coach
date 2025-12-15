import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://achievingcoach.com';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/organizations`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Tools pages
  const toolsPages: MetadataRoute.Sitemap = [
    'disc',
    'wheel-of-life',
    'values-clarification',
    'grow-model',
    'limiting-beliefs',
    'resilience-scale',
    'career-compass',
    'emotional-triggers',
    'feedback-feedforward',
    'habit-loop',
    'stakeholder-map',
  ].map(tool => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const postsSnapshot = await getDocs(collection(db, 'blog_posts'));
    blogPosts = postsSnapshot.docs
      .filter(doc => doc.data().status === 'published')
      .map(doc => {
        const data = doc.data();
        const updatedAt = data.updatedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
        return {
          url: `${baseUrl}/blog/${data.slug || doc.id}`,
          lastModified: updatedAt.toISOString(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        };
      });
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return [...staticPages, ...toolsPages, ...blogPosts];
}
