'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveToolResultComplete } from '@/lib/activityLogger';
import { CheckCircle, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';

interface FeedbackItem {
  id: string;
  situation: string;
  feedback: string;
  feedforward: string;
  actionSteps: string[];
}

export default function FeedbackFeedForwardPage() {
  const { userProfile } = useAuth();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    situation: '',
    feedback: '',
    feedforward: '',
    actionSteps: ['', '', ''],
  });
  const [saved, setSaved] = useState(false);

  const addItem = () => {
    if (!currentItem.situation || !currentItem.feedback || !currentItem.feedforward) return;

    const item: FeedbackItem = {
      id: Date.now().toString(),
      ...currentItem,
      actionSteps: currentItem.actionSteps.filter(s => s.trim() !== ''),
    };

    setItems([...items, item]);
    setCurrentItem({
      situation: '',
      feedback: '',
      feedforward: '',
      actionSteps: ['', '', ''],
    });
  };

  const updateActionStep = (index: number, value: string) => {
    const newSteps = [...currentItem.actionSteps];
    newSteps[index] = value;
    setCurrentItem({ ...currentItem, actionSteps: newSteps });
  };

  const handleSave = async () => {
    if (!userProfile || items.length === 0) return;

    try {
      await saveToolResultComplete(
        userProfile,
        'feedback-feedforward',
        'Feedback Feed-Forward',
        'Communication',
        { items }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving feedback planner:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Feed-Forward Planner</h1>
          <p className="text-gray-600">
            Transform feedback into actionable future-focused strategies
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Feed-Forward vs Feedback</h3>
              <p className="text-sm text-blue-800">
                <strong>Feedback</strong> focuses on the past. <strong>Feed-forward</strong> focuses on future possibilities.
                Instead of "You should have...", try "Next time you could..."
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Item</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Situation or Behavior
              </label>
              <input
                type="text"
                value={currentItem.situation}
                onChange={(e) => setCurrentItem({ ...currentItem, situation: e.target.value })}
                placeholder="Describe the situation you want to address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeft className="text-orange-600" size={20} />
                  <label className="font-bold text-orange-900">Feedback (Past)</label>
                </div>
                <textarea
                  value={currentItem.feedback}
                  onChange={(e) => setCurrentItem({ ...currentItem, feedback: e.target.value })}
                  placeholder="What happened? What was observed?"
                  rows={4}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                />
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="text-green-600" size={20} />
                  <label className="font-bold text-green-900">Feed-Forward (Future)</label>
                </div>
                <textarea
                  value={currentItem.feedforward}
                  onChange={(e) => setCurrentItem({ ...currentItem, feedforward: e.target.value })}
                  placeholder="What could you do differently next time?"
                  rows={4}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Steps (Optional)
              </label>
              {currentItem.actionSteps.map((step, index) => (
                <input
                  key={index}
                  type="text"
                  value={step}
                  onChange={(e) => updateActionStep(index, e.target.value)}
                  placeholder={`Action step ${index + 1}`}
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ))}
            </div>
          </div>

          <button
            onClick={addItem}
            disabled={!currentItem.situation || !currentItem.feedback || !currentItem.feedforward}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>

        {/* Saved Items */}
        {items.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{item.situation}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowLeft className="text-orange-600" size={16} />
                        <span className="font-bold text-orange-900 text-sm">Feedback</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.feedback}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="text-green-600" size={16} />
                        <span className="font-bold text-green-900 text-sm">Feed-Forward</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.feedforward}</p>
                    </div>
                  </div>

                  {item.actionSteps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="font-medium text-gray-900 text-sm mb-2">Action Steps:</p>
                      <ul className="space-y-1">
                        {item.actionSteps.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-primary-600">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
              >
                {saved && <CheckCircle size={20} />}
                {saved ? 'Saved!' : 'Save Planner'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
