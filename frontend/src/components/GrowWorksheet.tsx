'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Target, Eye, Lightbulb, Zap, Plus, Trash2 } from 'lucide-react';

interface GrowSession {
  id: string;
  coacheeId: string;
  coachId: string;
  sessionDate: Date;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  goal: any;
  reality: any;
  options: any;
  will: any;
  notes: string;
}

interface GrowWorksheetProps {
  sessionId?: string;
  coacheeId: string;
  coachId: string;
  onSave?: (session: GrowSession) => void;
  onComplete?: (session: GrowSession) => void;
}

export default function GrowWorksheet({ sessionId, coacheeId, coachId, onSave, onComplete }: GrowWorksheetProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [session, setSession] = useState<GrowSession | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const steps = [
    { id: 'goal', name: 'Goal', icon: Target, color: 'bg-blue-500' },
    { id: 'reality', name: 'Reality', icon: Eye, color: 'bg-green-500' },
    { id: 'options', name: 'Options', icon: Lightbulb, color: 'bg-yellow-500' },
    { id: 'will', name: 'Will', icon: Zap, color: 'bg-purple-500' },
  ];

  useEffect(() => {
    createNewSession();
  }, []);

  const createNewSession = () => {
    const newSession: GrowSession = {
      id: `session-${Date.now()}`,
      coacheeId,
      coachId,
      sessionDate: new Date(),
      status: 'draft',
      goal: {
        description: '',
        specificGoal: '',
        measurableOutcome: '',
        achievableSteps: [''],
        relevance: '',
        timeframe: '',
        priority: 'medium',
      },
      reality: {
        currentSituation: '',
        obstacles: [''],
        resources: [''],
        skillsAvailable: [''],
        supportSystems: [''],
        previousAttempts: '',
        emotionalState: '',
      },
      options: {
        brainstormedOptions: [''],
        prosAndCons: [],
        selectedOptions: [],
        alternativePaths: [''],
      },
      will: {
        commitmentLevel: 5,
        actionSteps: [{ step: '', deadline: '', responsible: '', completed: false }],
        potentialObstacles: [''],
        supportNeeded: [''],
        successMetrics: [''],
        followUpDate: '',
        accountabilityPartner: '',
      },
      notes: '',
    };
    setSession(newSession);
  };

  const handleSave = () => {
    if (!session) return;
    setIsSaving(true);
    setTimeout(() => {
      console.log('Session saved (mock):', session);
      onSave?.(session);
      setIsSaving(false);
      alert('Session saved successfully! (Demo mode - not saved to database yet)');
    }, 500);
  };

  const handleComplete = () => {
    if (!session) return;
    const completedSession = { ...session, status: 'completed' as const };
    console.log('Session completed (mock):', completedSession);
    setSession(completedSession);
    onComplete?.(completedSession);
    alert('Session completed! (Demo mode - not saved to database yet)');
  };

  const updateField = (step: keyof Pick<GrowSession, 'goal' | 'reality' | 'options' | 'will'>, field: string, value: any) => {
    if (!session) return;
    setSession({ ...session, [step]: { ...session[step], [field]: value } });
  };

  const addArrayItem = (step: keyof Pick<GrowSession, 'goal' | 'reality' | 'options' | 'will'>, field: string, defaultValue: any = '') => {
    if (!session) return;
    const currentArray = session[step][field] || [];
    updateField(step, field, [...currentArray, defaultValue]);
  };

  const updateArrayItem = (step: keyof Pick<GrowSession, 'goal' | 'reality' | 'options' | 'will'>, field: string, index: number, value: any) => {
    if (!session) return;
    const currentArray = session[step][field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateField(step, field, newArray);
  };

  const removeArrayItem = (step: keyof Pick<GrowSession, 'goal' | 'reality' | 'options' | 'will'>, field: string, index: number) => {
    if (!session) return;
    const currentArray = session[step][field] || [];
    if (currentArray.length <= 1) return;
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    updateField(step, field, newArray);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GROW Model Worksheet</h1>
        <p className="text-gray-600">A structured framework for goal setting and problem solving</p>
        <p className="text-sm text-yellow-600 mt-2">⚠️ Demo Mode - Changes are not persisted to database</p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive ? `${step.color} text-white scale-110` : ''
                    } ${isCompleted ? 'bg-gray-300 text-gray-600' : ''} ${
                      !isActive && !isCompleted ? 'bg-gray-200 text-gray-400' : ''
                    } hover:scale-105`}
                  >
                    <Icon className="w-6 h-6" />
                  </button>
                  <span className={`mt-2 text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-gray-300' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        {currentStep === 0 && (
          <GoalStep
            session={session}
            updateField={updateField}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )}
        {currentStep === 1 && (
          <RealityStep
            session={session}
            updateField={updateField}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )}
        {currentStep === 2 && (
          <OptionsStep
            session={session}
            updateField={updateField}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )}
        {currentStep === 3 && (
          <WillStep
            session={session}
            updateField={updateField}
            addArrayItem={addArrayItem}
            updateArrayItem={updateArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
          {currentStep === steps.length - 1 && (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Session
            </button>
          )}
        </div>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// GOAL STEP - Complete version
function GoalStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 GOAL - What do you want to achieve?</h2>
        <p className="text-gray-600 mb-6">Define your goal using the SMART framework</p>
      </div>

      {/* Goal Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Goal Description *</label>
        <textarea
          value={session.goal.description}
          onChange={(e) => updateField('goal', 'description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Describe your goal in detail..."
        />
      </div>

      {/* Specific Goal & Measurable Outcome */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Goal</label>
          <input
            type="text"
            value={session.goal.specificGoal}
            onChange={(e) => updateField('goal', 'specificGoal', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="What exactly do you want to accomplish?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Measurable Outcome</label>
          <input
            type="text"
            value={session.goal.measurableOutcome}
            onChange={(e) => updateField('goal', 'measurableOutcome', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="How will you measure success?"
          />
        </div>
      </div>

      {/* Achievable Steps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Achievable Steps</label>
          <button
            onClick={() => addArrayItem('goal', 'achievableSteps', '')}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>
        {session.goal.achievableSteps.map((step: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <span className="flex items-center justify-center w-8 h-10 text-sm font-medium text-gray-500">
              {index + 1}.
            </span>
            <input
              type="text"
              value={step}
              onChange={(e) => updateArrayItem('goal', 'achievableSteps', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={`Step ${index + 1}`}
            />
            {session.goal.achievableSteps.length > 1 && (
              <button
                onClick={() => removeArrayItem('goal', 'achievableSteps', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Timeframe, Priority, Relevance */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
          <input
            type="text"
            value={session.goal.timeframe}
            onChange={(e) => updateField('goal', 'timeframe', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="When do you want to achieve this? (e.g., 3 months, Q2 2025)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={session.goal.priority}
            onChange={(e) => updateField('goal', 'priority', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Relevance */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Why is this goal relevant to you?
        </label>
        <textarea
          value={session.goal.relevance}
          onChange={(e) => updateField('goal', 'relevance', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Explain why this goal matters and how it aligns with your broader objectives..."
        />
      </div>
    </div>
  );
}

// REALITY STEP - Complete version
function RealityStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">👁️ REALITY - Where are you now?</h2>
        <p className="text-gray-600 mb-6">Assess your current situation objectively</p>
      </div>

      {/* Current Situation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Situation *</label>
        <textarea
          value={session.reality.currentSituation}
          onChange={(e) => updateField('reality', 'currentSituation', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows={4}
          placeholder="Describe where you are right now in relation to your goal..."
        />
      </div>

      {/* Obstacles */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Current Obstacles</label>
          <button
            onClick={() => addArrayItem('reality', 'obstacles', '')}
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Obstacle
          </button>
        </div>
        {session.reality.obstacles.map((obstacle: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={obstacle}
              onChange={(e) => updateArrayItem('reality', 'obstacles', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="What's standing in your way?"
            />
            {session.reality.obstacles.length > 1 && (
              <button
                onClick={() => removeArrayItem('reality', 'obstacles', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Resources & Skills */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Available Resources</label>
            <button
              onClick={() => addArrayItem('reality', 'resources', '')}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {session.reality.resources.map((resource: string, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={resource}
                onChange={(e) => updateArrayItem('reality', 'resources', index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Resource..."
              />
              {session.reality.resources.length > 1 && (
                <button
                  onClick={() => removeArrayItem('reality', 'resources', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Skills Available</label>
            <button
              onClick={() => addArrayItem('reality', 'skillsAvailable', '')}
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {session.reality.skillsAvailable.map((skill: string, index: number) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateArrayItem('reality', 'skillsAvailable', index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Skill..."
              />
              {session.reality.skillsAvailable.length > 1 && (
                <button
                  onClick={() => removeArrayItem('reality', 'skillsAvailable', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Systems */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Support Systems</label>
          <button
            onClick={() => addArrayItem('reality', 'supportSystems', '')}
            className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
          >
            <Plus className="w-4 h-4" />
            Add Support
          </button>
        </div>
        {session.reality.supportSystems.map((support: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={support}
              onChange={(e) => updateArrayItem('reality', 'supportSystems', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Who can support you?"
            />
            {session.reality.supportSystems.length > 1 && (
              <button
                onClick={() => removeArrayItem('reality', 'supportSystems', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Previous Attempts & Emotional State */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Previous Attempts</label>
        <textarea
          value={session.reality.previousAttempts}
          onChange={(e) => updateField('reality', 'previousAttempts', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows={3}
          placeholder="What have you tried before? What worked or didn't work?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Emotional State</label>
        <textarea
          value={session.reality.emotionalState}
          onChange={(e) => updateField('reality', 'emotionalState', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          rows={2}
          placeholder="How do you feel about your current situation?"
        />
      </div>
    </div>
  );
}

// OPTIONS STEP - Complete version
function OptionsStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 OPTIONS - What could you do?</h2>
        <p className="text-gray-600 mb-6">Brainstorm all possible paths forward</p>
      </div>

      {/* Brainstormed Options */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Brainstormed Options</label>
          <button
            onClick={() => addArrayItem('options', 'brainstormedOptions', '')}
            className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
          >
            <Plus className="w-4 h-4" />
            Add Option
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">List all possible actions, even unconventional ones</p>
        {session.options.brainstormedOptions.map((option: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <span className="flex items-center justify-center w-8 h-10 text-sm font-medium text-gray-500">
              {index + 1}.
            </span>
            <input
              type="text"
              value={option}
              onChange={(e) => updateArrayItem('options', 'brainstormedOptions', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder={`Option ${index + 1}`}
            />
            {session.options.brainstormedOptions.length > 1 && (
              <button
                onClick={() => removeArrayItem('options', 'brainstormedOptions', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Alternative Paths */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Alternative Paths</label>
          <button
            onClick={() => addArrayItem('options', 'alternativePaths', '')}
            className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
          >
            <Plus className="w-4 h-4" />
            Add Path
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">Different approaches or strategies</p>
        {session.options.alternativePaths.map((path: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={path}
              onChange={(e) => updateArrayItem('options', 'alternativePaths', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              placeholder="Alternative approach..."
            />
            {session.options.alternativePaths.length > 1 && (
              <button
                onClick={() => removeArrayItem('options', 'alternativePaths', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">💡 Tips for generating options:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Think creatively - no idea is too wild at this stage</li>
          <li>Consider what others in your situation have done</li>
          <li>What would you advise a friend to do?</li>
          <li>What would you do if you had unlimited resources?</li>
          <li>What's the opposite of what you're currently doing?</li>
        </ul>
      </div>
    </div>
  );
}

// WILL STEP - Complete version
function WillStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ WILL - What will you do?</h2>
        <p className="text-gray-600 mb-6">Commit to specific actions and next steps</p>
      </div>

      {/* Commitment Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commitment Level (1-10) *
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            value={session.will.commitmentLevel}
            onChange={(e) => updateField('will', 'commitmentLevel', parseInt(e.target.value))}
            className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${
                (session.will.commitmentLevel / 10) * 100
              }%, rgb(229, 231, 235) ${(session.will.commitmentLevel / 10) * 100}%, rgb(229, 231, 235) 100%)`,
            }}
          />
          <span className="text-3xl font-bold text-purple-600 w-12 text-center">
            {session.will.commitmentLevel}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">How committed are you to taking action?</p>
      </div>

      {/* Action Steps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Action Steps *</label>
          <button
            onClick={() =>
              addArrayItem('will', 'actionSteps', { step: '', deadline: '', responsible: '', completed: false })
            }
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Action
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">Concrete actions you will take</p>

        {session.will.actionSteps.map((action: any, index: number) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
            <div className="flex items-start gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                {index + 1}
              </span>
              <input
                type="text"
                value={action.step}
                onChange={(e) => {
                  const newAction = { ...action, step: e.target.value };
                  updateArrayItem('will', 'actionSteps', index, newAction);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="What will you do?"
              />
              {session.will.actionSteps.length > 1 && (
                <button
                  onClick={() => removeArrayItem('will', 'actionSteps', index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 ml-8">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Deadline</label>
                <input
                  type="date"
                  value={action.deadline}
                  onChange={(e) => {
                    const newAction = { ...action, deadline: e.target.value };
                    updateArrayItem('will', 'actionSteps', index, newAction);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Responsible</label>
                <input
                  type="text"
                  value={action.responsible}
                  onChange={(e) => {
                    const newAction = { ...action, responsible: e.target.value };
                    updateArrayItem('will', 'actionSteps', index, newAction);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Who's responsible?"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Potential Obstacles */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Potential Obstacles</label>
          <button
            onClick={() => addArrayItem('will', 'potentialObstacles', '')}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Obstacle
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">What might prevent you from taking action?</p>
        {session.will.potentialObstacles.map((obstacle: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={obstacle}
              onChange={(e) => updateArrayItem('will', 'potentialObstacles', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Potential obstacle..."
            />
            {session.will.potentialObstacles.length > 1 && (
              <button
                onClick={() => removeArrayItem('will', 'potentialObstacles', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Support Needed */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Support Needed</label>
          <button
            onClick={() => addArrayItem('will', 'supportNeeded', '')}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Support
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">What help or resources do you need?</p>
        {session.will.supportNeeded.map((support: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={support}
              onChange={(e) => updateArrayItem('will', 'supportNeeded', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Support needed..."
            />
            {session.will.supportNeeded.length > 1 && (
              <button
                onClick={() => removeArrayItem('will', 'supportNeeded', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Success Metrics */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Success Metrics</label>
          <button
            onClick={() => addArrayItem('will', 'successMetrics', '')}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Metric
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-3">How will you know you've succeeded?</p>
        {session.will.successMetrics.map((metric: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={metric}
              onChange={(e) => updateArrayItem('will', 'successMetrics', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Success metric..."
            />
            {session.will.successMetrics.length > 1 && (
              <button
                onClick={() => removeArrayItem('will', 'successMetrics', index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Follow-up Date & Accountability Partner */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
          <input
            type="date"
            value={session.will.followUpDate}
            onChange={(e) => updateField('will', 'followUpDate', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Accountability Partner</label>
          <input
            type="text"
            value={session.will.accountabilityPartner}
            onChange={(e) => updateField('will', 'accountabilityPartner', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Who will hold you accountable?"
          />
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
        <h3 className="font-medium text-gray-900 mb-2">🎯 Final Check:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Are your action steps specific and concrete?</li>
          <li>Do you have realistic deadlines?</li>
          <li>Have you identified potential obstacles?</li>
          <li>Do you have the support you need?</li>
          <li>Is your commitment level high enough (aim for 7+)?</li>
        </ul>
      </div>
    </div>
  );
}
