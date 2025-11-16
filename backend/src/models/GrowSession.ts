// Modelo de datos para sesiones GROW

export interface GrowSession {
  id: string;
  coacheeId: string;
  coachId: string;
  sessionDate: Date;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
  
  goal: {
    description: string;
    specificGoal: string;
    measurableOutcome: string;
    achievableSteps: string[];
    relevance: string;
    timeframe: string;
    priority: 'low' | 'medium' | 'high';
  };
  
  reality: {
    currentSituation: string;
    obstacles: string[];
    resources: string[];
    skillsAvailable: string[];
    supportSystems: string[];
    previousAttempts: string;
    emotionalState: string;
  };
  
  options: {
    brainstormedOptions: string[];
    prosAndCons: Array<{
      option: string;
      pros: string[];
      cons: string[];
      feasibility: number;
    }>;
    selectedOptions: string[];
    alternativePaths: string[];
  };
  
  will: {
    commitmentLevel: number;
    actionSteps: Array<{
      step: string;
      deadline: Date;
      responsible: string;
      completed: boolean;
    }>;
    potentialObstacles: string[];
    supportNeeded: string[];
    successMetrics: string[];
    followUpDate: Date;
    accountabilityPartner: string;
  };
  
  notes: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CreateGrowSessionDTO {
  coacheeId: string;
  coachId: string;
  sessionDate: Date;
}

export interface UpdateGrowSessionDTO {
  goal?: Partial<GrowSession['goal']>;
  reality?: Partial<GrowSession['reality']>;
  options?: Partial<GrowSession['options']>;
  will?: Partial<GrowSession['will']>;
  notes?: string;
  status?: GrowSession['status'];
}
