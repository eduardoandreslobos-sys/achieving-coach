'use client';

import { useState, useEffect } from 'react';
import { Clock, Award, Play, RotateCcw, History, ArrowRight, Target, CheckSquare, Gamepad2, BarChart3, Sparkles, ExternalLink } from 'lucide-react';
import { collection, getDocs, query, where, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id?: string;
  question: string;
  options: string[];
  correct: string;
  competencyId?: number;
  competencyName?: string;
  domainId?: number;
  domainName?: string;
}

interface SimulationResult {
  id: string;
  date: Date;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
}

const COMPETENCIES = [
  { id: 1, name: 'Demuestra práctica ética', domainId: 1, domain: 'Fundamentos' },
  { id: 2, name: 'Incorpora una mentalidad de coaching', domainId: 1, domain: 'Fundamentos' },
  { id: 3, name: 'Establece y mantiene acuerdos', domainId: 2, domain: 'Co-Creación de la Relación' },
  { id: 4, name: 'Cultiva confianza y seguridad', domainId: 2, domain: 'Co-Creación de la Relación' },
  { id: 5, name: 'Mantiene presencia', domainId: 3, domain: 'Comunicación Eficaz' },
  { id: 6, name: 'Escucha activamente', domainId: 3, domain: 'Comunicación Eficaz' },
  { id: 7, name: 'Evoca Conciencia', domainId: 4, domain: 'Cultivar Aprendizaje y Crecimiento' },
  { id: 8, name: 'Facilita el crecimiento del cliente', domainId: 4, domain: 'Cultivar Aprendizaje y Crecimiento' },
];

export default function ICFSimulatorPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [startTime, setStartTime] = useState<number>(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recentResults, setRecentResults] = useState<SimulationResult[]>([]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const q = query(collection(db, 'icf_questions'), where('active', '==', true));
        const snapshot = await getDocs(q);
        const questionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[];
        setAllQuestions(questionsData);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  useEffect(() => {
    const loadRecentResults = async () => {
      if (!userProfile?.uid) return;
      try {
        const q = query(
          collection(db, 'icf_simulations'),
          where('coachId', '==', userProfile.uid),
          orderBy('completedAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.data().completedAt?.toDate() || new Date(),
          score: doc.data().score,
          totalQuestions: doc.data().totalQuestions,
          correctAnswers: doc.data().correctAnswers,
          timeSpent: doc.data().timeSpent,
        }));
        setRecentResults(results);
      } catch (error) {
        console.error('Error loading recent results:', error);
      }
    };
    loadRecentResults();
  }, [userProfile, examFinished]);

  useEffect(() => {
    if (examStarted && timeLeft > 0 && !examFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, timeLeft, examFinished]);

  const startExam = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 60).map((q, index) => {
      // Asignar competencia basada en índice si no tiene
      const compIndex = index % 8;
      const comp = COMPETENCIES[compIndex];
      return {
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
        competencyId: q.competencyId || comp.id,
        competencyName: q.competencyName || comp.name,
        domainId: q.domainId || comp.domainId,
        domainName: q.domainName || comp.domain,
      };
    });
    setExamQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(60 * 60);
    setStartTime(Date.now());
    setExamStarted(true);
    setExamFinished(false);
  };

  const finishExam = async () => {
    if (!userProfile?.uid || saving) return;
    setSaving(true);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Calcular resultados por competencia
    const competencyResults: { [key: number]: { correct: number; total: number } } = {};
    COMPETENCIES.forEach(c => {
      competencyResults[c.id] = { correct: 0, total: 0 };
    });

    let totalCorrect = 0;
    examQuestions.forEach((q, i) => {
      const userAnswer = answers[i];
      const compId = q.competencyId || ((i % 8) + 1);
      
      if (!competencyResults[compId]) {
        competencyResults[compId] = { correct: 0, total: 0 };
      }
      competencyResults[compId].total++;

      if (userAnswer) {
        const letter = userAnswer.charAt(0);
        if (letter === q.correct) {
          totalCorrect++;
          competencyResults[compId].correct++;
        }
      }
    });

    // Calcular scores por competencia
    const competencyScores = COMPETENCIES.map(comp => {
      const result = competencyResults[comp.id];
      const score = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
      return {
        competencyId: comp.id,
        competencyName: comp.name,
        domainId: comp.domainId,
        domainName: comp.domain,
        correct: result.correct,
        total: result.total,
        score,
      };
    });

    // Calcular scores por dominio
    const domainScores = [1, 2, 3, 4].map(domainId => {
      const domainComps = competencyScores.filter(c => c.domainId === domainId);
      const totalCorrect = domainComps.reduce((sum, c) => sum + c.correct, 0);
      const totalQuestions = domainComps.reduce((sum, c) => sum + c.total, 0);
      const score = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      
      const domainNames: { [key: number]: string } = {
        1: 'Fundamentos',
        2: 'Co-Creación de la Relación',
        3: 'Comunicación Eficaz',
        4: 'Cultivar Aprendizaje y Crecimiento',
      };

      return {
        domainId,
        domainName: domainNames[domainId],
        score,
        competencies: domainComps,
      };
    });

    const finalScore = Math.round((totalCorrect / 60) * 100);
    const passed = finalScore >= 70;

    // Determinar nivel
    let level = 'En Desarrollo';
    if (finalScore >= 90) level = 'MCC Avanzado';
    else if (finalScore >= 80) level = 'PCC Sólido';
    else if (finalScore >= 70) level = 'ACC Competente';

    // Generar feedback de IA basado en resultados
    const lowestComp = [...competencyScores].sort((a, b) => a.score - b.score)[0];
    const highestComp = [...competencyScores].sort((a, b) => b.score - a.score)[0];

    const aiAnalysis = {
      feedback: `Has demostrado fortaleza en "${highestComp.competencyName}" con un ${highestComp.score}%. Sin embargo, el área de "${lowestComp.competencyName}" presenta oportunidades de mejora con un ${lowestComp.score}%.`,
      recommendation: `Te recomendamos enfocarte en ejercicios prácticos relacionados con ${lowestComp.competencyName} para fortalecer esta competencia.`,
      strongestArea: highestComp.competencyName,
      weakestArea: lowestComp.competencyName,
    };

    try {
      // Guardar en Firebase
      const docRef = await addDoc(collection(db, 'icf_simulations'), {
        coachId: userProfile.uid,
        coachName: userProfile.displayName || userProfile.email,
        completedAt: serverTimestamp(),
        timeSpent,
        totalQuestions: 60,
        correctAnswers: totalCorrect,
        score: finalScore,
        passed,
        level,
        competencyScores,
        domainScores,
        aiAnalysis,
        answers: Object.entries(answers).map(([index, answer]) => ({
          questionIndex: parseInt(index),
          questionId: examQuestions[parseInt(index)]?.id,
          userAnswer: answer,
          correct: answer.charAt(0) === examQuestions[parseInt(index)]?.correct,
        })),
      });

      // Redirigir a página de resultados
      router.push(`/coach/icf-simulator/results/${docRef.id}`);
    } catch (error) {
      console.error('Error saving results:', error);
      setExamFinished(true);
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeSpent = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Main Dashboard (not started)
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Simulador de Competencias ICF</h1>
              <p className="text-gray-400">
                Entrena y evalúa tus habilidades de coaching ejecutivo alineadas estrictamente al{' '}
                <span className="text-emerald-400">Nuevo Modelo ICF 2026</span>.
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#222] transition-colors">
              <History className="w-4 h-4" />
              Ver Historial
            </button>
          </div>

          {/* Three Mode Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {/* Explorar Escenarios */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Explorar Escenarios</h3>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Roleplay con avatares de IA para practicar situaciones difíciles y gestión emocional.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-gray-400">ROLEPLAY</span>
                <span className="text-xs px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-gray-400">IA ADAPTATIVA</span>
              </div>
              <button 
                onClick={startExam}
                disabled={allQuestions.length < 60}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Empezar Simulación
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Competencia Individual */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Competencia Individual</h3>
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Enfócate en perfeccionar dominios específicos como 'Comunicación Eficaz' o 'Fundamentos'.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-gray-400">MICRO-LEARNING</span>
                <span className="text-xs px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-gray-400">FOCALIZADO</span>
              </div>
              <button className="w-full py-2.5 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg font-medium hover:bg-[#222] transition-colors">
                Configurar Práctica
              </button>
            </div>

            {/* Evaluación Completa */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Evaluación Completa</h3>
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Simulación de sesión completa (30-60 min) con evaluación integral de los 4 dominios.
              </p>
              <div className="flex gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-[#1a1a1a] border border-gray-700 rounded text-gray-400">EXAMEN</span>
                <span className="text-xs px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400">CERTIFICACIÓN</span>
              </div>
              <button 
                onClick={startExam}
                disabled={allQuestions.length < 60}
                className="w-full py-2.5 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg font-medium hover:bg-[#222] transition-colors disabled:opacity-50"
              >
                Iniciar Examen
              </button>
            </div>
          </div>

          {/* Recent Results */}
          {recentResults.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">Resultados Recientes</h2>
                  <span className="text-gray-500 text-sm">
                    (Última sesión: {recentResults[0]?.date.toLocaleDateString('es-CL')})
                  </span>
                </div>
                <Link href={`/coach/icf-simulator/results/${recentResults[0]?.id}`} className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1">
                  Revisar Sesión Completa
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Score Circle */}
                <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#1a1a1a"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${recentResults[0]?.score || 0}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold">{recentResults[0]?.score || 0}</span>
                        <span className="text-gray-500 text-sm uppercase tracking-wider">Global</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {recentResults[0]?.score >= 90 ? 'Nivel MCC Avanzado' :
                       recentResults[0]?.score >= 80 ? 'Nivel PCC Sólido' :
                       recentResults[0]?.score >= 70 ? 'Nivel ACC Competente' : 'En Desarrollo'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {recentResults[0]?.correctAnswers}/{recentResults[0]?.totalQuestions} respuestas correctas en {formatTimeSpent(recentResults[0]?.timeSpent || 0)}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Historial de Simulaciones</h3>
                  </div>
                  <div className="space-y-3">
                    {recentResults.map((result, idx) => (
                      <Link
                        key={result.id}
                        href={`/coach/icf-simulator/results/${result.id}`}
                        className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            result.score >= 70 ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                          }`}>
                            <span className={`font-bold ${
                              result.score >= 70 ? 'text-emerald-400' : 'text-amber-400'
                            }`}>{result.score}%</span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {result.date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                            <p className="text-gray-500 text-xs">{result.correctAnswers}/{result.totalQuestions} correctas</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Empty State if no questions */}
          {allQuestions.length < 60 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 text-center">
              <p className="text-amber-400">
                Se requieren al menos 60 preguntas para iniciar una simulación. 
                Actualmente hay {allQuestions.length} preguntas disponibles.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Saving state
  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-white">Guardando resultados...</p>
      </div>
    );
  }

  // Exam In Progress
  const currentQuestion = examQuestions[currentIndex];
  const progress = ((currentIndex + 1) / 60) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="w-48">
            <p className="text-sm text-gray-400">Pregunta {currentIndex + 1} de 60</p>
            <div className="w-full bg-[#1a1a1a] rounded-full h-2 mt-2">
              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg">
            <Clock className="text-amber-400" size={20} />
            <span className="text-xl font-bold text-amber-400">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-8 mb-6">
          {currentQuestion?.competencyName && (
            <p className="text-emerald-400 text-xs uppercase tracking-wider mb-4">
              {currentQuestion.domainName} • {currentQuestion.competencyName}
            </p>
          )}
          <h2 className="text-xl font-semibold mb-6">{currentQuestion?.question}</h2>

          <div className="space-y-3">
            {currentQuestion?.options.map((option, i) => (
              <button 
                key={i} 
                onClick={() => setAnswers({ ...answers, [currentIndex]: option })} 
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  answers[currentIndex] === option 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : 'border-gray-700 hover:border-gray-600 bg-[#1a1a1a]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} 
            disabled={currentIndex === 0} 
            className="px-6 py-3 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg font-medium hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          {currentIndex < 59 ? (
            <button 
              onClick={() => setCurrentIndex(currentIndex + 1)} 
              disabled={!answers[currentIndex]} 
              className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          ) : (
            <button 
              onClick={finishExam} 
              disabled={!answers[currentIndex] || saving} 
              className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finalizar Examen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
