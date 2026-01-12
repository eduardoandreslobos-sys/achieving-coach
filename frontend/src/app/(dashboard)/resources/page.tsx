'use client';

import { useState, useEffect } from 'react';
import { FileText, Video, Download, ExternalLink, Link as LinkIcon, Folder, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  description: string;
  category: string;
  size?: string;
  duration?: string;
  url?: string;
  fileUrl?: string;
  createdAt?: Date;
  coachId?: string;
  coachName?: string;
}

export default function ResourcesPage() {
  const { user, userProfile } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadResources();
  }, [user, userProfile]);

  const loadResources = async () => {
    if (!user || !userProfile) {
      setLoading(false);
      return;
    }

    try {
      // Get coach ID based on user role
      const coachId = userProfile.role === 'coach'
        ? user.uid
        : userProfile.coacheeInfo?.coachId;

      if (!coachId) {
        setLoading(false);
        return;
      }

      // Query resources shared by the coach
      const resourcesQuery = query(
        collection(db, 'resources'),
        where('coachId', '==', coachId)
      );

      const snapshot = await getDocs(resourcesQuery);
      const resourcesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Sin título',
          type: data.type || 'document',
          description: data.description || '',
          category: data.category || 'General',
          size: data.size,
          duration: data.duration,
          url: data.url,
          fileUrl: data.fileUrl,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          coachId: data.coachId,
          coachName: data.coachName
        } as Resource;
      });

      // Sort by creation date (newest first)
      resourcesData.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
      setResources(resourcesData);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'document': return FileText;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-500/20 text-red-400';
      case 'video': return 'bg-blue-500/20 text-blue-400';
      case 'document': return 'bg-emerald-500/20 text-emerald-400';
      case 'link': return 'bg-violet-500/20 text-violet-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleResourceClick = (resource: Resource) => {
    const url = resource.fileUrl || resource.url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(resources.map(r => r.category))];

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando recursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Recursos</h1>
          <p className="text-gray-400">Herramientas, guías y materiales para apoyar tu crecimiento.</p>
        </div>

        {/* Search and Filter */}
        {resources.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#12131a] border border-blue-900/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#12131a] border border-blue-900/30 text-gray-400 hover:text-white'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {resources.length === 0 ? (
          <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay recursos disponibles</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {userProfile?.role === 'coach'
                ? 'Aún no has compartido recursos con tus coachees. Puedes agregar guías, videos y enlaces desde el panel de administración.'
                : 'Tu coach aún no ha compartido recursos contigo. Los recursos aparecerán aquí cuando estén disponibles.'}
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron resultados</h3>
            <p className="text-gray-400">
              No hay recursos que coincidan con tu búsqueda. Intenta con otros términos.
            </p>
          </div>
        ) : (
          /* Resources Grid */
          <div className="grid md:grid-cols-2 gap-4">
            {filteredResources.map((resource) => {
              const Icon = getIcon(resource.type);
              const iconColor = getIconColor(resource.type);

              return (
                <div
                  key={resource.id}
                  className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5 hover:border-blue-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={iconColor + ' p-3 rounded-xl'}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-1 truncate">{resource.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{resource.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="px-2 py-0.5 bg-gray-800 rounded">{resource.category}</span>
                          {resource.size && <span>{resource.size}</span>}
                          {resource.duration && <span>{resource.duration}</span>}
                        </div>
                        <button
                          onClick={() => handleResourceClick(resource)}
                          className={resource.type === 'link'
                            ? 'flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
                            : 'flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium'
                          }
                        >
                          {resource.type === 'link' ? <ExternalLink size={14} /> : <Download size={14} />}
                          {resource.type === 'link' ? 'Abrir' : 'Descargar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {resources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-blue-900/20">
            <p className="text-gray-500 text-sm text-center">
              {filteredResources.length} de {resources.length} recursos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
