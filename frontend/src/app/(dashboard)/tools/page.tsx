'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, Heart, Compass, Shield, Users, TrendingUp, 
  Smile, RefreshCw, MessageSquare, Lightbulb, Brain,
  Clock, ArrowRight, Star, CheckCircle
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const ALL_TOOLS = [
  { id: 'wheel-of-life', name: 'Rueda de la Vida', icon: RefreshCw, color: 'blue', time: '15 min', category: 'Evaluación' },
  { id: 'values-clarification', name: 'Clarificación de Valores', icon: Heart, color: 'pink', time: '20 min', category: 'Autoconocimiento' },
  { id: 'limiting-beliefs', name: 'Creencias Limitantes', icon: TrendingUp, color: 'violet', time: '25 min', category: 'Cognitivo' },
  { id: 'disc', name: 'Evaluación DISC', icon: Users, color: 'amber', time: '15 min', category: 'Evaluación' },
  { id: 'resilience-scale', name: 'Escala de Resiliencia', icon: Shield, color: 'emerald', time: '10 min', category: 'Evaluación' },
  { id: 'grow-model', name: 'Modelo GROW', icon: Target, color: 'cyan', time: '30 min', category: 'Planificación' },
  { id: 'habit-loop', name: 'Loop de Hábitos', icon: Smile, color: 'orange', time: '20 min', category: 'Hábitos' },
  { id: 'stakeholder-map', name: 'Mapa de Stakeholders', icon: Compass, color: 'indigo', time: '25 min', category: 'Estratégico' },
  { id: 'feedback-feedforward', name: 'Feedback Feed-Forward', icon: MessageSquare, color: 'teal', time: '15 min', category: 'Comunicación' },
  { id: 'emotional-triggers', name: 'Disparadores Emocionales', icon: Lightbulb, color: 'rose', time: '20 min', category: 'Inteligencia Emocional' },
];

export default function CoacheeToolsPage() {
  const { user } = useAuth();
  const [assignedTools, setAssignedTools] = useState<string[]>([]);
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      if (!user?.uid) return;
      try {
        // Load assigned tools
        const assignmentsQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('status', '==', 'assigned')
        );
        const snapshot = await getDocs(assignmentsQuery);
        const toolIds = snapshot.docs.map(doc => doc.data().toolId);
        setAssignedTools(toolIds);

        // Load completed tools
        const completedQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('status', '==', 'completed')
        );
        const completedSnapshot = await getDocs(completedQuery);
        const completedIds = completedSnapshot.docs.map(doc => doc.data().toolId);
        setCompletedTools(completedIds);
      } catch (error) {
        console.error('Error loading tools:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, [user]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/30' },
      violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
      indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
      teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
      rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
    };
    return colors[color] || colors.blue;
  };

  const myTools = ALL_TOOLS.filter(t => assignedTools.includes(t.id) || completedTools.includes(t.id));
  const availableTools = ALL_TOOLS.filter(t => !assignedTools.includes(t.id) && !completedTools.includes(t.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Mis Herramientas</h1>
          <p className="text-gray-400">Herramientas de coaching asignadas por tu coach para tu desarrollo.</p>
        </div>

        {/* Assigned Tools */}
        {myTools.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Asignadas para Ti
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTools.map((tool) => {
                const Icon = tool.icon;
                const colors = getColorClasses(tool.color);
                const isCompleted = completedTools.includes(tool.id);
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className={`bg-[#111111] border rounded-xl p-5 hover:border-gray-700 transition-colors ${
                      isCompleted ? 'border-emerald-500/30' : 'border-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Completado
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-medium mb-1">{tool.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} rounded`}>{tool.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tool.time}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State for Assigned */}
        {myTools.length === 0 && (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-8 text-center mb-10">
            <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No tienes herramientas asignadas</h3>
            <p className="text-gray-500 text-sm">Tu coach te asignará herramientas según tu proceso de desarrollo.</p>
          </div>
        )}

        {/* All Available Tools */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Explorar Herramientas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTools.map((tool) => {
              const Icon = tool.icon;
              const colors = getColorClasses(tool.color);
              return (
                <div
                  key={tool.id}
                  className="bg-[#111111] border border-gray-800 rounded-xl p-5 opacity-60"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                  </div>
                  <h3 className="text-white font-medium mb-1">{tool.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} rounded`}>{tool.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tool.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-3">Solicita a tu coach para acceder</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
