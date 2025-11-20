'use client';

import React, { useState } from 'react';
import { Value, ValueRating } from '@/types/values';

interface ValuesMatrixProps {
  values: Value[];
  onComplete: (ratings: Record<string, ValueRating>) => void;
}

export default function ValuesMatrix({ values, onComplete }: ValuesMatrixProps) {
  const [ratings, setRatings] = useState<Record<string, ValueRating>>({});
  const [currentStep, setCurrentStep] = useState<'importance' | 'alignment'>('importance');

  const handleRating = (valueId: string, type: 'importance' | 'alignment', score: number) => {
    setRatings(prev => ({
      ...prev,
      [valueId]: {
        ...prev[valueId],
        valueId,
        importance: type === 'importance' ? score : (prev[valueId]?.importance || 0),
        alignment: type === 'alignment' ? score : (prev[valueId]?.alignment || 0),
      }
    }));
  };

  const allRated = values.every(v => 
    currentStep === 'importance' 
      ? ratings[v.id]?.importance > 0
      : ratings[v.id]?.alignment > 0
  );

  const handleNext = () => {
    if (currentStep === 'importance' && allRated) {
      setCurrentStep('alignment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 'alignment' && allRated) {
      onComplete(ratings);
    }
  };

  const progress = currentStep === 'importance' ? 50 : 100;

  // Group values by category
  const valuesByCategory = values.reduce((acc, value) => {
    if (!acc[value.category]) {
      acc[value.category] = [];
    }
    acc[value.category].push(value);
    return acc;
  }, {} as Record<string, Value[]>);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep === 'importance' ? '1' : '2'} of 2: 
            {currentStep === 'importance' ? ' Rate Importance' : ' Rate Current Alignment'}
          </span>
          <span className="text-sm font-medium text-primary-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="font-bold text-blue-900 mb-2">
          {currentStep === 'importance' ? 'Step 1: Importance' : 'Step 2: Current Alignment'}
        </h3>
        <p className="text-blue-800">
          {currentStep === 'importance' 
            ? 'Rate how important each value is to you on a scale of 1-5, where 1 is "Not Important" and 5 is "Extremely Important".'
            : 'Now rate how well your current life aligns with each value on a scale of 1-5, where 1 is "Not Aligned" and 5 is "Fully Aligned".'}
        </p>
      </div>

      {/* Values by Category */}
      <div className="space-y-8">
        {Object.entries(valuesByCategory).map(([category, categoryValues]) => (
          <div key={category}>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              {category}
            </h3>
            <div className="space-y-4">
              {categoryValues.map((value) => (
                <div 
                  key={value.id}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors"
                >
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {value.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {value.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-24">
                      {currentStep === 'importance' ? 'Importance:' : 'Alignment:'}
                    </span>
                    <div className="flex gap-2 flex-1">
                      {[1, 2, 3, 4, 5].map((score) => {
                        const currentRating = currentStep === 'importance' 
                          ? ratings[value.id]?.importance 
                          : ratings[value.id]?.alignment;
                        
                        return (
                          <button
                            key={score}
                            onClick={() => handleRating(value.id, currentStep, score)}
                            className={`flex-1 py-3 rounded-lg border-2 font-bold transition-all ${
                              currentRating === score
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md scale-105'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                            }`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!allRated}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            allRated
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentStep === 'importance' ? 'Continue to Alignment' : 'View Results'}
        </button>
      </div>
    </div>
  );
}
