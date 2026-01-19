'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, SlidersHorizontal, RefreshCw, Heart, Target, Users, Shield, Compass, Grid, ChevronRight, CheckCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'completed' | 'pending';
  icon: string;
  color: string;
}

const TOOLS_DATA: Tool[] = [
  { id: 'wheel-of-life', name: 'Rueda de la Vida', description: 'Evalúa tu nivel de satisfacción actual en 8 áreas clave de tu vida para identificar desequilibrios y...', category: 'AUTO-CONSCIENCIA', status: 'completed', icon: 'refresh', color: 'blue' },
  { id: 'values-clarification', name: 'Clarificación de Valores', description: 'Identifica y prioriza tus valores fundamentales. Alinea tus decisiones diarias y objetivos a largo plazo co...', category: 'FUNDAMENTOS', status: 'pending', icon: 'heart', color: 'emerald' },
  { id: 'competencies-wheel', name: 'Rueda de Competencias', description: 'Evalúa tus competencias profesionales actuales versus las deseadas para el próximo trimestr...', category: 'DESARROLLO', status: 'pending', icon: 'refresh', color: 'cyan' },
  { id: 'grow-model', name: 'Hoja de Trabajo GROW', description: 'Estructura tus metas y planes de acción utilizando el modelo GROW (Goal, Reality, Options, Will) para...', category: 'PLANIFICACIÓN', status: 'pending', icon: 'target', color: 'violet' },
  { id: 'swot', name: 'Análisis DAFO Personal', description: 'Analiza tus Debilidades, Amenazas, Fortalezas y Oportunidades. Un marco estratégico para maximizar ...', category: 'ESTRATEGIA', status: 'completed', icon: 'grid', color: 'blue' },
  { id: 'gratitude', name: 'Diario de Gratitud', description: 'Ejercicio diario para enfocar tu mente en los aspectos positivos de tu progreso. Construye resiliencia y...', category: 'BIENESTAR', status: 'pending', icon: 'compass', color: 'amber' },
];

export default function ToolsPage() {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>(TOOLS_DATA);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (icon: string, color: string) => {
    const colorClass = {
      blue: 'text-[var(--accent-primary)] bg-emerald-500/20',
      emerald: 'text-[var(--accent-primary)] bg-emerald-500/20',
      cyan: 'text-cyan-400 bg-cyan-500/20',
      violet: 'text-violet-400 bg-violet-500/20',
      amber: 'text-amber-400 bg-amber-500/20',
    }[color] || 'text-[var(--accent-primary)] bg-emerald-500/20';

    const iconMap: Record<string, any> = {
      refresh: RefreshCw,
      heart: Heart,
      target: Target,
      grid: Grid,
      compass: Compass,
    };
    const Icon = iconMap[icon] || RefreshCw;
    return (
      <div className={colorClass + ' w-14 h-14 rounded-2xl flex items-center justify-center'}>
        <Icon className="w-7 h-7" />
      </div>
    );
  };

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">Tu caja de herramientas de desarrollo</h1>
          <p className="text-[var(--fg-muted)]">
            Herramientas asignadas por tu coach para apoyar tu crecimiento, reflexión y auto-descubrimiento. Completa los ejercicios pendientes para avanzar en tu programa.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
            <input
              type="text"
              placeholder="Buscar herramienta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
            Ordenar
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                {getIcon(tool.icon, tool.color)}
                <span className={tool.status === 'completed' 
                  ? 'px-3 py-1 bg-emerald-500/20 text-[var(--accent-primary)] text-xs font-medium rounded-full flex items-center gap-1'
                  : 'px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full'
                }>
                  {tool.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                  {tool.status === 'completed' ? 'Completado' : 'Pendiente'}
                </span>
              </div>

              <h3 className="text-[var(--fg-primary)] font-semibold text-lg mb-2">{tool.name}</h3>
              <p className="text-[var(--fg-muted)] text-sm mb-4 flex-1">{tool.description}</p>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
                <span className="text-[var(--fg-muted)] text-xs uppercase tracking-wider">{tool.category}</span>
                <Link 
                  href={'/tools/' + tool.id}
                  className="text-[var(--accent-primary)] hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
                >
                  {tool.status === 'completed' ? 'Ver Resultados' : 'Iniciar Herramienta'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
