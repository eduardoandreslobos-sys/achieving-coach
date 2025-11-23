'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Target, Brain, TrendingUp, Smile, Compass, Shield, Users, MessageSquare, Heart } from 'lucide-react';

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
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

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

  const handleAssign = async () => {
    // TODO: Implement tool assignment logic
    console.log('Assigning tool:', selectedTool, 'to clients:', selectedClients);
    alert('Tool assignment feature coming soon!');
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
                    onClick={() => setSelectedTool(tool.id)}
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
    </div>
  );
}
