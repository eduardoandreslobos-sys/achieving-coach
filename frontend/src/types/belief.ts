export interface LimitingBelief {
  id: string;
  belief: string;
  category: BeliefCategory;
  evidence: string[];
  counterEvidence: string[];
  reframe: string;
  newBelief: string;
  actionSteps: string[];
  createdAt: Date;
}

export type BeliefCategory = 
  | 'Self-Worth'
  | 'Capability'
  | 'Relationships'
  | 'Success'
  | 'Money'
  | 'Time'
  | 'Health'
  | 'Other';

export const BELIEF_CATEGORIES: BeliefCategory[] = [
  'Self-Worth',
  'Capability',
  'Relationships',
  'Success',
  'Money',
  'Time',
  'Health',
  'Other',
];

export interface BeliefPrompt {
  category: BeliefCategory;
  examples: string[];
}

export const BELIEF_PROMPTS: BeliefPrompt[] = [
  {
    category: 'Self-Worth',
    examples: [
      "I'm not good enough",
      "I don't deserve success",
      "People won't like the real me",
    ]
  },
  {
    category: 'Capability',
    examples: [
      "I'm not smart enough",
      "I can't learn new things",
      "I always fail at this",
    ]
  },
  {
    category: 'Relationships',
    examples: [
      "I can't trust anyone",
      "Everyone eventually leaves",
      "I'm better off alone",
    ]
  },
  {
    category: 'Success',
    examples: [
      "Success is for other people",
      "I'll never achieve my dreams",
      "I'm not meant to be successful",
    ]
  },
  {
    category: 'Money',
    examples: [
      "Money is the root of all evil",
      "I'll never be financially secure",
      "Rich people are greedy",
    ]
  },
  {
    category: 'Time',
    examples: [
      "I never have enough time",
      "It's too late for me",
      "I'm too old/young for this",
    ]
  },
  {
    category: 'Health',
    examples: [
      "I can't change my body",
      "Being healthy is too hard",
      "I don't have the willpower",
    ]
  },
];
