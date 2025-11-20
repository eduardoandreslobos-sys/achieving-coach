'use client';

import React from 'react';
import { ArrowRight, CheckCircle, XCircle, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { LimitingBelief } from '@/types/belief';

interface BeliefReframeResultsProps {
  belief: LimitingBelief;
  onReset: () => void;
}

export default function BeliefReframeResults({ belief, onReset }: BeliefReframeResultsProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header - Transformation */}
      <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-2xl p-8 border-2 border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Your Belief Transformation
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Old Belief */}
          <div className="bg-white rounded-xl p-6 border-2 border-red-300">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-red-900">Limiting Belief</h3>
            </div>
            <p className="text-gray-800 italic">"{belief.belief}"</p>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                {belief.category}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-12 h-12 text-primary-600" />
          </div>

          {/* New Belief */}
          <div className="bg-white rounded-xl p-6 border-2 border-green-300 md:col-start-2">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-900">Empowering Belief</h3>
            </div>
            <p className="text-gray-800 font-medium">"{belief.newBelief}"</p>
          </div>
        </div>
      </div>

      {/* Evidence Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Evidence For */}
        <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-red-900">
              "Evidence" That Supported The Old Belief
            </h3>
          </div>
          <ul className="space-y-2">
            {belief.evidence.map((item, index) => (
              <li key={index} className="flex gap-2 text-sm text-red-800">
                <span className="text-red-600">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Counter Evidence */}
        <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-green-900">
              Evidence Against The Old Belief
            </h3>
          </div>
          <ul className="space-y-2">
            {belief.counterEvidence.map((item, index) => (
              <li key={index} className="flex gap-2 text-sm text-green-800">
                <span className="text-green-600">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reframe Analysis */}
      <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-yellow-900">
            Your Reframe Analysis
          </h3>
        </div>
        <p className="text-gray-800 whitespace-pre-line">
          {belief.reframe}
        </p>
      </div>

      {/* Action Plan */}
      <div className="bg-primary-50 rounded-xl p-6 border-2 border-primary-200">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-bold text-primary-900">
            Action Steps to Reinforce Your New Belief
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {belief.actionSteps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-4 border-2 border-primary-200 flex items-start gap-3"
            >
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-gray-800">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-900">
            Remember
          </h3>
        </div>
        <div className="space-y-3 text-blue-800">
          <p className="text-sm">
            <strong>Changing beliefs takes practice.</strong> Your old belief has been reinforced over time. 
            Your new belief needs the same—daily practice and supporting evidence.
          </p>
          <p className="text-sm">
            <strong>Notice your self-talk.</strong> When the old belief surfaces, acknowledge it and consciously 
            redirect to your new belief. This gets easier with repetition.
          </p>
          <p className="text-sm">
            <strong>Collect evidence.</strong> Actively look for experiences that support your new belief. 
            Keep a journal of these moments.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-6">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Reframe Another Belief
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
