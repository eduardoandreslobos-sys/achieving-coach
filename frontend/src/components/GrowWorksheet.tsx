'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Save, CheckCircle, Target, Eye, Lightbulb, Zap } from 'lucide-react';

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
    if (sessionId) {
      loadSession(sessionId);
    } else {
      createNewSession();
    }
  }, [sessionId]);

  const loadSession = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/grow-sessions/${id}`);
      const data = await response.json();
      if (data.success) {
        setSession(data.data);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const createNewSession = async () => {
    const newSession: GrowSession = {
      id: `temp-${Date.now()}`,
      coacheeId,
      coachId,
      sessionDate: new Date(),
      status: 'draft',
      goal: { description: '', specificGoal: '', measurableOutcome: '', achievableSteps: [''], relevance: '', timeframe: '', priority: 'medium' },
      reality: { currentSituation: '', obstacles: [''], resources: [''], skillsAvailable: [''], supportSystems: [''], previousAttempts: '', emotionalState: '' },
      options: { brainstormedOptions: [''], prosAndCons: [], selectedOptions: [], alternativePaths: [''] },
      will: { commitmentLevel: 5, actionSteps: [{ step: '', deadline: new Date(), responsible: '', completed: false }], potentialObstacles: [''], supportNeeded: [''], successMetrics: [''], followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), accountabilityPartner: '' },
      notes: '',
    };
    setSession(newSession);
  };

  const handleSave = async () => {
    if (!session) return;
    setIsSaving(true);
    try {
      const url = session.id.startsWith('temp-') ? '/api/v1/grow-sessions' : `/api/v1/grow-sessions/${session.id}`;
      const method = session.id.startsWith('temp-') ? 'POST' : 'PATCH';
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(session) });
      const data = await response.json();
      if (data.success) {
        setSession(data.data);
        onSave?.(data.data);
      }
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!session) return;
    try {
      const response = await fetch(`/api/v1/grow-sessions/${session.id}/complete`, { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setSession(data.data);
        onComplete?.(data.data);
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const updateField = (step: string, field: string, value: any) => {
    if (!session) return;
    setSession({ ...session, [step]: { ...session[step], [field]: value } });
  };

  const addArrayItem = (step: string, field: string) => {
    if (!session) return;
    const currentArray = session[step][field] || [];
    updateField(step, field, [...currentArray, '']);
  };

  const updateArrayItem = (step: string, field: string, index: number, value: any) => {
    if (!session) return;
    const currentArray = session[step][field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateField(step, field, newArray);
  };

  const removeArrayItem = (step: string, field: string, index: number) => {
    if (!session) return;
    const currentArray = session[step][field] || [];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    updateField(step, field, newArray);
  };

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GROW Model Worksheet</h1>
        <p className="text-gray-600">A structured framework for goal setting and problem solving</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <button onClick={() => setCurrentStep(index)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${isActive ? `${step.color} text-white scale-110` : ''} ${isCompleted ? 'bg-gray-300 text-gray-600' : ''} ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-400' : ''} hover:scale-105`}>
                    <Icon className="w-6 h-6" />
                  </button>
                  <span className={`mt-2 text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{step.name}</span>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-gray-300' : 'bg-gray-200'}`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        {currentStep === 0 && <GoalStep session={session} updateField={updateField} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />}
        {currentStep === 1 && <RealityStep session={session} updateField={updateField} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />}
        {currentStep === 2 && <OptionsStep session={session} updateField={updateField} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />}
        {currentStep === 3 && <WillStep session={session} updateField={updateField} addArrayItem={addArrayItem} updateArrayItem={updateArrayItem} removeArrayItem={removeArrayItem} />}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-5 h-5" />Previous
        </button>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
            <Save className="w-5 h-5" />{isSaving ? 'Saving...' : 'Save Progress'}
          </button>
          {currentStep === steps.length - 1 && (
            <button onClick={handleComplete} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <CheckCircle className="w-5 h-5" />Complete Session
            </button>
          )}
        </div>
        <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1} className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next<ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function GoalStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 GOAL - What do you want to achieve?</h2>
        <p className="text-gray-600 mb-6">Define your goal using the SMART framework</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Goal Description</label>
        <textarea value={session.goal.description} onChange={(e) => updateField('goal', 'description', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Describe your goal in detail..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Specific Goal</label>
          <input type="text" value={session.goal.specificGoal} onChange={(e) => updateField('goal', 'specificGoal', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="What exactly do you want to accomplish?" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Measurable Outcome</label>
          <input type="text" value={session.goal.measurableOutcome} onChange={(e) => updateField('goal', 'measurableOutcome', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="How will you measure success?" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Achievable Steps</label>
        {session.goal.achievableSteps.map((step: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="text" value={step} onChange={(e) => updateArrayItem('goal', 'achievableSteps', index, e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder={`Step ${index + 1}`} />
            <button onClick={() => removeArrayItem('goal', 'achievableSteps', index)} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Remove</button>
          </div>
        ))}
        <button onClick={() => addArrayItem('goal', 'achievableSteps')} className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">+ Add Step</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
          <input type="text" value={session.goal.timeframe} onChange={(e) => updateField('goal', 'timeframe', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="When do you want to achieve this?" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select value={session.goal.priority} onChange={(e) => updateField('goal', 'priority', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Why is this goal relevant to you?</label>
        <textarea value={session.goal.relevance} onChange={(e) => updateField('goal', 'relevance', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Explain why this goal matters..." />
      </div>
    </div>
  );
}

function RealityStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">👁️ REALITY - Where are you now?</h2>
        <p className="text-gray-600 mb-6">Assess your current situation objectively</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Situation</label>
        <textarea value={session.reality.currentSituation} onChange={(e) => updateField('reality', 'currentSituation', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" rows={4} placeholder="Describe where you are right now in relation to your goal..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Obstacles</label>
        {session.reality.obstacles.map((obstacle: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="text" value={obstacle} onChange={(e) => updateArrayItem('reality', 'obstacles', index, e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="What's standing in your way?" />
            <button onClick={() => removeArrayItem('reality', 'obstacles', index)} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Remove</button>
          </div>
        ))}
        <button onClick={() => addArrayItem('reality', 'obstacles')} className="mt-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">+ Add Obstacle</button>
      </div>
    </div>
  );
}

function OptionsStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">💡 OPTIONS - What could you do?</h2>
        <p className="text-gray-600 mb-6">Brainstorm all possible paths forward</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Brainstormed Options</label>
        {session.options.brainstormedOptions.map((option: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <input type="text" value={option} onChange={(e) => updateArrayItem('options', 'brainstormedOptions', index, e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500" placeholder={`Option ${index + 1}`} />
            <button onClick={() => removeArrayItem('options', 'brainstormedOptions', index)} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">Remove</button>
          </div>
        ))}
        <button onClick={() => addArrayItem('options', 'brainstormedOptions')} className="mt-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200">+ Add Option</button>
      </div>
    </div>
  );
}

function WillStep({ session, updateField, addArrayItem, updateArrayItem, removeArrayItem }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ WILL - What will you do?</h2>
        <p className="text-gray-600 mb-6">Commit to specific actions and next steps</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Commitment Level (1-10)</label>
        <div className="flex items-center gap-4">
          <input type="range" min="1" max="10" value={session.will.commitmentLevel} onChange={(e) => updateField('will', 'commitmentLevel', parseInt(e.target.value))} className="flex-1" />
          <span className="text-2xl font-bold text-purple-600 w-12 text-center">{session.will.commitmentLevel}</span>
        </div>
      </div>
    </div>
  );
}
