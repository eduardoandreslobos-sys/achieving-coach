'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { COACHING_TOOLS } from '@/data/tools';
import { CheckCircle2, Clock, Wrench } from 'lucide-react';

interface ToolAssignment {
  id: string;
  toolId: string;
  toolName: string;
  assignedAt: any;
  completed: boolean;
}

export default function CoacheeToolsPage() {
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState<ToolAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.uid) {
      loadAssignments();
    }
  }, [userProfile]);

  const loadAssignments = async () => {
    if (!userProfile?.uid) return;

    try {
      const q = query(
        collection(db, 'tool_assignments'),
        where('coacheeId', '==', userProfile.uid)
      );
      
      const snapshot = await getDocs(q);
      const assignmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ToolAssignment[];
      
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error loading tool assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your tools...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tools</h1>
          <p className="text-gray-600">
            Tools assigned by your coach to support your growth
          </p>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tools assigned yet</h3>
            <p className="text-gray-600">
              Your coach will assign tools to help you achieve your goals
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              // Find the tool details from COACHING_TOOLS
              const toolDetails = COACHING_TOOLS.find(t => t.id === assignment.toolId);
              if (!toolDetails) return null;

              const Icon = toolDetails.icon;
              
              return (
                <Link
                  key={assignment.id}
                  href={`/tools/${assignment.toolId}`}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${toolDetails.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    {assignment.completed ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 size={16} />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                        <Clock size={16} />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {toolDetails.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {toolDetails.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {toolDetails.category}
                    </span>
                    <span className="text-primary-600 text-sm font-medium">
                      {assignment.completed ? 'View Results' : 'Start Tool'} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
