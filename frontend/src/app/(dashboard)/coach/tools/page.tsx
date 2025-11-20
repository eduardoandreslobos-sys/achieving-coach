'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Wrench, Users, TrendingUp, Target, Brain, Smile } from 'lucide-react';

interface Client {
  uid: string;
  displayName: string;
  email: string;
}

const availableTools = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    description: 'Assess balance across 8 key life areas',
    icon: Target,
    category: 'Assessment',
    color: 'blue',
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification',
    description: 'Identify and prioritize core values',
    icon: Brain,
    category: 'Self-Discovery',
    color: 'purple',
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs',
    description: 'Identify and challenge limiting beliefs',
    icon: TrendingUp,
    category: 'Mindset',
    color: 'orange',
  },
  {
    id: 'habit-loop',
    name: 'Habit Loop',
    description: 'Build positive habits using cue-routine-reward',
    icon: Smile,
    category: 'Behavior Change',
    color: 'green',
  },
  {
    id: 'career-compass',
    name: 'Career Compass',
    description: 'Navigate career direction and goals',
    icon: Target,
    category: 'Career',
    color: 'indigo',
  },
  {
    id: 'resilience-scale',
    name: 'Resilience Scale',
    description: 'Measure and build resilience',
    icon: TrendingUp,
    category: 'Wellbeing',
    color: 'pink',
  },
];

export default function CoachToolsPage() {
  const { userProfile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [showClientSelect, setShowClientSelect] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      if (!userProfile?.uid) return;

      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'coachee'),
          where('coacheeInfo.coachId', '==', userProfile.uid)
        );
        
        const snapshot = await getDocs(q);
        const clientsData = snapshot.docs.map(doc => ({
          uid: doc.id,
          displayName: doc.data().displayName,
          email: doc.data().email,
        })) as Client[];
        
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [userProfile]);

  const handleAssignClick = (toolId: string) => {
    setSelectedTool(toolId);
    setShowClientSelect(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coaching Tools</h1>
          <p className="text-gray-600">Browse and assign tools to your clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <div key={tool.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[tool.color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
                  <Icon size={24} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {tool.category}
                  </span>
                  
                  {clients.length > 0 ? (
                    <button
                      onClick={() => handleAssignClick(tool.id)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Assign →
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">No clients</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {clients.length === 0 && (
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
            <Users className="mx-auto text-yellow-600 mb-3" size={48} />
            <h3 className="text-lg font-bold text-yellow-900 mb-2">No clients yet</h3>
            <p className="text-yellow-800 mb-4">Invite coachees to start assigning tools</p>
            <Link
              href="/coach/invite"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Invite Coachees
            </Link>
          </div>
        )}
      </div>

      {/* Modal para seleccionar cliente */}
      {showClientSelect && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Client</h2>
            <p className="text-gray-600 mb-6">Choose which client to assign this tool to:</p>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {clients.map((client) => (
                <Link
                  key={client.uid}
                  href={`/coach/clients/${client.uid}/assign-tools?tool=${selectedTool}`}
                  className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{client.displayName}</p>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </Link>
              ))}
            </div>

            <button
              onClick={() => {
                setShowClientSelect(false);
                setSelectedTool(null);
              }}
              className="w-full mt-4 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
