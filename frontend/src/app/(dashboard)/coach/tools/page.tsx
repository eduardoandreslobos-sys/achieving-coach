'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { COACHING_TOOLS } from '@/data/tools';
import { Users, X, CheckCircle2 } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function CoachToolsPage() {
  const { userProfile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [previewTool, setPreviewTool] = useState<typeof COACHING_TOOLS[0] | null>(null);
  const [assignTool, setAssignTool] = useState<typeof COACHING_TOOLS[0] | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
        email: doc.data().email,
      }));
      
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleAssignTool = async () => {
    if (!selectedClient || !assignTool || !userProfile) return;

    setAssigning(true);
    try {
      // Create tool assignment
      await addDoc(collection(db, 'tool_assignments'), {
        coachId: userProfile.uid,
        coacheeId: selectedClient,
        toolId: assignTool.id,
        toolName: assignTool.name,
        assignedAt: serverTimestamp(),
        completed: false,
      });

      // Create notification for coachee
      const client = clients.find(c => c.id === selectedClient);
      await addDoc(collection(db, 'notifications'), {
        userId: selectedClient,
        type: 'program',
        title: 'New Tool Assigned',
        message: `${userProfile.displayName || userProfile.email || 'Your coach'} assigned you ${assignTool.name}`,
        read: false,
        createdAt: serverTimestamp(),
        actionUrl: `/tools/${assignTool.id}`,
      });

      // Show success
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAssignTool(null);
        setSelectedClient('');
      }, 2000);
    } catch (error) {
      console.error('Error assigning tool:', error);
      alert('Failed to assign tool. Please try again.');
    } finally {
      setAssigning(false);
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
          {COACHING_TOOLS.map((tool) => {
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
                <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewTool(tool)}
                    className="flex-1 px-4 py-2 text-primary-600 hover:bg-primary-50 border border-primary-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setAssignTool(tool)}
                    disabled={clients.length === 0}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Assign
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

      {/* Assign Modal */}
      {assignTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            {showSuccess ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tool Assigned!</h3>
                <p className="text-gray-600">The coachee has been notified</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${assignTool.color} rounded-lg flex items-center justify-center`}>
                      {(() => {
                        const Icon = assignTool.icon;
                        return <Icon className="text-white" size={20} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Assign Tool</h2>
                      <p className="text-sm text-gray-600">{assignTool.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAssignTool(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Select Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setAssignTool(null)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignTool}
                      disabled={!selectedClient || assigning}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {assigning ? 'Assigning...' : 'Assign Tool'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
