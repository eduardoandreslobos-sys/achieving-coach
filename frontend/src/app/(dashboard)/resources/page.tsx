'use client';

import React from 'react';
import { BookOpen, FileText, Video, Download, ExternalLink } from 'lucide-react';

const mockResources = [
  {
    id: '1',
    title: 'Goal Setting Framework Guide',
    type: 'pdf',
    description: 'A comprehensive guide to setting and achieving meaningful goals',
    category: 'Guides',
    size: '2.4 MB',
  },
  {
    id: '2',
    title: 'Leadership Development Webinar',
    type: 'video',
    description: 'Recording from our recent leadership workshop',
    category: 'Videos',
    duration: '45 min',
  },
  {
    id: '3',
    title: 'Weekly Reflection Template',
    type: 'document',
    description: 'Use this template for your weekly coaching reflections',
    category: 'Templates',
    size: '125 KB',
  },
  {
    id: '4',
    title: 'Recommended Reading List',
    type: 'link',
    description: 'Books and articles for personal development',
    category: 'Reading',
    url: 'https://example.com',
  },
];

export default function ResourcesPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'document': return FileText;
      case 'link': return ExternalLink;
      default: return BookOpen;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 text-red-600 border-red-200';
      case 'video': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'document': return 'bg-green-50 text-green-600 border-green-200';
      case 'link': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resources
          </h1>
          <p className="text-lg text-gray-600">
            Tools, guides, and materials to support your growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mockResources.map((resource) => {
            const Icon = getIcon(resource.type);
            const colorClass = getColor(resource.type);

            return (
              <div key={resource.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`${colorClass} p-3 rounded-lg border-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded-full">{resource.category}</span>
                        {resource.size && <span>{resource.size}</span>}
                        {resource.duration && <span>{resource.duration}</span>}
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        {resource.type === 'link' ? <ExternalLink size={16} /> : <Download size={16} />}
                        {resource.type === 'link' ? 'Open' : 'Download'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
