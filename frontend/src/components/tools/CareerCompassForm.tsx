'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { CareerCompass, CareerDimensions, CAREER_DIMENSIONS } from '@/types/career';

interface CareerCompassFormProps {
  onComplete: (compass: CareerCompass) => void;
}

export default function CareerCompassForm({ onComplete }: CareerCompassFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    currentRole: '',
    currentCompany: '',
    yearsExperience: 0,
    dimensions: {
      skills: 5,
      passion: 5,
      marketDemand: 5,
      compensation: 5,
      impact: 5,
      workLifeBalance: 5,
    } as CareerDimensions,
    strengths: [''],
    interests: [''],
    values: [''],
    idealRole: '',
    barriers: [''],
    supporters: [''],
    nextSteps: [''],
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDimension = (key: keyof CareerDimensions, value: number) => {
    setFormData(prev => ({
      ...prev,
      dimensions: { ...prev.dimensions, [key]: value }
    }));
  };

  const addItem = (field: 'strengths' | 'interests' | 'values' | 'barriers' | 'supporters' | 'nextSteps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeItem = (field: 'strengths' | 'interests' | 'values' | 'barriers' | 'supporters' | 'nextSteps', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (field: 'strengths' | 'interests' | 'values' | 'barriers' | 'supporters' | 'nextSteps', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.currentRole.trim().length > 0 && formData.yearsExperience >= 0;
      case 2:
        return true; // Dimensions always have values
      case 3:
        return formData.strengths.some(s => s.trim().length > 0) &&
               formData.interests.some(i => i.trim().length > 0);
      case 4:
        return formData.values.some(v => v.trim().length > 0);
      case 5:
        return formData.idealRole.trim().length > 0;
      case 6:
        return formData.barriers.some(b => b.trim().length > 0) &&
               formData.supporters.some(s => s.trim().length > 0);
      case 7:
        return formData.nextSteps.some(n => n.trim().length > 0);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 7 && canProceed()) {
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
      const compass: CareerCompass = {
        id: Date.now().toString(),
        currentRole: formData.currentRole,
        currentCompany: formData.currentCompany,
        yearsExperience: formData.yearsExperience,
        dimensions: formData.dimensions,
        strengths: formData.strengths.filter(s => s.trim().length > 0),
        interests: formData.interests.filter(i => i.trim().length > 0),
        values: formData.values.filter(v => v.trim().length > 0),
        idealRole: formData.idealRole,
        pathOptions: [],
        barriers: formData.barriers.filter(b => b.trim().length > 0),
        supporters: formData.supporters.filter(s => s.trim().length > 0),
        nextSteps: formData.nextSteps.filter(n => n.trim().length > 0),
        createdAt: new Date(),
      };
      onComplete(compass);
    }
  };

  const progress = (step / 7) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {step} of 7
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
        
        {/* Step 1: Current Situation */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Where are you now?
              </h2>
              <p className="text-gray-600">
                Tell us about your current professional situation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Role/Title
              </label>
              <input
                type="text"
                value={formData.currentRole}
                onChange={(e) => updateField('currentRole', e.target.value)}
                placeholder="e.g., Senior Product Manager"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Company (Optional)
              </label>
              <input
                type="text"
                value={formData.currentCompany}
                onChange={(e) => updateField('currentCompany', e.target.value)}
                placeholder="e.g., Tech Startup Inc."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Professional Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.yearsExperience}
                onChange={(e) => updateField('yearsExperience', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Career Dimensions */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Rate your current career satisfaction
              </h2>
              <p className="text-gray-600">
                Rate each dimension from 1 (very dissatisfied) to 10 (very satisfied)
              </p>
            </div>

            <div className="space-y-6">
              {CAREER_DIMENSIONS.map((dimension) => (
                <div key={dimension.key} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <label className="block text-sm font-bold text-gray-900">
                        {dimension.label}
                      </label>
                      <p className="text-xs text-gray-600">{dimension.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary-600 ml-4">
                      {formData.dimensions[dimension.key as keyof CareerDimensions]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.dimensions[dimension.key as keyof CareerDimensions]}
                    onChange={(e) => updateDimension(dimension.key as keyof CareerDimensions, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Strengths & Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your strengths and interests?
              </h2>
              <p className="text-gray-600">
                Identify what you're good at and what energizes you
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Key Strengths
              </label>
              <div className="space-y-3">
                {formData.strengths.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('strengths', index, e.target.value)}
                      placeholder={`Strength ${index + 1}`}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {formData.strengths.length > 1 && (
                      <button
                        onClick={() => removeItem('strengths', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('strengths')}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <Plus size={20} />
                  Add Strength
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Professional Interests
              </label>
              <div className="space-y-3">
                {formData.interests.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('interests', index, e.target.value)}
                      placeholder={`Interest ${index + 1}`}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {formData.interests.length > 1 && (
                      <button
                        onClick={() => removeItem('interests', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('interests')}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <Plus size={20} />
                  Add Interest
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Values */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What matters most to you in your career?
              </h2>
              <p className="text-gray-600">
                Identify your core career values and priorities
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Examples:</strong> Autonomy, Creativity, Financial Security, Helping Others, 
                Innovation, Leadership, Learning, Recognition, Stability, Work-Life Balance
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Your Career Values
              </label>
              <div className="space-y-3">
                {formData.values.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('values', index, e.target.value)}
                      placeholder={`Value ${index + 1}`}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {formData.values.length > 1 && (
                      <button
                        onClick={() => removeItem('values', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('values')}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <Plus size={20} />
                  Add Value
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Ideal Role */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's your ideal career direction?
              </h2>
              <p className="text-gray-600">
                Describe where you'd like to be in the next 3-5 years
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ideal Role or Career Direction
              </label>
              <textarea
                value={formData.idealRole}
                onChange={(e) => updateField('idealRole', e.target.value)}
                placeholder="Describe your ideal role, responsibilities, work environment, and impact..."
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-900 mb-2">Consider including:</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• The type of work you'd be doing</li>
                <li>• The impact you'd be making</li>
                <li>• Your level of responsibility</li>
                <li>• The work environment and culture</li>
                <li>• How it aligns with your values</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 6: Barriers & Support */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's helping or hindering you?
              </h2>
              <p className="text-gray-600">
                Identify barriers you face and support systems you have
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Barriers or Challenges
              </label>
              <div className="space-y-3">
                {formData.barriers.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('barriers', index, e.target.value)}
                      placeholder={`Barrier ${index + 1}`}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {formData.barriers.length > 1 && (
                      <button
                        onClick={() => removeItem('barriers', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('barriers')}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <Plus size={20} />
                  Add Barrier
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Supporters & Resources
              </label>
              <div className="space-y-3">
                {formData.supporters.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('supporters', index, e.target.value)}
                      placeholder={`Support ${index + 1}`}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {formData.supporters.length > 1 && (
                      <button
                        onClick={() => removeItem('supporters', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('supporters')}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <Plus size={20} />
                  Add Support
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Next Steps */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What are your next steps?
              </h2>
              <p className="text-gray-600">
                Define concrete actions to move toward your ideal career
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Action Steps
              </label>
              <div className="space-y-3">
                {formData.nextSteps.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem('nextSteps', index, e.target.value)}
                      placeholder={`Action ${index + 1}`}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {formData.nextSteps.length > 1 && (
                      <button
                        onClick={() => removeItem('nextSteps', index)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addItem('nextSteps')}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <Plus size={20} />
                  Add Action
                </button>
              </div>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 mb-2">Make them SMART:</p>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• <strong>Specific:</strong> Clear and well-defined</li>
                <li>• <strong>Measurable:</strong> Track your progress</li>
                <li>• <strong>Achievable:</strong> Realistic given your resources</li>
                <li>• <strong>Relevant:</strong> Aligned with your goals</li>
                <li>• <strong>Time-bound:</strong> With a deadline</li>
              </ul>
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
          onClick={step === 7 ? handleComplete : handleNext}
          disabled={!canProceed()}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            canProceed()
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === 7 ? 'Complete Compass' : 'Next'}
        </button>
      </div>
    </div>
  );
}
