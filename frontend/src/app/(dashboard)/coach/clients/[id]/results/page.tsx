'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Heart, Target, Grid, Compass, BarChart3, Users, Brain, Zap } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface ToolResult {
  id: string;
  toolId: string;
  toolName: string;
  userId: string;
  completedAt: Date;
  results: any;
}

const TOOL_INFO: Record<string, { name: string; icon: any; color: string }> = {
  'wheel-of-life': { name: 'Rueda de la Vida', icon: RefreshCw, color: 'blue' },
  'values-clarification': { name: 'Clarificación de Valores', icon: Heart, color: 'emerald' },
  'grow-model': { name: 'Modelo GROW', icon: Target, color: 'violet' },
  'disc': { name: 'Evaluación DISC', icon: Users, color: 'cyan' },
  'stakeholder-map': { name: 'Mapa de Stakeholders', icon: Users, color: 'orange' },
  'resilience-scale': { name: 'Escala de Resiliencia', icon: BarChart3, color: 'green' },
  'career-compass': { name: 'Brújula de Carrera', icon: Compass, color: 'indigo' },
  'limiting-beliefs': { name: 'Creencias Limitantes', icon: Brain, color: 'red' },
  'emotional-triggers': { name: 'Disparadores Emocionales', icon: Zap, color: 'amber' },
  'habit-loop': { name: 'Bucle de Hábitos', icon: RefreshCw, color: 'teal' },
  'feedback-feedforward': { name: 'Feedback/Feedforward', icon: Grid, color: 'pink' },
};

export default function ClientToolResultsPage() {
  const params = useParams();
  const { userProfile } = useAuth();
  const clientId = params?.id as string;

  const [client, setClient] = useState<any>(null);
  const [results, setResults] = useState<ToolResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<ToolResult | null>(null);

  useEffect(() => {
    if (clientId) {
      loadData();
    }
  }, [clientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load client info
      const clientDoc = await getDoc(doc(db, 'users', clientId));
      if (clientDoc.exists()) {
        setClient({ id: clientDoc.id, ...clientDoc.data() });
      }

      // Load tool results
      const resultsQuery = query(
        collection(db, 'tool_results'),
        where('userId', '==', clientId),
        orderBy('completedAt', 'desc')
      );
      const snapshot = await getDocs(resultsQuery);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      })) as ToolResult[];
      
      setResults(data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getToolInfo = (toolId: string) => {
    return TOOL_INFO[toolId] || { name: toolId, icon: Grid, color: 'gray' };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={'/coach/clients/' + clientId}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#12131a] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Resultados de Herramientas</h1>
            <p className="text-gray-400">
              {client?.displayName || client?.firstName || 'Cliente'} - {results.length} herramientas completadas
            </p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-12 text-center">
            <Grid className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Sin resultados aún</h3>
            <p className="text-gray-400">Este cliente no ha completado ninguna herramienta todavía.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Results List */}
            <div className="lg:col-span-1 space-y-3">
              {results.map((result) => {
                const info = getToolInfo(result.toolId);
                const Icon = info.icon;
                const isSelected = selectedResult?.id === result.id;
                
                return (
                  <button
                    key={result.id}
                    onClick={() => setSelectedResult(result)}
                    className={'w-full text-left p-4 rounded-xl border transition-colors ' +
                      (isSelected 
                        ? 'bg-blue-600/20 border-blue-500' 
                        : 'bg-[#12131a] border-blue-900/30 hover:bg-[#1a1b23]')
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className={'w-10 h-10 rounded-lg flex items-center justify-center bg-' + info.color + '-500/20'}>
                        <Icon className={'w-5 h-5 text-' + info.color + '-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{info.name}</h4>
                        <p className="text-gray-500 text-sm">{formatDate(result.completedAt)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Result Detail */}
            <div className="lg:col-span-2">
              {!selectedResult ? (
                <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-12 text-center h-full flex items-center justify-center">
                  <div>
                    <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Selecciona una herramienta para ver sus resultados</p>
                  </div>
                </div>
              ) : (
                <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const info = getToolInfo(selectedResult.toolId);
                        const Icon = info.icon;
                        return (
                          <>
                            <div className={'w-12 h-12 rounded-xl flex items-center justify-center bg-' + info.color + '-500/20'}>
                              <Icon className={'w-6 h-6 text-' + info.color + '-400'} />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold text-lg">{info.name}</h3>
                              <p className="text-gray-500 text-sm">{formatDate(selectedResult.completedAt)}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Results Display */}
                  <div className="border-t border-blue-900/30 pt-6">
                    {selectedResult.toolId === 'wheel-of-life' && selectedResult.results?.areas && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedResult.results.areas).map(([area, score]: [string, any]) => (
                          <div key={area} className="bg-[#1a1b23] rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-gray-400 text-sm capitalize">{area.replace(/_/g, ' ')}</span>
                              <span className="text-white font-bold">{score}/10</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: (Number(score) * 10) + '%' }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedResult.toolId === 'disc' && selectedResult.results && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          {['D', 'I', 'S', 'C'].map((type) => {
                            const score = selectedResult.results[type.toLowerCase()] || selectedResult.results[type] || 0;
                            const colors: Record<string, string> = { D: 'red', I: 'yellow', S: 'green', C: 'blue' };
                            return (
                              <div key={type} className="bg-[#1a1b23] rounded-lg p-4 text-center">
                                <span className={'text-3xl font-bold text-' + colors[type] + '-400'}>{score}%</span>
                                <p className="text-gray-400 mt-1">{type}</p>
                              </div>
                            );
                          })}
                        </div>
                        {selectedResult.results.dominantType && (
                          <div className="bg-[#1a1b23] rounded-lg p-4">
                            <p className="text-gray-400 text-sm">Tipo Dominante</p>
                            <p className="text-white text-xl font-bold">{selectedResult.results.dominantType}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedResult.toolId === 'values-clarification' && selectedResult.results?.values && (
                      <div className="space-y-3">
                        <h4 className="text-white font-medium mb-3">Valores Principales</h4>
                        {selectedResult.results.values.slice(0, 5).map((value: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#1a1b23] rounded-lg p-3">
                            <span className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-white">{value.name || value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedResult.toolId === 'grow-model' && selectedResult.results && (
                      <div className="space-y-4">
                        {['goal', 'reality', 'options', 'will'].map((section) => (
                          <div key={section} className="bg-[#1a1b23] rounded-lg p-4">
                            <h4 className="text-violet-400 font-medium uppercase mb-2">{section}</h4>
                            <p className="text-white">{selectedResult.results[section] || 'No completado'}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Generic fallback for other tools */}
                    {!['wheel-of-life', 'disc', 'values-clarification', 'grow-model'].includes(selectedResult.toolId) && (
                      <div className="bg-[#1a1b23] rounded-lg p-4">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-auto max-h-96">
                          {JSON.stringify(selectedResult.results, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
