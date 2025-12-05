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
  category?: string;
  assignedAt: any;
  completed: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Goal Setting': 'bg-purple-100 text-purple-700',
  'Self-Awareness': 'bg-green-100 text-green-700',
  'Communication': 'bg-blue-100 text-blue-700',
  'Productivity': 'bg-orange-100 text-orange-700',
};

const TOOL_GRADIENTS = [
  'bg-gradient-to-br from-amber-200 to-amber-400',
  'bg-gradient-to-br from-emerald-200 to-emerald-400',
  'bg-gradient-to-br from-cyan-200 to-cyan-400',
  'bg-gradient-to-br from-rose-200 to-rose-400',
  'bg-gradient-to-br from-violet-200 to-violet-400',
  'bg-gradient-to-br from-teal-200 to-teal-400',
];

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

  const getCategoryBadge = (category: string) => {
    return CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';
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
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tools assigned yet</h3>
            <p className="text-gray-600">
              Your coach will assign tools to help you achieve your goals
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignments.map((assignment, index) => {
              const toolDetails = COACHING_TOOLS.find(t => t.id === assignment.toolId);
              if (!toolDetails) return null;

              const category = assignment.category || toolDetails.category;
              const gradientClass = TOOL_GRADIENTS[index % TOOL_GRADIENTS.length];
              const Icon = toolDetails.icon;
              
              return (
                <Link
                  key={assignment.id}
                  href={`/tools/${assignment.toolId}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  {/* Gradient Header */}
                  <div className={`h-32 ${gradientClass} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <Icon className="relative text-white/80 drop-shadow-lg" size={48} />
                    
                    {/* Status Badge */}
                    {assignment.completed ? (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                        <CheckCircle2 size={14} />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-orange-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                        <Clock size={14} />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {toolDetails.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {toolDetails.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getCategoryBadge(category)}`}>
                        {category}
                      </span>
                      <span className="text-primary-600 text-sm font-medium">
                        {assignment.completed ? 'View Results' : 'Start Tool'} →
                      </span>
                    </div>
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
