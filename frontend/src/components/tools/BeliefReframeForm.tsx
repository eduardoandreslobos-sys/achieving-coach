'use client';

import React, { useState } from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { LimitingBelief, BELIEF_CATEGORIES, BELIEF_PROMPTS } from '@/types/belief';

interface BeliefReframeFormProps {
  onComplete: (belief: LimitingBelief) => void;
}

export default function BeliefReframeForm({ onComplete }: BeliefReframeFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    belief: '',
    category: 'Self-Worth' as any,
    evidence: [''],
    counterEvidence: [''],
    reframe: '',
    newBelief: '',
    actionSteps: [''],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field: 'evidence' | 'counterEvidence' | 'actionSteps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeItem = (field: 'evidence' | 'counterEvidence' | 'actionSteps', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (field: 'evidence' | 'counterEvidence' | 'actionSteps', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.belief.trim().length > 0 && formData.category;
      case 2:
        return formData.evidence.some(e => e.trim().length > 0);
      case 3:
        return formData.counterEvidence.some(e => e.trim().length > 0);
      case 4:
        return formData.reframe.trim().length > 0;
      case 5:
        return formData.newBelief.trim().length > 0;
      case 6:
        return formData.actionSteps.some(a => a.trim().length > 0);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 6 && canProceed()) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    if (canProceed()) {
      const belief: LimitingBelief = {
        id: Date.now().toString(),
        belief: formData.belief,
        category: formData.category,
        evidence: formData.evidence.filter(e => e.trim().length > 0),
        counterEvidence: formData.counterEvidence.filter(e => e.trim().length > 0),
        reframe: formData.reframe,
        newBelief: formData.newBelief,
        actionSteps: formData.actionSteps.filter(a => a.trim().length > 0),
        createdAt: new Date(),
      };
      onComplete(belief);
    }
  };

  const progress = (step / 6) * 100;
  const currentPrompts = BELIEF_PROMPTS.find(p => p.category === formData.category);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {step} of 6
          </span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-6">
        
        {/* Step 1: Identify Belief */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What limiting belief holds you back?
              </h2>
              <p className="text-gray-600">
                Identify a specific belief that limits your potential
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {BELIEF_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Limiting Belief
              </label>
              <textarea
                value={formData.belief}
                onChange={(e) => updateField('belief', e.target.value)}
                placeholder="Write your limiting belief here..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            {currentPrompts && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Common {formData.category} beliefs:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  {currentPrompts.examples.map((ex, i) => (
                    <li key={i}>• "{ex}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Evidence For */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What "evidence" supports this belief?
              </h2>
              <p className="text-gray-600">
                List experiences or situations that seem to confirm this belief
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
              <p className="text-sm text-red-800">
                <strong>Your limiting belief:</strong> "{formData.belief}"
              </p>
            </div>

            <div className="space-y-3">
              {formData.evidence.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem('evidence', index, e.target.value)}
                    placeholder={`Evidence ${index + 1}`}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.evidence.length > 1 && (
                    <button
                      onClick={() => removeItem('evidence', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addItem('evidence')}
                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                <Plus size={20} />
                Add More Evidence
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Counter-Evidence */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What evidence contradicts this belief?
              </h2>
              <p className="text-gray-600">
                List times when this belief was NOT true, or evidence against it
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  This is crucial! Finding counter-evidence helps break the belief's power.
                  Think of exceptions, successes, or alternative explanations.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {formData.counterEvidence.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem('counterEvidence', index, e.target.value)}
                    placeholder={`Counter-evidence ${index + 1}`}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.counterEvidence.length > 1 && (
                    <button
                      onClick={() => removeItem('counterEvidence', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addItem('counterEvidence')}
                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                <Plus size={20} />
                Add More Counter-Evidence
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Challenge & Reframe */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Challenge your belief
              </h2>
              <p className="text-gray-600">
                Question the belief. Is it absolutely true? Could there be another way to see it?
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-900 mb-2">Questions to consider:</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Is this belief 100% true, 100% of the time?</li>
                <li>• What would I tell a friend who had this belief?</li>
                <li>• What's the cost of holding onto this belief?</li>
                <li>• What becomes possible if I let go of this belief?</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Challenge/Reframe
              </label>
              <textarea
                value={formData.reframe}
                onChange={(e) => updateField('reframe', e.target.value)}
                placeholder="Write your thoughts on challenging this belief..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 5: New Empowering Belief */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create your new empowering belief
              </h2>
              <p className="text-gray-600">
                Rewrite your limiting belief into a positive, empowering one
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                <p className="text-xs font-bold text-red-900 mb-2">OLD BELIEF:</p>
                <p className="text-sm text-red-800">"{formData.belief}"</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <p className="text-xs font-bold text-green-900 mb-2">NEW BELIEF:</p>
                <p className="text-sm text-green-800 italic">Write below ↓</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your New Empowering Belief
              </label>
              <textarea
                value={formData.newBelief}
                onChange={(e) => updateField('newBelief', e.target.value)}
                placeholder="I am capable of..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Tips for empowering beliefs:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use present tense ("I am" not "I will be")</li>
                <li>• Make it positive (what you want, not what you don't want)</li>
                <li>• Make it believable (stretch, but not fantasy)</li>
                <li>• Keep it personal ("I" statements)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 6: Action Steps */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What actions will reinforce your new belief?
              </h2>
              <p className="text-gray-600">
                List specific actions you can take to strengthen this new belief
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-800">
                <strong>Your new belief:</strong> "{formData.newBelief}"
              </p>
            </div>

            <div className="space-y-3">
              {formData.actionSteps.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem('actionSteps', index, e.target.value)}
                    placeholder={`Action step ${index + 1}`}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {formData.actionSteps.length > 1 && (
                    <button
                      onClick={() => removeItem('actionSteps', index)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addItem('actionSteps')}
                className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              >
                <Plus size={20} />
                Add More Actions
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            step > 1
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          Back
        </button>

        <button
          onClick={step === 6 ? handleComplete : handleNext}
          disabled={!canProceed()}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            canProceed()
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === 6 ? 'Complete Reframe' : 'Next'}
        </button>
      </div>
    </div>
  );
}
