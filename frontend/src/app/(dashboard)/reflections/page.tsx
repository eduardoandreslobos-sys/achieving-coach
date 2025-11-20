'use client';

import React, { useState } from 'react';
import { FileText, Plus, Calendar } from 'lucide-react';

const mockReflections = [
  {
    id: '1',
    title: 'Week 1 Progress',
    content: 'This week I made significant progress on my leadership goals. The feedback from my team was positive...',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['Leadership', 'Progress'],
  },
  {
    id: '2',
    title: 'Career Development Thoughts',
    content: 'After the session with Sarah, I realized that my true passion lies in mentoring others...',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ['Career', 'Insights'],
  },
];

export default function ReflectionsPage() {
  const [showNewReflection, setShowNewReflection] = useState(false);
  const [newReflection, setNewReflection] = useState({ title: '', content: '' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Reflections
            </h1>
            <p className="text-lg text-gray-600">
              Document your coaching journey and insights
            </p>
          </div>
          <button 
            onClick={() => setShowNewReflection(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Reflection
          </button>
        </div>

        {/* New Reflection Form */}
        {showNewReflection && (
          <div className="bg-white rounded-xl border-2 border-primary-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Reflection</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newReflection.title}
                onChange={(e) => setNewReflection({ ...newReflection, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <textarea
                placeholder="What's on your mind? Reflect on your progress, challenges, insights, or learnings..."
                value={newReflection.content}
                onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
              <div className="flex gap-3">
                <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Save Reflection
                </button>
                <button 
                  onClick={() => setShowNewReflection(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reflections List */}
        <div className="space-y-4">
          {mockReflections.map((reflection) => (
            <div key={reflection.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{reflection.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{reflection.date.toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3 line-clamp-2">{reflection.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {reflection.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
