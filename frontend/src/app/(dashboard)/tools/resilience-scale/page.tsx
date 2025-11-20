'use client';

import React, { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ResilienceQuestionnaire from '@/components/tools/ResilienceQuestionnaire';
import ResilienceResults from '@/components/tools/ResilienceResults';
import { ResilienceQuestion, ResilienceAnswers } from '@/types/resilience';

// 25 questions across 4 categories
const RESILIENCE_QUESTIONS: ResilienceQuestion[] = [
  // Emotional Resilience (7 questions)
  { id: 'emo1', category: 'Emotional', text: 'I am able to adapt when changes occur in my life.' },
  { id: 'emo2', category: 'Emotional', text: 'I can deal with whatever comes my way.' },
  { id: 'emo3', category: 'Emotional', text: 'I tend to bounce back after illness, injury, or other hardships.' },
  { id: 'emo4', category: 'Emotional', text: 'I believe I can achieve my goals even when there are obstacles.' },
  { id: 'emo5', category: 'Emotional', text: 'Even when things look hopeless, I don\'t give up.' },
  { id: 'emo6', category: 'Emotional', text: 'Under pressure, I stay focused and think clearly.' },
  { id: 'emo7', category: 'Emotional', text: 'I am not easily discouraged by failure.' },

  // Physical Resilience (6 questions)
  { id: 'phy1', category: 'Physical', text: 'I maintain a regular exercise routine.' },
  { id: 'phy2', category: 'Physical', text: 'I get enough sleep to feel rested and energized.' },
  { id: 'phy3', category: 'Physical', text: 'I eat a balanced and nutritious diet.' },
  { id: 'phy4', category: 'Physical', text: 'I take time to relax and recharge my body.' },
  { id: 'phy5', category: 'Physical', text: 'I manage stress through physical activities or practices.' },
  { id: 'phy6', category: 'Physical', text: 'I listen to my body and address health concerns promptly.' },

  // Mental Resilience (6 questions)
  { id: 'men1', category: 'Mental', text: 'I can control my thoughts when feeling anxious or stressed.' },
  { id: 'men2', category: 'Mental', text: 'I practice mindfulness or meditation regularly.' },
  { id: 'men3', category: 'Mental', text: 'I maintain a positive outlook even in difficult situations.' },
  { id: 'men4', category: 'Mental', text: 'I learn from my mistakes and move forward.' },
  { id: 'men5', category: 'Mental', text: 'I can find meaning and purpose in challenging experiences.' },
  { id: 'men6', category: 'Mental', text: 'I engage in activities that stimulate my mind and creativity.' },

  // Social Resilience (6 questions)
  { id: 'soc1', category: 'Social', text: 'I have close relationships that provide support.' },
  { id: 'soc2', category: 'Social', text: 'I feel comfortable asking others for help when needed.' },
  { id: 'soc3', category: 'Social', text: 'I maintain connections with family and friends.' },
  { id: 'soc4', category: 'Social', text: 'I participate in community or group activities.' },
  { id: 'soc5', category: 'Social', text: 'I feel a sense of belonging in my social circles.' },
  { id: 'soc6', category: 'Social', text: 'I contribute to the wellbeing of others in my life.' },
];

export default function ResilienceScalePage() {
  const [answers, setAnswers] = useState<ResilienceAnswers | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleComplete = (completedAnswers: ResilienceAnswers) => {
    setAnswers(completedAnswers);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers(null);
    setShowResults(false);
  };

  if (showResults && answers) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-5xl mx-auto mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>
        </div>
        <ResilienceResults 
          answers={answers} 
          questions={RESILIENCE_QUESTIONS}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary-100 p-4 rounded-xl">
              <Shield className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Resilience Assessment Scale
              </h1>
              <p className="text-gray-600 mt-1">
                Evaluate your resilience across emotional, physical, mental, and social dimensions
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3">
            Instructions
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span>This assessment contains 25 questions across 4 categories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span>Rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span>Answer honestly based on how you typically feel and behave</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span>There are no right or wrong answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5">•</span>
              <span>The assessment takes approximately 5-7 minutes to complete</span>
            </li>
          </ul>
        </div>

        {/* Questionnaire */}
        <ResilienceQuestionnaire 
          questions={RESILIENCE_QUESTIONS}
          onComplete={handleComplete}
        />

      </div>
    </div>
  );
}
