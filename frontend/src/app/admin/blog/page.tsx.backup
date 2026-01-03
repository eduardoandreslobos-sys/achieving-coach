'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { BlogPost } from '@/types/blog';
import ImageUpload from '@/components/ImageUpload';
import type { ImageUploadResult } from '@/lib/imageUtils';

export default function AdminBlogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    } else if (user) {
      checkUserRole();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userRole === 'admin') {
      loadPosts();
    }
  }, [userRole]);

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

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deleteDoc(doc(db, 'blog_posts', postId));
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post. Make sure you have admin permissions.');
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      await updateDoc(doc(db, 'blog_posts', post.id), {
        published: !post.published,
        updatedAt: new Date(),
      });
      loadPosts();
    } catch (error) {
      console.error('Error toggling published:', error);
      alert('Error updating post. Make sure you have admin permissions.');
    }
  };

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This area is restricted to AchievingCoach administrators only.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Your role:</strong> <span className="text-gray-900">{userRole || 'None'}</span>
            </p>
            <p className="text-sm text-gray-700">
              <strong>Required role:</strong> <span className="text-red-600">admin</span>
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Blog Administration</h1>
          <p className="text-gray-600 mt-2">Manage AchievingCoach corporate blog content</p>
        </div>
        <button
          onClick={() => {
            setEditingPost(null);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {showEditor ? (
        <BlogEditor
          post={editingPost}
          onSave={() => {
            setShowEditor(false);
            setEditingPost(null);
            loadPosts();
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingPost(null);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Post</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500">{post.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{post.category}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(post)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {post.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {post.createdAt?.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setShowEditor(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No blog posts yet. Click "New Post" to create one.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BlogEditor({ post, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    description: post?.description || '',
    content: post?.content || '',
    featuredImage: post?.featuredImage || null,
    authorName: post?.author?.name || '',
    authorRole: post?.author?.role || '',
    category: post?.category || 'Coaching Skills',
    type: post?.type || 'Blog Post',
    readTime: post?.readTime || '5 min read',
    published: post?.published || false,
  });
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImageUploaded = (result: ImageUploadResult) => {
    setFormData({
      ...formData,
      featuredImage: {
        url: result.url,
        alt: result.alt,
        width: result.width,
        height: result.height,
      },
    });
    setShowImageUpload(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        content: formData.content,
        featuredImage: formData.featuredImage,
        author: {
          name: formData.authorName,
          role: formData.authorRole,
        },
        category: formData.category,
        type: formData.type,
        readTime: formData.readTime,
        published: formData.published,
        updatedAt: new Date(),
      };

      if (post?.id) {
        await updateDoc(doc(db, 'blog_posts', post.id), postData);
      } else {
        await addDoc(collection(db, 'blog_posts'), {
          ...postData,
          createdAt: new Date(),
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Make sure you have admin permissions.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {post ? 'Edit Post' : 'New Post'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Featured Image</label>
          {formData.featuredImage ? (
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={formData.featuredImage.url}
                alt={formData.featuredImage.alt}
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featuredImage: null })}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-sm">{formData.featuredImage.alt}</p>
              </div>
            </div>
          ) : showImageUpload ? (
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              context={formData.title || 'blog post'}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowImageUpload(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 hover:bg-gray-50 transition-all"
            >
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Add Featured Image</p>
              <p className="text-sm text-gray-500 mt-2">WebP format recommended</p>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="auto-generated-from-title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Content (Markdown) *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Author Name *</label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Author Role *</label>
            <input
              type="text"
              value={formData.authorRole}
              onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option>Coaching Skills</option>
              <option>Leadership Development</option>
              <option>ICF Preparation</option>
              <option>Business Growth</option>
              <option>Tools & Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option>Blog Post</option>
              <option>Guide</option>
              <option>Webinar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Read Time *</label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              placeholder="5 min read"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-900">
            Publish immediately
          </label>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold"
          >
            {post ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
