'use client';

import React, { useState } from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import { Value, ValueRating } from '@/types/values';

interface ValuesResultsProps {
  ratings: Record<string, ValueRating>;
  values: Value[];
  onReset: () => void;
}

interface ValueScore extends Value {
  importance: number;
  alignment: number;
  gap: number;
}

export default function ValuesResults({ ratings, values, onReset }: ValuesResultsProps) {
  const [reflections, setReflections] = useState('');

  // Calculate scores
  const valueScores: ValueScore[] = values.map(value => {
    const rating = ratings[value.id];
    return {
      ...value,
      importance: rating.importance,
      alignment: rating.alignment,
      gap: rating.importance - rating.alignment,
    };
  });

  // Sort by importance
  const topValues = [...valueScores]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 5);

  // Values with biggest gaps (misaligned)
  const misalignedValues = [...valueScores]
    .filter(v => v.gap >= 2)
    .sort((a, b) => b.gap - a.gap);

  // Well-aligned values
  const alignedValues = [...valueScores]
    .filter(v => v.importance >= 4 && v.alignment >= 4)
    .sort((a, b) => b.importance - a.importance);

  // Categorize values into quadrants
  const quadrants = {
    highPriority: valueScores.filter(v => v.importance >= 4 && v.alignment < 4), // Important but not aligned
    strengths: valueScores.filter(v => v.importance >= 4 && v.alignment >= 4),    // Important and aligned
    consider: valueScores.filter(v => v.importance < 4 && v.alignment >= 4),      // Aligned but not important
    lowPriority: valueScores.filter(v => v.importance < 4 && v.alignment < 4),   // Not important, not aligned
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Values Clarification Results
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Understanding your core values and how well your life aligns with them
        </p>
      </div>

      {/* Top 5 Values */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Target className="text-primary-600" />
          Your Top 5 Values
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topValues.map((value, index) => (
            <div 
              key={value.id}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 relative"
            >
              <div className="absolute top-4 right-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2 pr-10">
                {value.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Importance:</span>
                  <span className="font-bold text-primary-600">{value.importance}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alignment:</span>
                  <span className="font-bold text-blue-600">{value.alignment}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gap:</span>
                  <span className={`font-bold ${value.gap > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {value.gap > 0 ? `+${value.gap}` : value.gap}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Matrix Quadrants */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Values Matrix Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* High Priority (Important but not aligned) */}
          <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h4 className="text-xl font-bold text-red-900">
                High Priority Areas
              </h4>
            </div>
            <p className="text-sm text-red-700 mb-4">
              Important values that need more attention
            </p>
            {quadrants.highPriority.length > 0 ? (
              <ul className="space-y-2">
                {quadrants.highPriority.map(value => (
                  <li key={value.id} className="flex justify-between items-center">
                    <span className="font-medium text-red-800">{value.name}</span>
                    <span className="text-sm text-red-600">Gap: +{value.gap}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-600 italic">No values in this category</p>
            )}
          </div>

          {/* Strengths (Important and aligned) */}
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h4 className="text-xl font-bold text-green-900">
                Your Strengths
              </h4>
            </div>
            <p className="text-sm text-green-700 mb-4">
              Important values that you're living well
            </p>
            {quadrants.strengths.length > 0 ? (
              <ul className="space-y-2">
                {quadrants.strengths.map(value => (
                  <li key={value.id} className="flex justify-between items-center">
                    <span className="font-medium text-green-800">{value.name}</span>
                    <span className="text-sm text-green-600">✓ Aligned</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-green-600 italic">No values in this category</p>
            )}
          </div>

          {/* Consider (Aligned but not important) */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h4 className="text-xl font-bold text-blue-900">
                Well Developed
              </h4>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              Values you're living but may not be as critical
            </p>
            {quadrants.consider.length > 0 ? (
              <ul className="space-y-2">
                {quadrants.consider.slice(0, 5).map(value => (
                  <li key={value.id} className="font-medium text-blue-800">
                    {value.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-blue-600 italic">No values in this category</p>
            )}
          </div>

          {/* Low Priority */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              <h4 className="text-xl font-bold text-gray-900">
                Lower Priority
              </h4>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Values that are currently less important to you
            </p>
            <p className="text-sm text-gray-600">
              {quadrants.lowPriority.length} value(s) in this category
            </p>
          </div>

        </div>
      </div>

      {/* Reflections */}
      <div className="bg-yellow-50 rounded-xl p-8 border-2 border-yellow-200">
        <h3 className="text-xl font-bold text-yellow-900 mb-4">
          Personal Reflections
        </h3>
        <p className="text-sm text-yellow-800 mb-4">
          Take a moment to reflect on your results. What insights did you gain? What actions might you take?
        </p>
        <textarea
          value={reflections}
          onChange={(e) => setReflections(e.target.value)}
          placeholder="Write your reflections here..."
          className="w-full h-32 px-4 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-6">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Retake Assessment
        </button>
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md"
        >
          Download Results
        </button>
      </div>

    </div>
  );
}
