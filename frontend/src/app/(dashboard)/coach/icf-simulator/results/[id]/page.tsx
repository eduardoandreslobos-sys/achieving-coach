'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Home, ChevronRight, CheckCircle, XCircle, BarChart3, Sparkles, Lightbulb, TrendingUp, BookOpen, Clock, Target, Award, ArrowLeft } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';

interface CompetencyScore {
  competencyId: number;
  competencyName: string;
  domainId: number;
  domainName: string;
  correct: number;
  total: number;
  score: number;
}

interface DomainScore {
  domainId: number;
  domainName: string;
  score: number;
  competencies: CompetencyScore[];
}

interface SimulationResult {
  coachId: string;
  coachName: string;
  completedAt: any;
  timeSpent: number;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  level: string;
  competencyScores: CompetencyScore[];
  domainScores: DomainScore[];
  aiAnalysis: {
    feedback: string;
    recommendation: string;
    strongestArea: string;
    weakestArea: string;
  };
}

export default function ICFSimulatorResultsPage() {
  return (
    <FeatureGate feature="icf_simulator.access" fallback="upgrade-prompt">
      <ICFSimulatorResultsContent />
    </FeatureGate>
  );
}

function ICFSimulatorResultsContent() {
  const params = useParams();
  const resultId = params.id as string;
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResult = async () => {
      if (!resultId) return;
      
      try {
        const docRef = doc(db, 'icf_simulations', resultId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setResult(docSnap.data() as SimulationResult);
        } else {
          setError('Resultado no encontrado');
        }
      } catch (err) {
        console.error('Error loading result:', err);
        setError('Error al cargar los resultados');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [resultId]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[var(--accent-primary)]';
    if (score >= 80) return 'text-[var(--accent-primary)]';
    if (score >= 70) return 'text-amber-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getDomainColor = (domainId: number) => {
    const colors: Record<number, { bg: string; text: string; border: string }> = {
      1: { bg: 'bg-emerald-500/10', text: 'text-[var(--accent-primary)]', border: 'border-emerald-500/30' },
      2: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
      3: { bg: 'bg-emerald-500/10', text: 'text-[var(--accent-primary)]', border: 'border-emerald-500/30' },
      4: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
    };
    return colors[domainId] || colors[1];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-CL', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{error || 'Resultado no encontrado'}</h1>
          <Link href="/coach/icf-simulator" className="text-[var(--accent-primary)] hover:text-emerald-300">
            Volver al simulador
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--border-color)] px-6 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/coach" className="text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4 text-[var(--fg-muted)]" />
          <Link href="/coach/icf-simulator" className="text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors">
            Simulador ICF
          </Link>
          <ChevronRight className="w-4 h-4 text-[var(--fg-muted)]" />
          <span className="text-[var(--fg-primary)]">Resultados</span>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link href="/coach/icf-simulator" className="inline-flex items-center gap-1 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] text-sm mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Volver al simulador
              </Link>
              <h1 className="text-3xl font-bold mb-2">Resultados de la Simulación</h1>
              <p className="text-[var(--fg-muted)]">
                Resumen detallado del intento realizado el <span className="text-[var(--fg-primary)]">{formatDate(result.completedAt)}</span>. 
                Los resultados se basan en la estructura de competencias ICF actualizada.
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              result.passed 
                ? 'bg-emerald-500/10 border border-emerald-500/30' 
                : 'bg-amber-500/10 border border-amber-500/30'
            }`}>
              {result.passed ? (
                <CheckCircle className="w-4 h-4 text-[var(--accent-primary)]" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-400" />
              )}
              <span className={`text-sm font-medium ${result.passed ? 'text-[var(--accent-primary)]' : 'text-amber-400'}`}>
                {result.passed ? 'APROBADO' : 'NO APROBADO'}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Calificación Final */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
              <p className="text-[var(--fg-muted)] text-xs uppercase tracking-wider mb-2">Calificación Final</p>
              <p className={`text-5xl font-bold mb-2 ${getScoreColor(result.score)}`}>{result.score}%</p>
              <div className="h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getProgressColor(result.score)}`} style={{ width: `${result.score}%` }}></div>
              </div>
            </div>

            {/* Estado/Nivel */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
              <p className="text-[var(--fg-muted)] text-xs uppercase tracking-wider mb-2">Nivel Alcanzado</p>
              <p className="text-2xl font-bold text-[var(--fg-primary)] mb-1">{result.level}</p>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                result.passed 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-[var(--accent-primary)]' 
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              }`}>
                {result.passed ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {result.passed ? 'Excelente desempeño' : 'Necesita práctica'}
              </span>
            </div>

            {/* Tiempo */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
              <p className="text-[var(--fg-muted)] text-xs uppercase tracking-wider mb-2">Tiempo</p>
              <p className="text-3xl font-bold text-[var(--fg-primary)] mb-1">{formatTime(result.timeSpent)}</p>
              <p className="text-[var(--fg-muted)] text-sm">Límite: 60m 00s</p>
            </div>

            {/* Aciertos */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
              <p className="text-[var(--fg-muted)] text-xs uppercase tracking-wider mb-2">Aciertos</p>
              <p className="text-3xl font-bold text-[var(--fg-primary)] mb-1">
                {result.correctAnswers}<span className="text-[var(--fg-muted)] text-lg">/ {result.totalQuestions}</span>
              </p>
              <p className="text-[var(--fg-muted)] text-sm">70% mínimo requerido</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Desglose por Competencia - 2 columns */}
            <div className="lg:col-span-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-[var(--accent-primary)]" />
                <h2 className="text-lg font-semibold text-[var(--fg-primary)]">Desglose por Competencia ICF</h2>
              </div>

              <div className="space-y-8">
                {result.domainScores?.map((domain) => {
                  const colors = getDomainColor(domain.domainId);
                  return (
                    <div key={domain.domainId}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded`}>
                            DOMINIO {domain.domainId}
                          </span>
                          <span className="text-[var(--fg-primary)] font-medium text-sm uppercase">{domain.domainName}</span>
                        </div>
                        <span className={`text-lg font-bold ${getScoreColor(domain.score)}`}>{domain.score}%</span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {domain.competencies?.map((comp) => (
                          <div key={comp.competencyId} className="bg-[var(--bg-tertiary)] rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-[var(--fg-primary)] text-sm font-medium">{comp.competencyId}. {comp.competencyName}</p>
                              <span className={`text-sm font-bold ${getScoreColor(comp.score)}`}>{comp.score}%</span>
                            </div>
                            <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden mb-2">
                              <div className={`h-full rounded-full ${getProgressColor(comp.score)}`} style={{ width: `${comp.score}%` }}></div>
                            </div>
                            <p className="text-[var(--fg-muted)] text-xs">{comp.correct}/{comp.total} respuestas correctas</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Análisis de IA - 1 column */}
            <div className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-semibold text-[var(--fg-primary)]">Análisis de IA</h2>
                </div>

                {/* Feedback Personalizado */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="text-[var(--fg-primary)] font-medium">Feedback Personalizado</h3>
                  </div>
                  <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
                    {result.aiAnalysis?.feedback}
                  </p>
                </div>

                {/* Próximos Pasos */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                    </div>
                    <h3 className="text-[var(--fg-primary)] font-medium">Recomendación</h3>
                  </div>
                  <p className="text-[var(--fg-muted)] text-sm leading-relaxed">
                    {result.aiAnalysis?.recommendation}
                  </p>
                </div>

                {/* Areas */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <p className="text-[var(--accent-primary)] text-xs uppercase mb-1">Fortaleza</p>
                    <p className="text-[var(--fg-primary)] text-sm font-medium">{result.aiAnalysis?.strongestArea}</p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-amber-400 text-xs uppercase mb-1">A Mejorar</p>
                    <p className="text-[var(--fg-primary)] text-sm font-medium">{result.aiAnalysis?.weakestArea}</p>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Ir al Módulo de Refuerzo
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="text-[var(--fg-primary)] font-medium mb-4">Acciones Rápidas</h3>
                <div className="space-y-2">
                  <Link href="/coach/icf-simulator" className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                    <Target className="w-5 h-5 text-[var(--accent-primary)]" />
                    <span className="text-sm text-[var(--fg-secondary)]">Intentar nueva simulación</span>
                  </Link>
                  <Link href="/coach/icf-simulator" className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-sm text-[var(--fg-secondary)]">Ver historial completo</span>
                  </Link>
                  <Link href="/coach/tools" className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                    <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
                    <span className="text-sm text-[var(--fg-secondary)]">Explorar herramientas</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
