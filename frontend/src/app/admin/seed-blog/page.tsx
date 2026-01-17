'use client';

import { useState } from 'react';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Blog posts data
const blogPosts = [
  {
    slug: 'guia-competencias-icf-2024',
    title: 'Guía Completa de las 8 Competencias ICF 2024',
    description: 'Todo lo que necesitas saber sobre el nuevo modelo de competencias de la International Coaching Federation.',
    category: 'ICF',
    readTime: '12 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    featuredImage: { url: '/blog/icf-competencies.jpg', alt: 'Competencias ICF 2024' },
    content: `<h2>Introducción a las Competencias ICF</h2><p>La International Coaching Federation (ICF) actualizó su modelo de competencias centrales, estableciendo un nuevo estándar para la práctica profesional del coaching ejecutivo.</p><h2>Las 8 Competencias</h2><ol><li>Demuestra Práctica Ética</li><li>Encarna una Mentalidad de Coaching</li><li>Establece y Mantiene Acuerdos</li><li>Cultiva Confianza y Seguridad</li><li>Mantiene Presencia</li><li>Escucha Activamente</li><li>Evoca Conciencia</li><li>Facilita el Crecimiento del Cliente</li></ol>`,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    slug: 'estructurar-sesion-coaching',
    title: 'Cómo Estructurar una Sesión de Coaching Efectiva',
    description: 'Aprende el framework de 5 pasos que utilizan los coaches más exitosos.',
    category: 'Guías',
    readTime: '8 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `<h2>La Importancia de una Estructura Clara</h2><p>Una sesión bien estructurada maximiza el tiempo y genera resultados tangibles.</p><h2>Los 5 Pasos</h2><ol><li>Apertura y Check-in (5-10 min)</li><li>Exploración del Tema (15-20 min)</li><li>Generación de Insights (10-15 min)</li><li>Planificación de Acción (10-15 min)</li><li>Cierre y Reflexión (5 min)</li></ol>`,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    slug: 'preguntas-poderosas-coaching',
    title: 'El Arte de las Preguntas Poderosas',
    description: 'Técnicas avanzadas para formular preguntas que generen reflexión profunda.',
    category: 'Habilidades',
    readTime: '6 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `<h2>¿Qué Hace a una Pregunta "Poderosa"?</h2><p>Las preguntas son nuestra herramienta principal. Una pregunta poderosa genera reflexión, desafía supuestos y abre nuevas posibilidades.</p><h2>Características</h2><ul><li>Abiertas: No pueden responderse con sí/no</li><li>Breves: Mientras más cortas, más impacto</li><li>Orientadas al futuro: Crean posibilidades</li></ul>`,
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    slug: 'coaching-lideres-cambio',
    title: 'Coaching para Líderes en Tiempos de Cambio',
    description: 'Estrategias para apoyar a ejecutivos navegando transformaciones organizacionales.',
    category: 'Liderazgo',
    readTime: '10 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `<h2>El Rol del Coach en la Transformación</h2><p>Los tiempos de cambio organizacional son cuando el coaching ejecutivo más valor aporta.</p><h2>Framework VUCA</h2><ul><li>Volatilidad → Visión</li><li>Incertidumbre → Entendimiento</li><li>Complejidad → Claridad</li><li>Ambigüedad → Agilidad</li></ul>`,
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28'),
  },
  {
    slug: 'roi-coaching-ejecutivo',
    title: 'Métricas de ROI en Coaching Ejecutivo',
    description: 'Cómo medir y comunicar el retorno de inversión del coaching.',
    category: 'Tendencias',
    readTime: '7 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `<h2>La Importancia de Medir el ROI</h2><p>El coaching ejecutivo es una inversión significativa. Demostrar el valor con datos es esencial.</p><h2>Niveles de Medición</h2><ol><li>Satisfacción</li><li>Aprendizaje</li><li>Comportamiento</li><li>Resultados</li></ol>`,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20'),
  },
];

export default function SeedBlogPage() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [results, setResults] = useState<{ created: string[]; skipped: string[]; errors: string[] } | null>(null);

  const handleSeed = async () => {
    setStatus('loading');
    const seedResults = { created: [] as string[], skipped: [] as string[], errors: [] as string[] };

    try {
      for (const post of blogPosts) {
        try {
          // Check if post already exists
          const existingQuery = query(
            collection(db, 'blog_posts'),
            where('slug', '==', post.slug)
          );
          const existingDocs = await getDocs(existingQuery);

          if (!existingDocs.empty) {
            seedResults.skipped.push(post.title);
            continue;
          }

          // Create the post
          await addDoc(collection(db, 'blog_posts'), {
            ...post,
            createdAt: Timestamp.fromDate(post.createdAt),
            updatedAt: Timestamp.fromDate(post.updatedAt),
          });
          seedResults.created.push(post.title);
        } catch (error) {
          seedResults.errors.push(`${post.title}: ${error}`);
        }
      }

      setResults(seedResults);
      setStatus('success');
    } catch (error) {
      setResults({ created: [], skipped: [], errors: [String(error)] });
      setStatus('error');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Acceso Denegado</h1>
          <p className="text-gray-400 mb-4">Debes iniciar sesión como administrador</p>
          <Link href="/sign-in" className="text-blue-400 hover:underline">Iniciar Sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Seed Blog Posts</h1>
        <p className="text-gray-400 mb-8">Crear posts de blog en Firebase Firestore</p>

        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Posts a crear ({blogPosts.length})</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            {blogPosts.map((post) => (
              <li key={post.slug}>• {post.title}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleSeed}
          disabled={status === 'loading'}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'loading' ? 'Creando posts...' : 'Ejecutar Seed'}
        </button>

        {results && (
          <div className="mt-6 space-y-4">
            {results.created.length > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <h3 className="text-emerald-400 font-semibold mb-2">Creados ({results.created.length})</h3>
                <ul className="text-emerald-300 text-sm">
                  {results.created.map((title) => <li key={title}>✓ {title}</li>)}
                </ul>
              </div>
            )}
            {results.skipped.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <h3 className="text-amber-400 font-semibold mb-2">Omitidos (ya existen) ({results.skipped.length})</h3>
                <ul className="text-amber-300 text-sm">
                  {results.skipped.map((title) => <li key={title}>- {title}</li>)}
                </ul>
              </div>
            )}
            {results.errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2">Errores ({results.errors.length})</h3>
                <ul className="text-red-300 text-sm">
                  {results.errors.map((err, i) => <li key={i}>x {err}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Volver al Admin</Link>
        </div>
      </div>
    </div>
  );
}
