'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { COACHING_TOOLS } from '@/data/tools';
import { Users, X, CheckCircle2, Search, Plus, Filter } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All', color: 'bg-gray-100 text-gray-700' },
  { id: 'Goal Setting', name: 'Goal Setting', color: 'bg-purple-100 text-purple-700' },
  { id: 'Self Awareness', name: 'Self-Awareness', color: 'bg-green-100 text-green-700' },
  { id: 'Communication', name: 'Communication', color: 'bg-blue-100 text-blue-700' },
  { id: 'Productivity', name: 'Productivity', color: 'bg-orange-100 text-orange-700' },
];

const TOOL_GRADIENTS = [
  'bg-gradient-to-br from-amber-200 to-amber-400',
  'bg-gradient-to-br from-emerald-200 to-emerald-400',
  'bg-gradient-to-br from-cyan-200 to-cyan-400',
  'bg-gradient-to-br from-rose-200 to-rose-400',
  'bg-gradient-to-br from-violet-200 to-violet-400',
  'bg-gradient-to-br from-teal-200 to-teal-400',
];

export default function CoachToolsPage() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'tools' | 'my-tools'>('tools');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [previewTool, setPreviewTool] = useState<typeof COACHING_TOOLS[0] | null>(null);
  const [assignTool, setAssignTool] = useState<typeof COACHING_TOOLS[0] | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (userProfile?.uid) {
      loadClients();
    }
  }, [userProfile]);

  const loadClients = async () => {
    if (!userProfile?.uid) return;

    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'coachee'),
        where('coacheeInfo.coachId', '==', userProfile.uid)
      );
      
      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName || doc.data().email || 'Unknown',
        email: doc.data().email,
      }));
      
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleAssignTool = async () => {
    if (!selectedClient || !assignTool || !userProfile) return;

    setAssigning(true);
    try {
      await addDoc(collection(db, 'tool_assignments'), {
        coachId: userProfile.uid,
        coacheeId: selectedClient,
        toolId: assignTool.id,
        toolName: assignTool.name,
        assignedAt: serverTimestamp(),
        completed: false,
      });

      const client = clients.find(c => c.id === selectedClient);
      await addDoc(collection(db, 'notifications'), {
        userId: selectedClient,
        type: 'program',
        title: 'New Tool Assigned',
        message: `${userProfile.displayName || userProfile.email || 'Your coach'} assigned you ${assignTool.name}`,
        read: false,
        createdAt: serverTimestamp(),
        actionUrl: `/tools/${assignTool.id}`,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAssignTool(null);
        setSelectedClient('');
      }, 2000);
    } catch (error) {
      console.error('Error assigning tool:', error);
      alert('Failed to assign tool. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const filteredTools = COACHING_TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tools & Exercises Library</h1>
            <p className="text-gray-600">
              Browse our curated library of tools to assign to your clients and enhance your coaching sessions.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            <Plus size={20} />
            New...
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('tools')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'tools' 
                ? 'text-primary-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tools
            {activeTab === 'tools' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
            )}
          </button>
          <button className="pb-3 px-1 font-medium text-gray-400 cursor-not-allowed">
            Exercises
          </button>
          <button className="pb-3 px-1 font-medium text-gray-400 cursor-not-allowed">
            Templates
          </button>
          <button
            onClick={() => setActiveTab('my-tools')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'my-tools' 
                ? 'text-primary-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Tools
            {activeTab === 'my-tools' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
            )}
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
              <option>Category: All</option>
              <option>Category: Goal Setting</option>
              <option>Category: Self-Awareness</option>
            </select>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
              <option>Type: All</option>
            </select>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
              <option>Sort by: Popularity</option>
            </select>
          </div>
        </div>

        {/* Category Badges */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedCategory === category.id
                  ? category.color + ' ring-2 ring-offset-2 ring-current'
                  : category.color + ' opacity-60 hover:opacity-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => {
            const gradientClass = TOOL_GRADIENTS[index % TOOL_GRADIENTS.length];
            const Icon = tool.icon;
            
            return (
              <div
                key={tool.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Gradient Header */}
                <div className={`h-32 ${gradientClass} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <Icon className="relative text-white/80 drop-shadow-lg" size={48} />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{tool.description}</p>
                  </div>

                  <div className="mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryBadge(tool.category)}`}>
                      {tool.category}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewTool(tool)}
                      className="flex-1 px-4 py-2.5 text-primary-600 hover:bg-primary-50 border-2 border-primary-200 rounded-lg text-sm font-semibold transition-all"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setAssignTool(tool)}
                      disabled={clients.length === 0}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No tools found matching your criteria.</p>
          </div>
        )}

        {clients.length === 0 && (
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
            <Users className="mx-auto text-yellow-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-yellow-900 mb-2">No clients yet</h3>
            <p className="text-yellow-800 mb-4">
              Invite coachees to start assigning tools
            </p>
            <Link
              href="/coach/invite"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Invite Coachees
            </Link>
          </div>
        )}
      </div>

      {/* Preview Modal - Same as before */}
      {previewTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${previewTool.color} rounded-lg flex items-center justify-center`}>
                  {(() => {
                    const Icon = previewTool.icon;
                    return <Icon className="text-white" size={24} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{previewTool.name}</h2>
                  <p className="text-sm text-gray-600">{previewTool.category}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTool(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{previewTool.description}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/tools/${previewTool.id}`}
                  target="_blank"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-center transition-colors"
                >
                  Try it yourself
                </Link>
                <button
                  onClick={() => setPreviewTool(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal - Same as before */}
      {assignTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            {showSuccess ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tool Assigned!</h3>
                <p className="text-gray-600">The coachee has been notified</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${assignTool.color} rounded-lg flex items-center justify-center`}>
                      {(() => {
                        const Icon = assignTool.icon;
                        return <Icon className="text-white" size={20} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Assign Tool</h2>
                      <p className="text-sm text-gray-600">{assignTool.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAssignTool(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Select Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setAssignTool(null)}
                      className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignTool}
                      disabled={!selectedClient || assigning}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {assigning ? 'Assigning...' : 'Assign Tool'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
