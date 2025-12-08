import { Target, Brain, TrendingUp, Smile, Compass, Shield, Users, MessageSquare, Heart, CircleDot } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  color: string;
}

export const COACHING_TOOLS: Tool[] = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    description: 'Assess balance across 8 key life areas',
    category: 'Self-Awareness',
    icon: Target,
    color: 'bg-blue-600',
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification',
    description: 'Identify and prioritize core values',
    category: 'Self-Awareness',
    icon: Brain,
    color: 'bg-purple-600',
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs',
    description: 'Identify and challenge limiting beliefs',
    category: 'Self-Awareness',
    icon: TrendingUp,
    color: 'bg-orange-600',
  },
  {
    id: 'habit-loop',
    name: 'Habit Loop',
    description: 'Build positive habits using cue-routine-reward',
    category: 'Productivity',
    icon: Smile,
    color: 'bg-green-600',
  },
  {
    id: 'career-compass',
    name: 'Career Compass',
    description: 'Navigate career direction and goals',
    category: 'Goal Setting',
    icon: Compass,
    color: 'bg-indigo-600',
  },
  {
    id: 'resilience-scale',
    name: 'Resilience Scale',
    description: 'Measure and build resilience',
    category: 'Self-Awareness',
    icon: Shield,
    color: 'bg-pink-600',
  },
  {
    id: 'stakeholder-map',
    name: 'Stakeholder Map',
    description: 'Identify and analyze key stakeholders',
    category: 'Communication',
    icon: Users,
    color: 'bg-teal-600',
  },
  {
    id: 'feedback-feedforward',
    name: 'Feedback Feed-Forward',
    description: 'Transform feedback into future-focused strategies',
    category: 'Communication',
    icon: MessageSquare,
    color: 'bg-cyan-600',
  },
  {
    id: 'emotional-triggers',
    name: 'Emotional Triggers Journal',
    description: 'Identify patterns and develop healthier responses',
    category: 'Self-Awareness',
    icon: Heart,
    color: 'bg-rose-600',
  },
  {
    id: 'grow-model',
    name: 'GROW Worksheet',
    description: 'Structure coaching conversations',
    category: 'Goal Setting',
    icon: Target,
    color: 'bg-green-600',
  },
  {
    id: 'disc',
    name: 'DISC Assessment',
    description: 'Discover your behavioral profile and communication style',
    category: 'Self-Awareness',
    icon: CircleDot,
    color: 'bg-amber-600',
  },
];

export function getToolById(id: string): Tool | undefined {
  return COACHING_TOOLS.find(tool => tool.id === id);
}

export function getToolDisplayName(id: string): string {
  const tool = getToolById(id);
  return tool ? `${tool.name} - ${tool.category}` : id;
}
