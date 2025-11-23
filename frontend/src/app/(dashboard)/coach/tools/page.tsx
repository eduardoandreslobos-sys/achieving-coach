'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Target, Brain, TrendingUp, Smile, Compass, Shield, Users, MessageSquare, Heart, X } from 'lucide-react';

const tools = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    description: 'Assess balance across 8 key life areas',
    category: 'Assessment',
    icon: Target,
    color: 'bg-blue-600',
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification',
    description: 'Identify and prioritize core values',
    category: 'Self-Discovery',
    icon: Brain,
    color: 'bg-purple-600',
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs',
    description: 'Identify and challenge limiting beliefs',
    category: 'Mindset',
    icon: TrendingUp,
    color: 'bg-orange-600',
  },
  {
    id: 'habit-loop',
    name: 'Habit Loop',
    description: 'Build positive habits using cue-routine-reward',
    category: 'Behavior Change',
    icon: Smile,
    color: 'bg-green-600',
  },
  {
    id: 'career-compass',
    name: 'Career Compass',
    description: 'Navigate career direction and goals',
    category: 'Career',
    icon: Compass,
    color: 'bg-indigo-600',
  },
  {
    id: 'resilience-scale',
    name: 'Resilience Scale',
    description: 'Measure and build resilience',
    category: 'Wellbeing',
    icon: Shield,
    color: 'bg-pink-600',
  },
  {
    id: 'stakeholder-map',
    name: 'Stakeholder Map',
    description: 'Identify and analyze key stakeholders',
    category: 'Relationships',
    icon: Users,
    color: 'bg-teal-600',
  },
  {
    id: 'feedback-feedforward',
    name: 'Feedback Feed-Forward',
    description: 'Transform feedback into future-focused strategies',
    category: 'Communication',
    icon: MessageSquare,
    color: 'bg-cyan-600',
  },
  {
    id: 'emotional-triggers',
    name: 'Emotional Triggers Journal',
    description: 'Identify patterns and develop healthier responses',
    category: 'Self-Awareness',
    icon: Heart,
    color: 'bg-rose-600',
  },
];

interface Client {
  id: string;
  name: string;
}

export default function CoachToolsPage() {
  const { userProfile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [previewTool, setPreviewTool] = useState<typeof tools[0] | null>(null);

  useEffect(() => {
    if (userProfile?.uid) {
      loadClients();
    }
  }, [userProfile]);

  const loadClients = async () => {
    if (!userProfile?.uid) return;

    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'coachee'),
        where('coacheeInfo.coachId', '==', userProfile.uid)
      );

      const snapshot = await getDocs(q);
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName || doc.data().email || 'Unknown',
      }));

      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coaching Tools</h1>
          <p className="text-gray-600">Browse and assign tools to your clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  <button
                    onClick={() => setPreviewTool(tool)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {clients.length === 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
            <Users className="mx-auto text-yellow-600 mb-4" size={48} />
            <h3 className="text-lg font-bold text-yellow-900 mb-2">No clients yet</h3>
            <p className="text-yellow-800 mb-4">
              Invite coachees to start assigning tools
            </p>
            <Link
              href="/coach/invite"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Invite Coachees
            </Link>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${previewTool.color} rounded-lg flex items-center justify-center`}>
                  {(() => {
                    const Icon = previewTool.icon;
                    return <Icon className="text-white" size={24} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{previewTool.name}</h2>
                  <p className="text-sm text-gray-600">{previewTool.category}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTool(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{previewTool.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">How it works</h3>
                <p className="text-gray-700 mb-3">
                  {previewTool.id === 'wheel-of-life' && 'Clients rate 8 key life areas (Career, Health, Relationships, etc.) on a scale of 1-10. The results create a visual wheel showing balance across life domains.'}
                  {previewTool.id === 'values-clarification' && 'Clients identify and rank their top values from a comprehensive list. This helps them understand what truly matters and make aligned decisions.'}
                  {previewTool.id === 'limiting-beliefs' && 'Clients identify beliefs holding them back, challenge their validity with evidence, and create empowering alternatives.'}
                  {previewTool.id === 'habit-loop' && 'Based on James Clear\'s Atomic Habits, clients design habits using the cue-routine-reward framework for lasting behavior change.'}
                  {previewTool.id === 'career-compass' && 'Clients explore career direction, skills, interests, and goals to create a clear professional development path.'}
                  {previewTool.id === 'resilience-scale' && 'Assess resilience across multiple dimensions and identify areas for building mental and emotional strength.'}
                  {previewTool.id === 'stakeholder-map' && 'Map key stakeholders by influence and support level to develop targeted engagement strategies for projects or goals.'}
                  {previewTool.id === 'feedback-feedforward' && 'Transform past feedback into future-focused action plans, shifting from "what went wrong" to "what to do differently next time."'}
                  {previewTool.id === 'emotional-triggers' && 'Track emotional triggers, physical sensations, thoughts, and responses to identify patterns and develop healthier reactions.'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Best used for</h3>
                <ul className="space-y-1 text-gray-700">
                  {previewTool.id === 'wheel-of-life' && (
                    <>
                      <li>• Initial assessment sessions</li>
                      <li>• Identifying areas needing attention</li>
                      <li>• Tracking progress over time</li>
                    </>
                  )}
                  {previewTool.id === 'values-clarification' && (
                    <>
                      <li>• Decision-making challenges</li>
                      <li>• Career transitions</li>
                      <li>• Alignment and authenticity work</li>
                    </>
                  )}
                  {previewTool.id === 'limiting-beliefs' && (
                    <>
                      <li>• Overcoming self-doubt</li>
                      <li>• Breaking through plateaus</li>
                      <li>• Mindset shifts</li>
                    </>
                  )}
                  {previewTool.id === 'habit-loop' && (
                    <>
                      <li>• Building new positive habits</li>
                      <li>• Breaking unwanted patterns</li>
                      <li>• Sustainable behavior change</li>
                    </>
                  )}
                  {previewTool.id === 'career-compass' && (
                    <>
                      <li>• Career exploration</li>
                      <li>• Professional development planning</li>
                      <li>• Skill gap analysis</li>
                    </>
                  )}
                  {previewTool.id === 'resilience-scale' && (
                    <>
                      <li>• Stress management</li>
                      <li>• Building mental toughness</li>
                      <li>• Recovery from setbacks</li>
                    </>
                  )}
                  {previewTool.id === 'stakeholder-map' && (
                    <>
                      <li>• Project planning</li>
                      <li>• Organizational change</li>
                      <li>• Influence strategy</li>
                    </>
                  )}
                  {previewTool.id === 'feedback-feedforward' && (
                    <>
                      <li>• Performance improvement</li>
                      <li>• Learning from mistakes</li>
                      <li>• Communication development</li>
                    </>
                  )}
                  {previewTool.id === 'emotional-triggers' && (
                    <>
                      <li>• Emotional intelligence</li>
                      <li>• Self-awareness building</li>
                      <li>• Stress response management</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/tools/${previewTool.id}`}
                  target="_blank"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-center"
                >
                  Try it yourself
                </Link>
                <button
                  onClick={() => setPreviewTool(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
