'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Brain, 
  Dumbbell, 
  Users 
} from 'lucide-react';
import { ResilienceAnswers, ResilienceQuestion } from '@/types/resilience';

interface ResilienceResultsProps {
  answers: ResilienceAnswers;
  questions: ResilienceQuestion[];
  onReset: () => void;
}

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

export default function ResilienceResults({ 
  answers, 
  questions, 
  onReset 
}: ResilienceResultsProps) {
  
  // Calculate scores by category
  const calculateScores = (): CategoryScore[] => {
    const categories = ['Emotional', 'Physical', 'Mental', 'Social'];
    const categoryIcons: Record<string, React.ReactNode> = {
      'Emotional': <Heart className="w-6 h-6" />,
      'Physical': <Dumbbell className="w-6 h-6" />,
      'Mental': <Brain className="w-6 h-6" />,
      'Social': <Users className="w-6 h-6" />
    };
    const categoryColors: Record<string, string> = {
      'Emotional': 'bg-pink-500',
      'Physical': 'bg-green-500',
      'Mental': 'bg-emerald-500',
      'Social': 'bg-purple-500'
    };

    return categories.map(category => {
      const categoryQuestions = questions.filter(q => q.category === category);
      const categoryAnswers = categoryQuestions.map(q => answers[q.id] || 0);
      const score = categoryAnswers.reduce((sum, val) => sum + val, 0);
      const maxScore = categoryQuestions.length * 5;
      const percentage = (score / maxScore) * 100;

      return {
        name: category,
        score,
        maxScore,
        percentage,
        icon: categoryIcons[category],
        color: categoryColors[category]
      };
    });
  };

  const categoryScores = calculateScores();
  const totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
  const totalMaxScore = categoryScores.reduce((sum, cat) => sum + cat.maxScore, 0);
  const overallPercentage = (totalScore / totalMaxScore) * 100;

  // Determine overall level
  const getResilienceLevel = (percentage: number): { label: string; color: string } => {
    if (percentage >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (percentage >= 60) return { label: 'Good', color: 'text-emerald-600' };
    if (percentage >= 40) return { label: 'Moderate', color: 'text-yellow-600' };
    return { label: 'Needs Attention', color: 'text-red-600' };
  };

  const resilienceLevel = getResilienceLevel(overallPercentage);

  // Identify strengths and growth areas
  const sortedCategories = [...categoryScores].sort((a, b) => b.percentage - a.percentage);
  const strengths = sortedCategories.slice(0, 2);
  const growthAreas = sortedCategories.slice(-2).reverse();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Resilience Assessment Results
        </h2>
        <div className="mt-6">
          <div className="inline-block">
            <div className="text-6xl font-bold text-primary-600 mb-2">
              {Math.round(overallPercentage)}%
            </div>
            <div className={`text-2xl font-semibold ${resilienceLevel.color}`}>
              {resilienceLevel.label}
            </div>
          </div>
        </div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          You scored {totalScore} out of {totalMaxScore} points across all resilience categories.
        </p>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Category Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryScores.map((category) => (
            <div 
              key={category.name}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${category.color} text-white p-3 rounded-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {category.name} Resilience
                    </h4>
                    <p className="text-sm text-gray-500">
                      {category.score} / {category.maxScore} points
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(category.percentage)}%
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`${category.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Growth Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-bold text-green-900">
              Your Strengths
            </h3>
          </div>
          <ul className="space-y-3">
            {strengths.map((category) => (
              <li key={category.name} className="flex items-center justify-between">
                <span className="font-medium text-green-800">
                  {category.name} Resilience
                </span>
                <span className="text-green-600 font-bold">
                  {Math.round(category.percentage)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-green-700 mt-4">
            These areas show strong resilience. Continue nurturing these strengths!
          </p>
        </div>

        {/* Growth Areas */}
        <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-bold text-yellow-900">
              Growth Opportunities
            </h3>
          </div>
          <ul className="space-y-3">
            {growthAreas.map((category) => (
              <li key={category.name} className="flex items-center justify-between">
                <span className="font-medium text-yellow-800">
                  {category.name} Resilience
                </span>
                <span className="text-yellow-600 font-bold">
                  {Math.round(category.percentage)}%
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-yellow-700 mt-4">
            Focus on these areas to enhance your overall resilience.
          </p>
        </div>
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
