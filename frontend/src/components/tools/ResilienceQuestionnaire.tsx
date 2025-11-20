'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResilienceQuestion, ResilienceAnswers } from '@/types/resilience';

interface ResilienceQuestionnaireProps {
  questions: ResilienceQuestion[];
  onComplete: (answers: ResilienceAnswers) => void;
}

const QUESTIONS_PER_PAGE = 5;

export default function ResilienceQuestionnaire({ 
  questions, 
  onComplete 
}: ResilienceQuestionnaireProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<ResilienceAnswers>({});

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, questions.length);
  const currentQuestions = questions.slice(startIndex, endIndex);

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const canGoNext = currentQuestions.every(q => answers[q.id] !== undefined);
  const canGoBack = currentPage > 0;
  const isLastPage = currentPage === totalPages - 1;

  const handleNext = () => {
    if (isLastPage && answeredCount === questions.length) {
      onComplete(answers);
    } else if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {answeredCount} of {questions.length} questions
          </span>
          <span className="text-sm font-medium text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Page Indicator */}
      <div className="text-center mb-6">
        <span className="text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentQuestions.map((question, index) => (
          <div 
            key={question.id}
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors"
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                {question.category}
              </span>
              <h3 className="text-lg font-medium text-gray-900">
                {startIndex + index + 1}. {question.text}
              </h3>
            </div>

            {/* Likert Scale */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(question.id, value)}
                    className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                      answers[question.id] === value
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            canGoBack
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            canGoNext
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastPage ? 'Complete Assessment' : 'Next'}
          {!isLastPage && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}
