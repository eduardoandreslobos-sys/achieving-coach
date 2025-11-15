export interface Goal {
  id: string;
  coacheeId: string;
  title: string;
  description?: string;
  confidenceLevel: number; // 1-10
  actions: Action[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface Action {
  id: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
}
