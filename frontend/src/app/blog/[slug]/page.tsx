import { Metadata } from 'next';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BlogPostContent from './BlogPostContent';

interface Props {
  params: { slug: string };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  try {
    const q = query(
      collection(db, 'blog_posts'),
      where('slug', '==', slug),
      where('published', '==', true)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const post = snapshot.docs[0].data();
      const imageUrl = post.featuredImage?.url || null;
      
      return {
        title: post.title,
        description: post.description || `Read ${post.title} on AchievingCoach blog`,
        openGraph: {
          title: post.title,
          description: post.description,
          url: `https://achievingcoach.com/blog/${slug}`,
          type: 'article',
          publishedTime: post.createdAt?.toDate?.()?.toISOString(),
          modifiedTime: post.updatedAt?.toDate?.()?.toISOString(),
          authors: [post.author?.name || 'AchievingCoach Team'],
          images: imageUrl ? [
            {
              url: imageUrl,
              width: post.featuredImage?.width || 1200,
              height: post.featuredImage?.height || 630,
              alt: post.featuredImage?.alt || post.title,
            }
          ] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: post.title,
          description: post.description,
          images: imageUrl ? [imageUrl] : [],
        },
        alternates: {
          canonical: `https://achievingcoach.com/blog/${slug}`,
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  return {
    title: 'Blog Post',
    description: 'Read our latest coaching insights',
  };
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostContent slug={params.slug} />;
}
