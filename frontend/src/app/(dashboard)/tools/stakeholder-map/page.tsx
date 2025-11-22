'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveToolResult } from '@/lib/activityLogger';
import { CheckCircle, Users, Plus, Trash2 } from 'lucide-react';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: number; // 1-5
  support: number; // 1-5 (1=blocker, 5=champion)
  strategy: string;
}

export default function StakeholderMapPage() {
  const { userProfile } = useAuth();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    role: '',
    influence: 3,
    support: 3,
    strategy: '',
  });
  const [saved, setSaved] = useState(false);

  const addStakeholder = () => {
    if (!newStakeholder.name || !newStakeholder.role) return;

    const stakeholder: Stakeholder = {
      id: Date.now().toString(),
      ...newStakeholder,
    };

    setStakeholders([...stakeholders, stakeholder]);
    setNewStakeholder({
      name: '',
      role: '',
      influence: 3,
      support: 3,
      strategy: '',
    });
  };

  const removeStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (!userProfile || stakeholders.length === 0) return;

    try {
      await saveToolResult(
        userProfile.uid,
        userProfile.displayName || 'Unknown User',
        'stakeholder-map',
        'Stakeholder Map',
        'relationships',
        { stakeholders }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving stakeholder map:', error);
    }
  };

  const getQuadrant = (influence: number, support: number) => {
    if (influence >= 3 && support >= 3) return { label: 'Key Players', color: 'bg-green-100 border-green-300' };
    if (influence >= 3 && support < 3) return { label: 'Keep Satisfied', color: 'bg-yellow-100 border-yellow-300' };
    if (influence < 3 && support >= 3) return { label: 'Show Consideration', color: 'bg-blue-100 border-blue-300' };
    return { label: 'Monitor', color: 'bg-gray-100 border-gray-300' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stakeholder Map</h1>
          <p className="text-gray-600">
            Identify and analyze key stakeholders in your project or goal
          </p>
        </div>

        {/* Add New Stakeholder */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={24} />
            Add Stakeholder
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newStakeholder.name}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                placeholder="Stakeholder name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={newStakeholder.role}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
                placeholder="Their role or position"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Influence (1-5): {newStakeholder.influence}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newStakeholder.influence}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, influence: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support (1-5): {newStakeholder.support}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newStakeholder.support}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, support: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Blocker</span>
                <span>Champion</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Strategy</label>
              <textarea
                value={newStakeholder.strategy}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, strategy: e.target.value })}
                placeholder="How will you engage with this stakeholder?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <button
            onClick={addStakeholder}
            disabled={!newStakeholder.name || !newStakeholder.role}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Map
          </button>
        </div>

        {/* Stakeholder Grid */}
        {stakeholders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stakeholders.map((stakeholder) => {
                const quadrant = getQuadrant(stakeholder.influence, stakeholder.support);
                return (
                  <div
                    key={stakeholder.id}
                    className={`${quadrant.color} border-2 rounded-xl p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{stakeholder.name}</h3>
                        <p className="text-sm text-gray-600">{stakeholder.role}</p>
                      </div>
                      <button
                        onClick={() => removeStakeholder(stakeholder.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      {quadrant.label}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-600">Influence:</span>
                        <span className="ml-1 font-medium">{'⭐'.repeat(stakeholder.influence)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Support:</span>
                        <span className="ml-1 font-medium">{'❤️'.repeat(stakeholder.support)}</span>
                      </div>
                    </div>

                    {stakeholder.strategy && (
                      <p className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-300">
                        <strong>Strategy:</strong> {stakeholder.strategy}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
              >
                {saved && <CheckCircle size={20} />}
                {saved ? 'Saved!' : 'Save Map'}
              </button>
            </div>
          </>
        )}

        {stakeholders.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholders yet</h3>
            <p className="text-gray-600">Add stakeholders to start mapping your network</p>
          </div>
        )}
      </div>
    </div>
  );
}
