import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Coaching Tools - 10+ Professional Assessment & Development Tools',
  description: 'Access professional coaching tools including GROW Worksheet, DISC Assessment, Wheel of Life, Values Clarification, Career Compass, Resilience Scale, and more. ICF-aligned tools for coaches and coachees.',
  keywords: [
    'coaching tools',
    'GROW model worksheet',
    'DISC assessment online',
    'wheel of life tool',
    'values clarification exercise',
    'career coaching tools',
    'resilience assessment',
    'ICF coaching tools',
    'professional development tools',
    'coaching exercises'
  ],
  openGraph: {
    title: 'Professional Coaching Tools | AchievingCoach',
    description: '10+ professional coaching tools including GROW, DISC, Wheel of Life, and Values Clarification. Designed for ICF-certified coaches.',
    images: ['/og-tools.png'],
  },
  alternates: {
    canonical: 'https://achievingcoach.com/tools',
  },
};


import Link from 'next/link';
import { Target, Brain, TrendingUp, Smile, Compass, Shield, Users, MessageSquare, Heart } from 'lucide-react';

const tools = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    description: 'Assess balance across 8 key life areas',
    icon: Target,
    color: 'bg-blue-600',
    status: 'active',
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification',
    description: 'Identify and prioritize your core values',
    icon: Brain,
    color: 'bg-purple-600',
    status: 'active',
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs',
    description: 'Challenge beliefs that hold you back',
    icon: TrendingUp,
    color: 'bg-orange-600',
    status: 'active',
  },
  {
    id: 'habit-loop',
    name: 'Habit Loop',
    description: 'Build positive habits using cue-routine-reward',
    icon: Smile,
    color: 'bg-green-600',
    status: 'active',
  },
  {
    id: 'career-compass',
    name: 'Career Compass',
    description: 'Navigate your career direction and goals',
    icon: Compass,
    color: 'bg-indigo-600',
    status: 'active',
  },
  {
    id: 'resilience-scale',
    name: 'Resilience Scale',
    description: 'Measure and build your resilience',
    icon: Shield,
    color: 'bg-pink-600',
    status: 'active',
  },
  {
    id: 'stakeholder-map',
    name: 'Stakeholder Map',
    description: 'Identify and analyze key stakeholders',
    icon: Users,
    color: 'bg-teal-600',
    status: 'active',
  },
  {
    id: 'feedback-feedforward',
    name: 'Feedback Feed-Forward',
    description: 'Transform feedback into future-focused strategies',
    icon: MessageSquare,
    color: 'bg-cyan-600',
    status: 'active',
  },
  {
    id: 'emotional-triggers',
    name: 'Emotional Triggers Journal',
    description: 'Identify patterns and develop healthier responses',
    icon: Heart,
    color: 'bg-rose-600',
    status: 'active',
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coaching Tools</h1>
          <p className="text-gray-600">
            Professional tools to support your coaching journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
