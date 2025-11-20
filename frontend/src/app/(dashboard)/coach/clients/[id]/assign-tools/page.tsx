'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { AVAILABLE_TOOLS } from '@/types/toolAssignment';
import { ArrowLeft, CheckCircle, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AssignToolsPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const clientId = params?.id as string;

  const [client, setClient] = useState<any>(null);
  const [assignedTools, setAssignedTools] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientDoc = await getDoc(doc(db, 'users', clientId));
        if (clientDoc.exists()) {
          setClient({ uid: clientDoc.id, ...clientDoc.data() });
        }

        const assignmentsQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', clientId),
          where('coachId', '==', userProfile?.uid)
        );
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        const toolIds = assignmentsSnapshot.docs.map(doc => doc.data().toolId);
        setAssignedTools(toolIds);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile && clientId) {
      fetchData();
    }
  }, [userProfile, clientId]);

  const handleAssignTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool || !userProfile) return;

    setSubmitting(true);
    try {
      const tool = AVAILABLE_TOOLS.find(t => t.id === selectedTool);
      if (!tool) return;

      await addDoc(collection(db, 'tool_assignments'), {
        coachId: userProfile.uid,
        coacheeId: clientId,
        toolId: tool.id,
        toolName: tool.name,
        toolSlug: tool.slug,
        assignedAt: serverTimestamp(),
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'assigned',
        notes: notes || null,
      });

      setAssignedTools([...assignedTools, tool.id]);
      setSelectedTool('');
      setDueDate('');
      setNotes('');
      alert('Tool assigned successfully!');
    } catch (error) {
      console.error('Error assigning tool:', error);
      alert('Failed to assign tool');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const availableToAssign = AVAILABLE_TOOLS.filter(tool => !assignedTools.includes(tool.id));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href={`/coach/clients/${clientId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Client
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assign Tools to {client?.displayName}
          </h1>
          <p className="text-gray-600">
            Select tools for your client to complete
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleAssignTool} className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Assign New Tool</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Tool *
                  </label>
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Choose a tool...</option>
                    {availableToAssign.map(tool => (
                      <option key={tool.id} value={tool.id}>
                        {tool.name} - {tool.category}
                      </option>
                    ))}
                  </select>
                  {selectedTool && (
                    <p className="text-sm text-gray-600 mt-2">
                      {AVAILABLE_TOOLS.find(t => t.id === selectedTool)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes for Client (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add any instructions or context..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedTool}
                className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Assigning...' : 'Assign Tool'}
              </button>
            </form>

            {availableToAssign.length === 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                <CheckCircle className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="text-blue-900 font-medium">All tools have been assigned!</p>
                <p className="text-blue-700 text-sm mt-1">Your client has access to all available tools</p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Already Assigned ({assignedTools.length})</h3>
              {assignedTools.length === 0 ? (
                <p className="text-sm text-gray-600">No tools assigned yet</p>
              ) : (
                <ul className="space-y-2">
                  {assignedTools.map(toolId => {
                    const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
                    return (
                      <li key={toolId} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                        <span className="text-gray-700">{tool?.name}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
