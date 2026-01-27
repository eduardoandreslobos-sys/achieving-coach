'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar, Clock, User, Search, Tag } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, limit as firestoreLimit } from 'firebase/firestore';
import { db, isFirebaseAvailable } from '@/lib/firebase';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import type { BlogPost } from '@/types/blog';

const categories = [
  { name: 'Todos', slug: 'all' },
  { name: 'Guías', slug: 'Guías' },
  { name: 'Habilidades', slug: 'Habilidades de Coaching' },
  { name: 'Liderazgo', slug: 'Desarrollo de Liderazgo' },
  { name: 'ICF', slug: 'ICF' },
  { name: 'Tecnología', slug: 'Tecnología' },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, activeCategory]);

  const loadPosts = async () => {
    if (!isFirebaseAvailable) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'blog_posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        firestoreLimit(50)
      );
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as BlogPost[];

      setPosts(postsData);

      // Set the first post as featured
      if (postsData.length > 0) {
        setFeaturedPost(postsData[0]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Skip featured post in the grid
    if (featuredPost) {
      filtered = filtered.filter(p => p.id !== featuredPost.id);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    setFilteredPosts(filtered);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach(post => {
      if (post.category) {
        counts[post.category] = (counts[post.category] || 0) + 1;
      }
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[{ name: 'Blog', url: 'https://achievingcoach.com/blog' }]}
            className="mb-8"
          />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">Blog</h1>
              <p className="text-gray-400 text-lg max-w-xl">
                Recursos, guías y mejores prácticas para coaches que buscan excelencia.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-full lg:w-80"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-12">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#111111] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {cat.name}
                {categoryCounts[cat.slug] !== undefined && (
                  <span className="ml-2 text-xs opacity-60">{categoryCounts[cat.slug]}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="px-6 mb-16">
          <div className="max-w-7xl mx-auto flex justify-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <section className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Estamos preparando contenido de alta calidad para ti. Vuelve pronto para descubrir artículos, guías y recursos sobre coaching.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Post */}
      {!loading && featuredPost && (
        <section className="px-6 mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs mb-4">
                    <Tag className="w-3 h-3" />
                    {featuredPost.category || 'Blog'}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-400 mb-6">{featuredPost.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(featuredPost.createdAt)}
                    </span>
                    {featuredPost.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Leer Artículo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="hidden lg:block">
                  {featuredPost.featuredImage?.url ? (
                    <img
                      src={featuredPost.featuredImage.url}
                      alt={featuredPost.featuredImage.alt || featuredPost.title}
                      className="rounded-xl w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="bg-[#1a1a1a] rounded-xl h-64 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      {!loading && filteredPosts.length > 0 && (
        <section className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Artículos Recientes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors group"
                >
                  {post.featuredImage?.url ? (
                    <img
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 bg-[#1a1a1a] flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gray-700 group-hover:text-gray-600 transition-colors" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-xs text-gray-400">
                        {post.category || 'Blog'}
                      </span>
                      {post.readTime && (
                        <span className="text-gray-600 text-xs">{post.readTime}</span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.description}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Suscríbete al Newsletter</h2>
          <p className="text-gray-400 mb-8">Recibe los mejores recursos de coaching directamente en tu inbox cada semana.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 bg-[#111111] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
              Suscribir
            </button>
          </div>
          <p className="text-gray-600 text-xs mt-4">Sin spam. Cancela cuando quieras.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
