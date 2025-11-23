'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, query, where, getDocs, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COACHING_TOOLS, getToolDisplayName } from '@/data/tools';
import { CheckCircle } from 'lucide-react';

export default function AssignToolsPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const clientId = params?.id as string;

  const [client, setClient] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [instructions, setInstructions] = useState('');
  const [assignedTools, setAssignedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clientId) {
      loadClient();
      loadAssignedTools();
    }
  }, [clientId]);

  const loadClient = async () => {
    try {
      const docRef = doc(db, 'users', clientId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setClient({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error loading client:', error);
    }
  };

  const loadAssignedTools = async () => {
    if (!userProfile?.uid) return;

    try {
      const q = query(
        collection(db, 'tool_assignments'),
        where('coachId', '==', userProfile.uid),
        where('coacheeId', '==', clientId)
      );

      const snapshot = await getDocs(q);
      const tools = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAssignedTools(tools);
    } catch (error) {
      console.error('Error loading assigned tools:', error);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.uid || !selectedTool) return;

    setLoading(true);

    try {
      await addDoc(collection(db, 'tool_assignments'), {
        coachId: userProfile.uid,
        coacheeId: clientId,
        coacheeName: client?.displayName || client?.email,
        toolId: selectedTool,
        toolName: getToolDisplayName(selectedTool),
        instructions: instructions || '',
        dueDate: dueDate || null,
        status: 'assigned',
        createdAt: serverTimestamp(),
      });

      alert('Tool assigned successfully!');
      setSelectedTool('');
      setInstructions('');
      setDueDate('');
      loadAssignedTools();
    } catch (error) {
      console.error('Error assigning tool:', error);
      alert('Failed to assign tool');
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push(`/coach/clients/${clientId}`)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Client
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assign Tools to {client.displayName || client.email}
          </h1>
          <p className="text-gray-600">Select tools for your client to complete</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assign Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleAssign} className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Assign New Tool</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Tool *
                  </label>
                  <select
                    required
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choose a tool...</option>
                    {COACHING_TOOLS.map((tool) => (
                      <option key={tool.id} value={tool.id}>
                        {tool.name} - {tool.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={4}
                    placeholder="Add any specific instructions or context for this tool..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedTool}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Assigning...' : 'Assign Tool'}
                </button>
              </div>
            </form>
          </div>

          {/* Already Assigned */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Already Assigned ({assignedTools.length})
              </h3>

              {assignedTools.length === 0 ? (
                <p className="text-gray-500 text-sm">No tools assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {assignedTools.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {assignment.toolName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {assignment.status === 'completed' ? 'Completed' : 'Assigned'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
