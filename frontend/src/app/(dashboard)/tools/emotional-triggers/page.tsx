'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveToolResultComplete } from '@/lib/activityLogger';
import { CheckCircle, Heart, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

interface TriggerEntry {
  id: string;
  date: string;
  trigger: string;
  emotion: string;
  intensity: number; // 1-10
  physicalSensations: string;
  thoughts: string;
  response: string;
  alternativeResponse: string;
  pattern?: string;
}

const emotions = [
  'Anger', 'Anxiety', 'Fear', 'Sadness', 'Joy', 'Excitement',
  'Frustration', 'Guilt', 'Shame', 'Pride', 'Jealousy', 'Love'
];

export default function EmotionalTriggersPage() {
  const { userProfile } = useAuth();
  const [entries, setEntries] = useState<TriggerEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    trigger: '',
    emotion: '',
    intensity: 5,
    physicalSensations: '',
    thoughts: '',
    response: '',
    alternativeResponse: '',
  });
  const [saved, setSaved] = useState(false);

  const addEntry = () => {
    if (!currentEntry.trigger || !currentEntry.emotion) return;

    const entry: TriggerEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...currentEntry,
    };

    setEntries([entry, ...entries]);
    setCurrentEntry({
      trigger: '',
      emotion: '',
      intensity: 5,
      physicalSensations: '',
      thoughts: '',
      response: '',
      alternativeResponse: '',
    });
  };

  const handleSave = async () => {
    if (!userProfile || entries.length === 0) return;

    try {
      await saveToolResultComplete(
        userProfile,
        'emotional-triggers',
        'Emotional Triggers Journal',
        'Self-Awareness',
        { entries }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving triggers journal:', error);
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-100 border-green-300 text-green-800';
    if (intensity <= 6) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-red-100 border-red-300 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emotional Triggers Journal</h1>
          <p className="text-gray-600">
            Identify patterns and develop healthier responses to emotional triggers
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Heart className="text-purple-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-purple-900 mb-1">Understanding Triggers</h3>
              <p className="text-sm text-purple-800">
                Emotional triggers are situations, people, or events that provoke strong emotional reactions.
                By tracking them, you can identify patterns and develop conscious responses.
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Trigger Entry</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What triggered this emotion?
              </label>
              <input
                type="text"
                value={currentEntry.trigger}
                onChange={(e) => setCurrentEntry({ ...currentEntry, trigger: e.target.value })}
                placeholder="Describe the situation or event"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Emotion
                </label>
                <select
                  value={currentEntry.emotion}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, emotion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select emotion</option>
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intensity (1-10): {currentEntry.intensity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.intensity}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, intensity: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mild</span>
                  <span>Intense</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Physical Sensations
              </label>
              <input
                type="text"
                value={currentEntry.physicalSensations}
                onChange={(e) => setCurrentEntry({ ...currentEntry, physicalSensations: e.target.value })}
                placeholder="e.g., tight chest, racing heart, tension in shoulders"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Automatic Thoughts
              </label>
              <textarea
                value={currentEntry.thoughts}
                onChange={(e) => setCurrentEntry({ ...currentEntry, thoughts: e.target.value })}
                placeholder="What thoughts came up immediately?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How did you respond?
              </label>
              <textarea
                value={currentEntry.response}
                onChange={(e) => setCurrentEntry({ ...currentEntry, response: e.target.value })}
                placeholder="What did you do or say?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-green-900 mb-1 flex items-center gap-2">
                <Lightbulb size={16} />
                Alternative Response (Reflection)
              </label>
              <textarea
                value={currentEntry.alternativeResponse}
                onChange={(e) => setCurrentEntry({ ...currentEntry, alternativeResponse: e.target.value })}
                placeholder="How could you respond differently next time?"
                rows={3}
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />
            </div>
          </div>

          <button
            onClick={addEntry}
            disabled={!currentEntry.trigger || !currentEntry.emotion}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Entry
          </button>
        </div>

        {/* Entries List */}
        {entries.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getIntensityColor(entry.intensity)}`}>
                          {entry.emotion} - {entry.intensity}/10
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900">{entry.trigger}</h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {entry.physicalSensations && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Physical: </span>
                          <span className="text-sm text-gray-600">{entry.physicalSensations}</span>
                        </div>
                      </div>
                    )}

                    {entry.thoughts && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-700">Thoughts: </span>
                        <span className="text-sm text-gray-600">{entry.thoughts}</span>
                      </div>
                    )}

                    {entry.response && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-700">Response: </span>
                        <span className="text-sm text-gray-600">{entry.response}</span>
                      </div>
                    )}

                    {entry.alternativeResponse && (
                      <div className="bg-green-50 rounded-lg p-3 flex items-start gap-2">
                        <TrendingUp className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm font-medium text-green-900">Alternative: </span>
                          <span className="text-sm text-green-800">{entry.alternativeResponse}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
              >
                {saved && <CheckCircle size={20} />}
                {saved ? 'Saved!' : 'Save Journal'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
