'use client';

import Link from 'next/link';
import { Target, TrendingUp, Gem, RefreshCw, Shield, Sparkles, Compass } from 'lucide-react';

const tools = [
  {
    id: 'wheel-of-life',
    title: 'Wheel of Life',
    description: 'Visualize and assess balance across key life areas',
    category: 'Self-Assessment',
    icon: Target,
    href: '/tools/wheel-of-life',
    color: 'bg-red-500',
  },
  {
    id: 'grow-worksheet',
    title: 'GROW Model Worksheet',
    description: 'Goal, Reality, Options, Will - structured coaching framework',
    category: 'Goal Setting',
    icon: TrendingUp,
    href: '/grow-worksheet',
    color: 'bg-pink-500',
  },
  {
    id: 'resilience-scale',
    title: 'Resilience Assessment Scale',
    description: 'Evaluate your resilience across emotional, physical, mental, and social dimensions',
    category: 'Self-Assessment',
    icon: Shield,
    href: '/tools/resilience-scale',
    color: 'bg-green-500',
  },
  {
    id: 'values-clarification',
    title: 'Values Clarification Matrix',
    description: 'Identify and prioritize your core values',
    category: 'Self-Discovery',
    icon: Gem,
    href: '/tools/values-clarification',
    color: 'bg-blue-500',
  },
  {
    id: 'habit-loop',
    title: 'Habit Loop Analyzer',
    description: 'Break down habits into cue, routine, and reward',
    category: 'Behavior Change',
    icon: RefreshCw,
    href: '/tools/habit-loop',
    color: 'bg-purple-500',
  },
  {
    id: 'limiting-beliefs',
    title: 'Limiting Beliefs Reframe',
    description: 'Transform limiting beliefs into empowering ones',
    category: 'Mindset',
    icon: Sparkles,
    href: '/tools/limiting-beliefs',
    color: 'bg-yellow-500',
  },
  {
    id: 'career-compass',
    title: 'Career Compass Mapping',
    description: 'Map your career journey and chart your path forward',
    category: 'Career Development',
    icon: Compass,
    href: '/tools/career-compass',
    color: 'bg-indigo-500',
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tools & Exercises
          </h1>
          <p className="text-lg text-gray-600">
            Powerful coaching tools to support your growth journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-primary-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`${tool.color} p-4 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {tool.description}
                    </p>
                    <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full">
                      {tool.category}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'Stakeholder Map',
              'Feedback Feed-Forward Planner',
              'Emotional Triggers Journal',
            ].map((tool) => (
              <div
                key={tool}
                className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6"
              >
                <h4 className="font-semibold text-gray-700">{tool}</h4>
                <p className="text-sm text-gray-500 mt-1">In development</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
