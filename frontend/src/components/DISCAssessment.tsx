'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loadDISCQuestions, calculateDISCProfile, saveDISCResultComplete } from '@/lib/discService';
import { DISCQuestionGroup, DISCResponse, DISCStatement } from '@/types/disc';
import { Loader2, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';

export function DISCAssessment() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<DISCQuestionGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [responses, setResponses] = useState<DISCResponse[]>([]);
  const [selectedMost, setSelectedMost] = useState<'D' | 'I' | 'S' | 'C' | null>(null);
  const [selectedLeast, setSelectedLeast] = useState<'D' | 'I' | 'S' | 'C' | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestionsData();
  }, []);

  async function loadQuestionsData() {
    try {
      setLoading(true);
      const loadedQuestions = await loadDISCQuestions();
      
      // Si no hay preguntas en Firestore, usar preguntas por defecto
      if (loadedQuestions.length === 0) {
        setQuestions(getDefaultQuestions());
      } else {
        setQuestions(loadedQuestions);
      }
    } catch (err) {
      console.error(err);
      // Usar preguntas por defecto si hay error
      setQuestions(getDefaultQuestions());
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (!selectedMost || !selectedLeast || selectedMost === selectedLeast) {
      return;
    }

    const newResponse: DISCResponse = {
      groupId: questions[currentGroup].groupId,
      mostLike: selectedMost,
      leastLike: selectedLeast,
    };

    const newResponses = [...responses, newResponse];
    setResponses(newResponses);
    setSelectedMost(null);
    setSelectedLeast(null);

    if (currentGroup < questions.length - 1) {
      setCurrentGroup(currentGroup + 1);
    } else {
      completeAssessment(newResponses);
    }
  }

  function handleBack() {
    if (currentGroup > 0) {
      const prevResponse = responses[responses.length - 1];
      setCurrentGroup(currentGroup - 1);
      setResponses(responses.slice(0, -1));
      if (prevResponse) {
        setSelectedMost(prevResponse.mostLike);
        setSelectedLeast(prevResponse.leastLike);
      }
    }
  }

  async function completeAssessment(finalResponses: DISCResponse[]) {
    try {
      setSaving(true);
      const profile = calculateDISCProfile(finalResponses);
      const resultId = await saveDISCResultComplete(user!.uid, userProfile, finalResponses, profile);
      router.push(`/tools/disc/result/${resultId}`);
    } catch (err) {
      setError('Error al guardar los resultados. Por favor intenta de nuevo.');
      console.error(err);
      setSaving(false);
    }
  }

  function selectStatement(dimension: 'D' | 'I' | 'S' | 'C', type: 'most' | 'least') {
    if (type === 'most') {
      setSelectedMost(dimension);
      if (selectedLeast === dimension) {
        setSelectedLeast(null);
      }
    } else {
      setSelectedLeast(dimension);
      if (selectedMost === dimension) {
        setSelectedMost(null);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadQuestionsData} 
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (saving) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
          <p className="text-lg text-gray-600">Calculando tu perfil DISC...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <p className="text-center text-gray-600">
          No hay preguntas disponibles. Contacta al administrador.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentGroup];
  const progress = ((currentGroup + 1) / questions.length) * 100;
  const canProceed = selectedMost && selectedLeast && selectedMost !== selectedLeast;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pregunta {currentGroup + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Selecciona la afirmación que MÁS te describe y la que MENOS te describe
        </h2>
        
        <div className="space-y-4">
          {currentQuestion.statements.map((statement: DISCStatement, index: number) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
            >
              <p className="text-gray-700 mb-4">{statement.text}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => selectStatement(statement.dimension, 'most')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedMost === statement.dimension
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedMost === statement.dimension && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  MÁS como yo
                </button>
                <button
                  onClick={() => selectStatement(statement.dimension, 'least')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedLeast === statement.dimension
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedLeast === statement.dimension && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  MENOS como yo
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Validation Message */}
        {selectedMost && selectedLeast && selectedMost === selectedLeast && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Por favor selecciona diferentes afirmaciones para "MÁS" y "MENOS"
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 mt-6 border-t">
          <button
            onClick={handleBack}
            disabled={currentGroup === 0}
            className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {currentGroup === questions.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Preguntas por defecto si no hay en Firestore
function getDefaultQuestions(): DISCQuestionGroup[] {
  return [
    {
      groupId: 1,
      statements: [
        { dimension: 'D', text: 'Tomo decisiones rápidamente y asumo el control de las situaciones' },
        { dimension: 'I', text: 'Disfruto conocer gente nueva y socializar en grupos' },
        { dimension: 'S', text: 'Prefiero ambientes estables y predecibles' },
        { dimension: 'C', text: 'Me aseguro de que todo esté correcto antes de avanzar' },
      ],
    },
    {
      groupId: 2,
      statements: [
        { dimension: 'D', text: 'Me gusta competir y ganar' },
        { dimension: 'I', text: 'Soy optimista y veo el lado positivo de las cosas' },
        { dimension: 'S', text: 'Soy paciente y buen escucha' },
        { dimension: 'C', text: 'Sigo las reglas y procedimientos establecidos' },
      ],
    },
    {
      groupId: 3,
      statements: [
        { dimension: 'D', text: 'Voy directo al grano en las conversaciones' },
        { dimension: 'I', text: 'Me entusiasmo fácilmente con nuevas ideas' },
        { dimension: 'S', text: 'Valoro la lealtad y las relaciones duraderas' },
        { dimension: 'C', text: 'Analizo todos los detalles antes de decidir' },
      ],
    },
    {
      groupId: 4,
      statements: [
        { dimension: 'D', text: 'Prefiero liderar que seguir a otros' },
        { dimension: 'I', text: 'Me gusta persuadir y motivar a los demás' },
        { dimension: 'S', text: 'Evito los conflictos y busco la armonía' },
        { dimension: 'C', text: 'Me preocupo por la calidad y la precisión' },
      ],
    },
    {
      groupId: 5,
      statements: [
        { dimension: 'D', text: 'Acepto desafíos difíciles con confianza' },
        { dimension: 'I', text: 'Expreso mis emociones abiertamente' },
        { dimension: 'S', text: 'Apoyo a mi equipo de manera consistente' },
        { dimension: 'C', text: 'Prefiero trabajar solo para asegurar la calidad' },
      ],
    },
    {
      groupId: 6,
      statements: [
        { dimension: 'D', text: 'Me frustro cuando las cosas van lentas' },
        { dimension: 'I', text: 'Hago que el trabajo sea divertido para todos' },
        { dimension: 'S', text: 'Me adapto a las necesidades de los demás' },
        { dimension: 'C', text: 'Cuestiono la información hasta estar seguro' },
      ],
    },
    {
      groupId: 7,
      statements: [
        { dimension: 'D', text: 'Tomo riesgos calculados para lograr resultados' },
        { dimension: 'I', text: 'Confío en mi intuición y carisma' },
        { dimension: 'S', text: 'Prefiero lo conocido a lo nuevo' },
        { dimension: 'C', text: 'Documento todo de manera organizada' },
      ],
    },
    {
      groupId: 8,
      statements: [
        { dimension: 'D', text: 'Exijo resultados de mí mismo y de otros' },
        { dimension: 'I', text: 'Busco reconocimiento y aprobación social' },
        { dimension: 'S', text: 'Doy segundas oportunidades fácilmente' },
        { dimension: 'C', text: 'Soy crítico con los errores, incluyendo los míos' },
      ],
    },
    {
      groupId: 9,
      statements: [
        { dimension: 'D', text: 'Resuelvo problemas de forma directa y rápida' },
        { dimension: 'I', text: 'Inspiro a otros con mi energía y visión' },
        { dimension: 'S', text: 'Mantengo la calma bajo presión' },
        { dimension: 'C', text: 'Planifico cuidadosamente cada paso' },
      ],
    },
    {
      groupId: 10,
      statements: [
        { dimension: 'D', text: 'Me motivan los logros y el poder' },
        { dimension: 'I', text: 'Me motiva el reconocimiento y la diversión' },
        { dimension: 'S', text: 'Me motiva la seguridad y la estabilidad' },
        { dimension: 'C', text: 'Me motiva hacer las cosas correctamente' },
      ],
    },
  ];
}
