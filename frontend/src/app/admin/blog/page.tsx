'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle, Image as ImageIcon, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import ImageUpload from '@/components/ImageUpload';
import type { ImageUploadResult } from '@/lib/imageUtils';

export default function AdminBlogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (user) {
      checkUserRole();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userRole === 'admin') {
      loadPosts();
    }
  }, [userRole]);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, activeTab]);

  const checkUserRole = async () => {
    if (!user) return;
    try {
      const userDoc = await getDocs(query(collection(db, 'users')));
      const userData = userDoc.docs.find(doc => doc.id === user.uid);
      const role = userData?.data()?.role;
      setUserRole(role);
    } catch (error) {
      console.error('Error checking role:', error);
    } finally {
      setCheckingAccess(false);
    }
  };

  const loadPosts = async () => {
    try {
      const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as BlogPost[];
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(term) || 
        p.description?.toLowerCase().includes(term)
      );
    }
    if (activeTab === 'published') {
      filtered = filtered.filter(p => p.published);
    } else if (activeTab === 'draft') {
      filtered = filtered.filter(p => !p.published);
    }
    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta publicación?')) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await updateDoc(doc(db, 'blog_posts', post.id), { published: !post.published });
      loadPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="max-w-md w-full bg-[#12131a] border border-gray-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
          <p className="text-gray-400 mb-6">Esta área está restringida a administradores.</p>
          <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            Ir al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Administración de Contenido</h1>
            <p className="text-gray-400 mt-1">Gestiona el contenido de tu blog corporativo y recursos educativos.</p>
          </div>
          <button
            onClick={() => { setEditingPost(null); setShowEditor(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Publicación
          </button>
        </div>

        {showEditor ? (
          <BlogEditor
            post={editingPost}
            onSave={() => { setShowEditor(false); setEditingPost(null); loadPosts(); }}
            onCancel={() => { setShowEditor(false); setEditingPost(null); }}
          />
        ) : (
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl">
            {/* Search and Tabs */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar publicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1a1b23] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'published', 'draft'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-white text-gray-900'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      {tab === 'all' ? 'Todas' : tab === 'published' ? 'Publicadas' : 'Borradores'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Publicación</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#1a1b23] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.featuredImage ? (
                          <img src={post.featuredImage.url} alt="" className="w-16 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-16 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-white font-medium">{post.title}</p>
                          <p className="text-gray-500 text-sm truncate max-w-xs">{post.description?.substring(0, 60)}...</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                          {post.published && post.slug && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-700 rounded-lg"
                              title="Ver publicación"
                            >
                              <ExternalLink className="w-4 h-4 text-emerald-400" />
                            </a>
                          )}
                          <button onClick={() => { setEditingPost(post); setShowEditor(true); }} className="p-2 hover:bg-gray-700 rounded-lg" title="Editar">
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </button>
                          <button onClick={() => togglePublish(post)} className="p-2 hover:bg-gray-700 rounded-lg" title={post.published ? 'Despublicar' : 'Publicar'}>
                            {post.published ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </button>
                          <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-gray-700 rounded-lg" title="Eliminar">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{post.category}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                        {post.type || 'Blog Post'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                        <span className={post.published ? 'text-emerald-400' : 'text-amber-400'}>
                          {post.published ? 'Publicado' : 'Borrador'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron publicaciones</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                <p className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * postsPerPage + 1} a {Math.min(currentPage * postsPerPage, filteredPosts.length)} de {filteredPosts.length} resultados
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm ${
                        currentPage === page ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// BlogEditor Component
function BlogEditor({ post, onSave, onCancel }: { post: BlogPost | null; onSave: () => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    description: post?.description || '',
    content: post?.content || '',
    authorName: post?.author?.name || '',
    authorRole: post?.author?.role || '',
    category: post?.category || 'Habilidades de Coaching',
    type: (post?.type || 'Blog Post') as 'Blog Post' | 'Guide' | 'Webinar',
    readTime: post?.readTime || '5 min',
    published: post?.published || false,
    featuredImage: post?.featuredImage || null,
  });
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImageUploaded = (result: ImageUploadResult) => {
    setFormData({ ...formData, featuredImage: { url: result.url, alt: result.alt, width: result.width || 800, height: result.height || 600 } });
    setShowImageUpload(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description,
        content: formData.content,
        featuredImage: formData.featuredImage,
        author: { name: formData.authorName, role: formData.authorRole },
        category: formData.category,
        type: formData.type,
        readTime: formData.readTime,
        published: formData.published,
        updatedAt: new Date(),
      };

      if (post?.id) {
        await updateDoc(doc(db, 'blog_posts', post.id), postData);
      } else {
        await addDoc(collection(db, 'blog_posts'), { ...postData, createdAt: new Date() });
      }
      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar.');
    }
  };

  return (
    <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">{post ? 'Editar Publicación' : 'Nueva Publicación'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Imagen Destacada</label>
          {formData.featuredImage ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <img src={formData.featuredImage.url} alt="" className="w-full h-48 object-cover" />
              <button type="button" onClick={() => setFormData({ ...formData, featuredImage: null })} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : showImageUpload ? (
            <ImageUpload onImageUploaded={handleImageUploaded} context={formData.title || 'blog post'} />
          ) : (
            <button type="button" onClick={() => setShowImageUpload(true)} className="w-full border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-emerald-500 transition-all">
              <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Agregar Imagen</p>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generado" className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contenido (Markdown) *</label>
          <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={12} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-500" required />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Autor *</label>
            <input type="text" value={formData.authorName} onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rol del Autor *</label>
            <input type="text" value={formData.authorRole} onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" required />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              <option>Habilidades de Coaching</option>
              <option>Desarrollo de Liderazgo</option>
              <option>Tecnología</option>
              <option>Recursos Humanos</option>
              <option>Gestión</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Blog Post' | 'Guide' | 'Webinar' })} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              <option>Blog Post</option>
              <option>Guide</option>
              <option>Webinar</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tiempo de Lectura</label>
            <input type="text" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-600 focus:ring-emerald-500" />
          <label htmlFor="published" className="text-sm text-gray-300">Publicar inmediatamente</label>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-700">
          <button type="submit" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
            {post ? 'Actualizar' : 'Crear Publicación'}
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
