'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { COACHING_TOOLS } from '@/data/tools';
import { Users, X, CheckCircle2, Search, Plus, Upload, Clock, ArrowRight, Grid, List, ChevronDown, RefreshCw, Lightbulb, TrendingUp, Smile, Compass, Shield, MessageSquare, Target, Brain } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
}

const TABS = [
  { id: 'all', name: 'Todas las Herramientas' },
  { id: 'favorites', name: 'Mis Favoritos' },
  { id: 'exercises', name: 'Ejercicios' },
  { id: 'templates', name: 'Plantillas' },
  { id: 'archived', name: 'Archivados' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'self-awareness', name: 'Autoconocimiento' },
  { id: 'goals', name: 'Metas SMART' },
  { id: 'emotional', name: 'Inteligencia Emocional' },
  { id: 'feedback', name: 'Feedback' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'EVALUACIÓN': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  'REFLEXIÓN': { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  'COGNITIVO': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  'HÁBITOS': { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  'CARRERA': { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  'RESILIENCIA': { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  'ESTRATÉGICO': { bg: 'bg-violet-500/20', text: 'text-violet-400' },
  'COMUNICACIÓN': { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
};

const TOOL_ICONS: Record<string, any> = {
  'wheel-of-life': RefreshCw,
  'values-clarification': Lightbulb,
  'limiting-beliefs': TrendingUp,
  'habits': Smile,
  'career': Compass,
  'resilience': Shield,
  'stakeholders': Users,
  'feedback': MessageSquare,
};

const DARK_TOOLS = [
  { id: 'wheel-of-life', name: 'Rueda de la Vida', description: 'Herramienta visual clásica para evaluar el nivel de...', category: 'EVALUACIÓN', time: 15, icon: RefreshCw, color: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
  { id: 'values-clarification', name: 'Clarificación de Valores', description: 'Ejercicio fundamental para identificar los valores...', category: 'REFLEXIÓN', time: 20, icon: Lightbulb, color: 'bg-orange-500/20', iconColor: 'text-orange-400' },
  { id: 'limiting-beliefs', name: 'Creencias Limitantes', description: 'Guía estructurada para desafiar y reformular...', category: 'COGNITIVO', time: 30, icon: TrendingUp, color: 'bg-blue-500/20', iconColor: 'text-blue-400' },
  { id: 'habits-loop', name: 'Loop de Hábitos', description: 'Framework basado en la ciencia del comportamiento...', category: 'HÁBITOS', time: 45, icon: Smile, color: 'bg-pink-500/20', iconColor: 'text-pink-400' },
  { id: 'career-compass', name: 'Brújula de Carrera', description: 'Herramienta de exploración profesional para...', category: 'CARRERA', time: 25, icon: Compass, color: 'bg-amber-500/20', iconColor: 'text-amber-400' },
  { id: 'resilience-scale', name: 'Escala de Resiliencia', description: 'Evaluación basada en investigación para medir...', category: 'RESILIENCIA', time: 20, icon: Shield, color: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
  { id: 'stakeholder-map', name: 'Mapa de Stakeholders', description: 'Análisis visual de relaciones profesionales...', category: 'ESTRATÉGICO', time: 35, icon: Users, color: 'bg-violet-500/20', iconColor: 'text-violet-400' },
  { id: 'feedback-feedforward', name: 'Feedback Feed-Forward', description: 'Metodología moderna para dar y recibir...', category: 'COMUNICACIÓN', time: 30, icon: MessageSquare, color: 'bg-cyan-500/20', iconColor: 'text-cyan-400' },
];

export default function CoachToolsPage() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [clients, setClients] = useState<Client[]>([]);
  const [previewTool, setPreviewTool] = useState<typeof DARK_TOOLS[0] | null>(null);
  const [assignTool, setAssignTool] = useState<typeof DARK_TOOLS[0] | null>(null);
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
        category: assignTool.category,
        assignedAt: serverTimestamp(),
        completed: false,
      });

      await addDoc(collection(db, 'notifications'), {
        userId: selectedClient,
        type: 'program',
        title: 'Nueva Herramienta Asignada',
        message: `${userProfile.displayName || userProfile.email || 'Tu coach'} te asignó ${assignTool.name}`,
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
    } finally {
      setAssigning(false);
    }
  };

  const filteredTools = DARK_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Biblioteca de Herramientas</h1>
            <p className="text-gray-400 max-w-2xl">
              Accede a una colección curada de recursos, ejercicios y plantillas diseñados para potenciar el proceso de coaching y maximizar el impacto en tus clientes.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#222] transition-colors">
              <Upload className="w-4 h-4" />
              Importar
            </button>
            <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="w-4 h-4" />
              Crear Herramienta
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-800 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-white' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, categoría o etiqueta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select className="appearance-none px-4 py-2.5 pr-10 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                <option>Categoría</option>
                <option>Evaluación</option>
                <option>Reflexión</option>
                <option>Cognitivo</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="appearance-none px-4 py-2.5 pr-10 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 cursor-pointer">
                <option>Tipo</option>
                <option>Herramienta</option>
                <option>Ejercicio</option>
                <option>Plantilla</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="flex bg-[#1a1a1a] border border-gray-700 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'text-white bg-[#2a2a2a]' : 'text-gray-500'} rounded-l-lg transition-colors`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'text-white bg-[#2a2a2a]' : 'text-gray-500'} rounded-r-lg transition-colors`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const catColor = CATEGORY_COLORS[tool.category] || { bg: 'bg-gray-500/20', text: 'text-gray-400' };
            
            return (
              <div
                key={tool.id}
                className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors group"
              >
                {/* Header with icon */}
                <div className="h-28 bg-[#0d0d0d] flex items-center justify-center relative">
                  <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${tool.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${catColor.bg} ${catColor.text}`}>
                      {tool.category}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-1">{tool.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{tool.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {tool.time} min
                    </div>
                    <Link
                      href={`/tools/${tool.id}`}
                      className="flex items-center gap-1 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                    >
                      Ver Detalles
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No se encontraron herramientas.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTool && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#111111] border-b border-gray-800 p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${previewTool.color} rounded-xl flex items-center justify-center`}>
                  {(() => {
                    const Icon = previewTool.icon;
                    return <Icon className={`w-6 h-6 ${previewTool.iconColor}`} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{previewTool.name}</h2>
                  <p className="text-sm text-gray-500">{previewTool.category}</p>
                </div>
              </div>
              <button onClick={() => setPreviewTool(null)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6">{previewTool.description}</p>
              <div className="flex gap-3">
                <Link
                  href={`/tools/${previewTool.id}`}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center transition-colors"
                >
                  Probar Herramienta
                </Link>
                <button
                  onClick={() => setPreviewTool(null)}
                  className="px-6 py-3 bg-[#1a1a1a] text-gray-300 rounded-lg font-medium hover:bg-[#222] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignTool && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl max-w-md w-full">
            {showSuccess ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">¡Herramienta Asignada!</h3>
                <p className="text-gray-400">El coachee ha sido notificado</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-800 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${assignTool.color} rounded-xl flex items-center justify-center`}>
                      {(() => {
                        const Icon = assignTool.icon;
                        return <Icon className={`w-5 h-5 ${assignTool.iconColor}`} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Asignar Herramienta</h2>
                      <p className="text-sm text-gray-500">{assignTool.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setAssignTool(null)} className="text-gray-500 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Seleccionar Cliente</label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Elegir cliente...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setAssignTool(null)}
                      className="flex-1 px-4 py-3 bg-[#1a1a1a] text-gray-300 rounded-lg font-medium hover:bg-[#222]"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAssignTool}
                      disabled={!selectedClient || assigning}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
                    >
                      {assigning ? 'Asignando...' : 'Asignar'}
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
