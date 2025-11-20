export interface ToolAssignment {
  id: string;
  coachId: string;
  coacheeId: string;
  toolId: string;
  toolName: string;
  toolSlug: string;
  assignedAt: Date;
  dueDate?: Date;
  status: 'assigned' | 'in-progress' | 'completed';
  notes?: string;
  completedAt?: Date;
  result?: any;
}

export const AVAILABLE_TOOLS = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    slug: 'wheel-of-life',
    description: 'Assess balance across different life areas',
    category: 'Assessment',
  },
  {
    id: 'grow-worksheet',
    name: 'GROW Worksheet',
    slug: 'grow-worksheet',
    description: 'Goal setting and action planning framework',
    category: 'Goal Setting',
  },
  {
    id: 'resilience-scale',
    name: 'Resilience Assessment Scale',
    slug: 'resilience-scale',
    description: 'Measure resilience across 4 dimensions',
    category: 'Assessment',
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification Matrix',
    slug: 'values-clarification',
    description: 'Identify and prioritize core values',
    category: 'Self-Discovery',
  },
  {
    id: 'habit-loop',
    name: 'Habit Loop Analyzer',
    slug: 'habit-loop',
    description: 'Break down and redesign habits',
    category: 'Behavior Change',
  },
  {
    id: 'limiting-beliefs',
    name: 'Limiting Beliefs Reframe',
    slug: 'limiting-beliefs',
    description: 'Identify and reframe limiting beliefs',
    category: 'Mindset',
  },
  {
    id: 'career-compass',
    name: 'Career Compass Mapping',
    slug: 'career-compass',
    description: 'Career exploration and planning tool',
    category: 'Career',
  },
] as const;
