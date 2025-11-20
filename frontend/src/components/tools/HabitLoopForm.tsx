'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { HabitLoop } from '@/types/habit';

interface HabitLoopFormProps {
  onComplete: (habit: HabitLoop) => void;
}

export default function HabitLoopForm({ onComplete }: HabitLoopFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<HabitLoop>>({
    habitName: '',
    cue: '',
    routine: '',
    reward: '',
    frequency: 'daily',
    type: 'neutral',
  });

  const updateField = (field: keyof HabitLoop, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.habitName && formData.habitName.trim().length > 0;
      case 2:
        return formData.type && formData.frequency;
      case 3:
        return formData.cue && formData.cue.trim().length > 0;
      case 4:
        return formData.routine && formData.routine.trim().length > 0;
      case 5:
        return formData.reward && formData.reward.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5 && canProceed()) {
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
      const habit: HabitLoop = {
        id: Date.now().toString(),
        habitName: formData.habitName!,
        cue: formData.cue!,
        routine: formData.routine!,
        reward: formData.reward!,
        frequency: formData.frequency!,
        type: formData.type!,
        createdAt: new Date(),
      };
      onComplete(habit);
    }
  };

  const progress = (step / 5) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {step} of 5
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
        
        {/* Step 1: Habit Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What habit would you like to analyze?
              </h2>
              <p className="text-gray-600">
                Name the specific habit you want to understand better
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={formData.habitName}
                onChange={(e) => updateField('habitName', e.target.value)}
                placeholder="e.g., Checking social media, Morning coffee, Evening walk"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tip:</p>
                  <p>Be specific! Instead of "eating unhealthy," try "eating chips while watching TV at night"</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Type & Frequency */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about this habit
              </h2>
              <p className="text-gray-600">
                Is this a positive, negative, or neutral habit? How often does it occur?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Habit Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => updateField('type', 'positive')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    formData.type === 'positive'
                      ? 'bg-green-50 border-green-500 text-green-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
                  }`}
                >
                  ✅ Positive
                </button>
                <button
                  onClick={() => updateField('type', 'negative')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    formData.type === 'negative'
                      ? 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-red-400'
                  }`}
                >
                  ❌ Negative
                </button>
                <button
                  onClick={() => updateField('type', 'neutral')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    formData.type === 'neutral'
                      ? 'bg-gray-50 border-gray-500 text-gray-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  ⚪ Neutral
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How often does this happen?
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => updateField('frequency', 'daily')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    formData.frequency === 'daily'
                      ? 'bg-primary-50 border-primary-500 text-primary-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                  }`}
                >
                  📅 Daily
                </button>
                <button
                  onClick={() => updateField('frequency', 'weekly')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    formData.frequency === 'weekly'
                      ? 'bg-primary-50 border-primary-500 text-primary-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                  }`}
                >
                  📆 Weekly
                </button>
                <button
                  onClick={() => updateField('frequency', 'occasional')}
                  className={`p-4 rounded-lg border-2 font-medium transition-all ${
                    formData.frequency === 'occasional'
                      ? 'bg-primary-50 border-primary-500 text-primary-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-400'
                  }`}
                >
                  🔄 Occasional
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Cue */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What triggers this habit?
              </h2>
              <p className="text-gray-600">
                Identify the CUE - what happens right before you do this habit?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                The Cue (Trigger)
              </label>
              <textarea
                value={formData.cue}
                onChange={(e) => updateField('cue', e.target.value)}
                placeholder="Describe what triggers this habit..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-medium text-yellow-900 mb-2">Common cues include:</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• <strong>Time:</strong> "At 3pm every day" or "Right after dinner"</li>
                <li>• <strong>Location:</strong> "When I get home" or "In the car"</li>
                <li>• <strong>Emotion:</strong> "When I feel stressed" or "When I'm bored"</li>
                <li>• <strong>People:</strong> "When I'm with friends" or "When I'm alone"</li>
                <li>• <strong>Preceding action:</strong> "Right after opening my laptop"</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 4: Routine */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What exactly do you do?
              </h2>
              <p className="text-gray-600">
                Describe the ROUTINE - the actual behavior or action
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                The Routine (Behavior)
              </label>
              <textarea
                value={formData.routine}
                onChange={(e) => updateField('routine', e.target.value)}
                placeholder="Describe the specific actions you take..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>Be specific:</strong> Instead of "I procrastinate," try "I open social media, scroll for 10 minutes, then check news websites"
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Reward */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What do you get from it?
              </h2>
              <p className="text-gray-600">
                Identify the REWARD - what benefit or feeling does this provide?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                The Reward (Benefit)
              </label>
              <textarea
                value={formData.reward}
                onChange={(e) => updateField('reward', e.target.value)}
                placeholder="What do you gain from this habit? How does it make you feel?"
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-900 mb-2">Common rewards include:</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <strong>Emotional:</strong> Relief, excitement, satisfaction, comfort</li>
                <li>• <strong>Social:</strong> Connection, approval, belonging</li>
                <li>• <strong>Physical:</strong> Energy boost, reduced pain, pleasure</li>
                <li>• <strong>Mental:</strong> Distraction, entertainment, escape</li>
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
          onClick={step === 5 ? handleComplete : handleNext}
          disabled={!canProceed()}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            canProceed()
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === 5 ? 'Analyze Habit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
