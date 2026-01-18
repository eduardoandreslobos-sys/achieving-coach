'use client';

import React from 'react';
import { Compass, TrendingUp, AlertTriangle, Users, Target, Lightbulb } from 'lucide-react';
import { CareerCompass, CAREER_DIMENSIONS } from '@/types/career';

interface CareerCompassResultsProps {
  compass: CareerCompass;
  onReset: () => void;
}

export default function CareerCompassResults({ compass, onReset }: CareerCompassResultsProps) {
  
  // Calculate average satisfaction
  const dimensionValues = Object.values(compass.dimensions);
  const avgSatisfaction = dimensionValues.reduce((sum, val) => sum + val, 0) / dimensionValues.length;
  
  // Identify strong and weak dimensions
  const sortedDimensions = CAREER_DIMENSIONS.map(d => ({
    ...d,
    value: compass.dimensions[d.key as keyof typeof compass.dimensions]
  })).sort((a, b) => b.value - a.value);
  
  const strengths = sortedDimensions.filter(d => d.value >= 7);
  const areasForGrowth = sortedDimensions.filter(d => d.value <= 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-600 p-4 rounded-full">
            <Compass className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Your Career Compass
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive view of your current position and future direction
        </p>
      </div>

      {/* Current Situation */}
      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Current Position</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Role</p>
            <p className="font-bold text-gray-900">{compass.currentRole}</p>
          </div>
          {compass.currentCompany && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Company</p>
              <p className="font-bold text-gray-900">{compass.currentCompany}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Experience</p>
            <p className="font-bold text-gray-900">{compass.yearsExperience} years</p>
          </div>
        </div>
      </div>

      {/* Career Satisfaction Overview */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Career Satisfaction Analysis</h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Overall Score</p>
            <p className="text-3xl font-bold text-primary-600">{avgSatisfaction.toFixed(1)}/10</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {CAREER_DIMENSIONS.map((dimension) => {
            const value = compass.dimensions[dimension.key as keyof typeof compass.dimensions];
            const percentage = (value / 10) * 100;
            
            let colorClass = 'bg-green-500';
            if (value <= 5) colorClass = 'bg-red-500';
            else if (value <= 7) colorClass = 'bg-yellow-500';

            return (
              <div key={dimension.key} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{dimension.label}</h4>
                    <p className="text-xs text-gray-600">{dimension.description}</p>
                  </div>
                  <span className="text-xl font-bold text-gray-900 ml-2">{value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${colorClass} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Satisfaction Strengths */}
        {strengths.length > 0 && (
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-green-900">
                High Satisfaction Areas
              </h3>
            </div>
            <ul className="space-y-2">
              {strengths.map((dim) => (
                <li key={dim.key} className="flex justify-between items-center">
                  <span className="font-medium text-green-800">{dim.label}</span>
                  <span className="text-green-600 font-bold">{dim.value}/10</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {areasForGrowth.length > 0 && (
          <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-bold text-yellow-900">
                Areas for Growth
              </h3>
            </div>
            <ul className="space-y-2">
              {areasForGrowth.map((dim) => (
                <li key={dim.key} className="flex justify-between items-center">
                  <span className="font-medium text-yellow-800">{dim.label}</span>
                  <span className="text-yellow-600 font-bold">{dim.value}/10</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Assets: Strengths, Interests, Values */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lightbulb className="text-primary-600" />
          Your Career Assets
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">Strengths</h4>
            <ul className="space-y-2">
              {compass.strengths.map((strength, index) => (
                <li key={index} className="flex gap-2 text-sm text-blue-800">
                  <span>•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
            <h4 className="font-bold text-purple-900 mb-3">Interests</h4>
            <ul className="space-y-2">
              {compass.interests.map((interest, index) => (
                <li key={index} className="flex gap-2 text-sm text-purple-800">
                  <span>•</span>
                  <span>{interest}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
            <h4 className="font-bold text-pink-900 mb-3">Values</h4>
            <ul className="space-y-2">
              {compass.values.map((value, index) => (
                <li key={index} className="flex gap-2 text-sm text-pink-800">
                  <span>•</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ideal Career Direction */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-green-600" />
          <h3 className="text-2xl font-bold text-green-900">
            Your Ideal Career Direction
          </h3>
        </div>
        <p className="text-gray-800 whitespace-pre-line text-lg leading-relaxed">
          {compass.idealRole}
        </p>
      </div>

      {/* Barriers & Support */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-red-900">
              Barriers to Address
            </h3>
          </div>
          <ul className="space-y-2">
            {compass.barriers.map((barrier, index) => (
              <li key={index} className="flex gap-2 text-sm text-red-800">
                <span>⚠️</span>
                <span>{barrier}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-bold text-blue-900">
              Support & Resources
            </h3>
          </div>
          <ul className="space-y-2">
            {compass.supporters.map((supporter, index) => (
              <li key={index} className="flex gap-2 text-sm text-blue-800">
                <span>✓</span>
                <span>{supporter}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-primary-50 rounded-xl p-8 border-2 border-primary-200">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-6 h-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-primary-900">
            Your Action Plan
          </h3>
        </div>
        <div className="space-y-3">
          {compass.nextSteps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-4 border-2 border-primary-200 flex items-start gap-4"
            >
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-800 flex-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reflection Prompt */}
      <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
        <h3 className="text-xl font-bold text-yellow-900 mb-3">
          Reflection Questions
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li>• What patterns do you notice in your satisfaction scores?</li>
          <li>• Which of your strengths are you currently using in your role?</li>
          <li>• What would need to change for you to move closer to your ideal career?</li>
          <li>• Which barrier is most critical to address first?</li>
          <li>• Who from your support network can help you with your next steps?</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-6">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Create New Compass
        </button>
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md"
        >
          Download Compass
        </button>
      </div>

    </div>
  );
}
