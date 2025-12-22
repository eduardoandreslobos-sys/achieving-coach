import { Metadata } from 'next';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BookOpen, ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Blog – Coaching Resources & Best Practices | AchievingCoach',
  description: 'Expert coaching insights: guides, how-tos, leadership development tips, and ICF certification prep to elevate your coaching game.',
  keywords: ['coaching blog', 'coaching resources', 'ICF certification', 'leadership development', 'coaching tips'],
  openGraph: {
    title: 'AchievingCoach Blog – Coaching Resources & Best Practices',
    description: 'Expert coaching insights: guides, how-tos, leadership development tips, and ICF certification prep.',
    url: 'https://achievingcoach.com/blog',
  },
};

const categories = [
  'All',
  'Guides & How-Tos',
  'Coaching Skills',
  'Leadership Development',
  'ICF Certification',
  'Industry Trends',
];

async function getBlogPosts() {
  try {
    const q = query(
      collection(db, 'blog_posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Resources for Coaches
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Coaching Resources & Best Practices
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your go-to resource for expert advice, industry trends, and practical tips to help you grow as a coach.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Overview */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Topics We Cover</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Guides & How-Tos', desc: 'Step-by-step coaching techniques' },
              { name: 'Coaching Skills', desc: 'Sharpen your competencies' },
              { name: 'Leadership', desc: 'Develop leaders' },
              { name: 'ICF Certification', desc: 'Credential preparation' },
              { name: 'Webinars', desc: 'Expert sessions' },
              { name: 'AI & Trends', desc: 'Latest innovations' },
            ].map((topic, i) => (
              <div key={i} className="bg-white p-4 rounded-xl text-center shadow-sm">
                <p className="font-medium text-gray-900 text-sm">{topic.name}</p>
                <p className="text-xs text-gray-500 mt-1">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <article key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featuredImage?.url && (
                    <div className="aspect-video bg-gray-100">
                      <img
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="px-2 py-1 bg-primary-50 text-primary-600 rounded text-xs font-medium">
                        {post.category || 'Coaching'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime || '5 min read'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary-600 font-medium text-sm flex items-center gap-1 hover:text-primary-700"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're working on amazing content for coaches. Check back soon for expert guides, tips, and industry insights.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-6 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Coaching Insights
          </h2>
          <p className="text-primary-100 mb-8">
            Get the latest coaching tips, ICF updates, and platform news delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-primary-300"
            />
            <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
