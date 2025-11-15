import { db } from '../config/firebase';

export class GoalsService {
  private collection = db.collection('goals');

  async createGoal(coacheeId: string, data: any) {
    const goal = {
      coacheeId,
      title: data.title,
      description: data.description || '',
      confidenceLevel: data.confidenceLevel || 5,
      actions: data.actions || [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await this.collection.add(goal);
    return { id: docRef.id, ...goal };
  }

  async getGoalsByCoachee(coacheeId: string) {
    const snapshot = await this.collection
      .where('coacheeId', '==', coacheeId)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateGoal(goalId: string, data: any) {
    await this.collection.doc(goalId).update({
      ...data,
      updatedAt: new Date(),
    });
    
    const doc = await this.collection.doc(goalId).get();
    return { id: doc.id, ...doc.data() };
  }

  async deleteGoal(goalId: string) {
    await this.collection.doc(goalId).update({
      status: 'archived',
      updatedAt: new Date(),
    });
  }
}
