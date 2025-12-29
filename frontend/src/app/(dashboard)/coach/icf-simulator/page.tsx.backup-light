'use client';

import { useState, useEffect } from 'react';
import { Clock, Award, Play, RotateCcw } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Question {
  question: string;
  options: string[];
  correct: string;
}

export default function ICFSimulatorPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const q = query(collection(db, 'icf_questions'), where('active', '==', true));
        const snapshot = await getDocs(q);
        const questionsData = snapshot.docs.map(doc => doc.data()) as Question[];
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
    const selected = shuffled.slice(0, 60).map(q => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));
    setExamQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(60 * 60);
    setExamStarted(true);
    setExamFinished(false);
  };

  const finishExam = () => {
    let correct = 0;
    examQuestions.forEach((q, i) => {
      const userAnswer = answers[i];
      if (userAnswer) {
        const letter = userAnswer.charAt(0);
        if (letter === q.correct) {
          correct++;
        }
      }
    });
    setScore(correct);
    setExamFinished(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + secs.toString().padStart(2, '0');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">No hay preguntas disponibles</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Award className="mx-auto text-primary-600 mb-4" size={64} />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Simulador Examen ICF ACC</h1>
            <p className="text-gray-600">Practica para tu certificación ICF Associate Certified Coach</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalles del Examen</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">60 Preguntas</p>
                  <p className="text-sm text-gray-600">Selección aleatoria de {allQuestions.length} preguntas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">60 Minutos</p>
                  <p className="text-sm text-gray-600">Timer con envío automático</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-700 font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Aleatorio</p>
                  <p className="text-sm text-gray-600">Preguntas mezcladas cada vez</p>
                </div>
              </div>
            </div>
          </div>

          <button onClick={startExam} className="w-full py-4 bg-primary-600 text-white rounded-lg font-bold text-lg hover:bg-primary-700 flex items-center justify-center gap-2">
            <Play size={24} />
            Comenzar Examen
          </button>
        </div>
      </div>
    );
  }

  if (examFinished) {
    const percentage = (score / 60) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
            <Award className={'mx-auto mb-4 ' + (passed ? 'text-green-500' : 'text-orange-500')} size={64} />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{passed ? '¡Felicitaciones!' : '¡Sigue Practicando!'}</h1>
            <p className="text-gray-600 mb-8">Tu puntaje:</p>
            
            <div className="text-6xl font-bold text-gray-900 mb-2">{score}/60</div>
            <div className="text-2xl font-bold mb-8" style={{color: passed ? '#10b981' : '#f59e0b'}}>{percentage.toFixed(1)}%</div>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Puntaje para Aprobar</p>
              <p className="text-2xl font-bold text-gray-900">70%</p>
            </div>

            <button onClick={startExam} className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2">
              <RotateCcw size={20} />
              Intentar de Nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentIndex];
  const progress = ((currentIndex + 1) / 60) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-6 flex items-center justify-between">
          <div style={{width: '200px'}}>
            <p className="text-sm text-gray-600">Pregunta {currentIndex + 1} de 60</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: progress + '%' }} />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
            <Clock className="text-orange-600" size={20} />
            <span className="text-xl font-bold text-orange-900">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => (
              <button 
                key={i} 
                onClick={() => setAnswers({ ...answers, [currentIndex]: option })} 
                className={'w-full text-left p-4 rounded-lg border-2 ' + (answers[currentIndex] === option ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300')}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50">
            Anterior
          </button>
          
          {currentIndex < 59 ? (
            <button onClick={() => setCurrentIndex(currentIndex + 1)} disabled={!answers[currentIndex]} className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50">
              Siguiente
            </button>
          ) : (
            <button onClick={finishExam} disabled={!answers[currentIndex]} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
              Finalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
