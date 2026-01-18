import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar, Clock, User, Search, Tag } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Blog – Recursos y Mejores Prácticas de Coaching',
  description: 'Insights de coaching experto: guías, tutoriales, desarrollo de liderazgo y preparación para certificación ICF.',
};

const categories = [
  { name: 'Todos', slug: 'all', count: 12 },
  { name: 'Guías', slug: 'guides', count: 4 },
  { name: 'Habilidades', slug: 'skills', count: 3 },
  { name: 'Liderazgo', slug: 'leadership', count: 2 },
  { name: 'ICF', slug: 'icf', count: 2 },
  { name: 'Tendencias', slug: 'trends', count: 1 },
];

const featuredPost = {
  title: 'Guía Completa de las 8 Competencias ICF 2024',
  excerpt: 'Todo lo que necesitas saber sobre el nuevo modelo de competencias de la International Coaching Federation y cómo aplicarlo en tu práctica.',
  category: 'ICF',
  date: '15 Dic, 2024',
  readTime: '12 min',
  slug: 'guia-competencias-icf-2024',
  image: '/blog/icf-competencies.jpg',
};

const posts = [
  {
    title: 'Cómo Estructurar una Sesión de Coaching Efectiva',
    excerpt: 'Aprende el framework de 5 pasos que utilizan los coaches más exitosos para maximizar el impacto de cada sesión.',
    category: 'Guías',
    date: '10 Dic, 2024',
    readTime: '8 min',
    slug: 'estructurar-sesion-coaching',
  },
  {
    title: 'El Arte de las Preguntas Poderosas',
    excerpt: 'Descubre técnicas avanzadas para formular preguntas que generen reflexión profunda y catalicen el cambio.',
    category: 'Habilidades',
    date: '5 Dic, 2024',
    readTime: '6 min',
    slug: 'preguntas-poderosas-coaching',
  },
  {
    title: 'Coaching para Líderes en Tiempos de Cambio',
    excerpt: 'Estrategias para apoyar a ejecutivos navegando transformaciones organizacionales complejas.',
    category: 'Liderazgo',
    date: '28 Nov, 2024',
    readTime: '10 min',
    slug: 'coaching-lideres-cambio',
  },
  {
    title: 'Métricas de ROI en Coaching Ejecutivo',
    excerpt: 'Cómo medir y comunicar el retorno de inversión del coaching a stakeholders organizacionales.',
    category: 'Tendencias',
    date: '20 Nov, 2024',
    readTime: '7 min',
    slug: 'roi-coaching-ejecutivo',
  },
  {
    title: 'Preparación para el Examen ACC de ICF',
    excerpt: 'Tips prácticos y recursos para aprobar tu certificación Associate Certified Coach.',
    category: 'ICF',
    date: '15 Nov, 2024',
    readTime: '9 min',
    slug: 'preparacion-examen-acc-icf',
  },
  {
    title: 'Integrando Herramientas Digitales en tu Práctica',
    excerpt: 'Guía práctica para adoptar tecnología sin perder el toque humano del coaching.',
    category: 'Guías',
    date: '10 Nov, 2024',
    readTime: '5 min',
    slug: 'herramientas-digitales-coaching',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
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
                className="pl-10 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 w-full lg:w-80"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-12">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat.slug === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#111111] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {cat.name}
                <span className="ml-2 text-xs opacity-60">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="px-6 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs mb-4">
                  <Tag className="w-3 h-3" />
                  {featuredPost.category}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">{featuredPost.title}</h2>
                <p className="text-gray-400 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
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
                <div className="bg-[#1a1a1a] rounded-xl h-64 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Artículos Recientes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <Link
                key={index}
                href={`/blog/${post.slug}`}
                className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors group"
              >
                <div className="h-40 bg-[#1a1a1a] flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-gray-700 group-hover:text-gray-600 transition-colors" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-xs text-gray-400">
                      {post.category}
                    </span>
                    <span className="text-gray-600 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg font-medium hover:bg-[#222] transition-colors">
              Cargar Más Artículos
            </button>
          </div>
        </div>
      </section>

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
