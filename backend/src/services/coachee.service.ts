import { db } from '../config/firebase';
import { Coachee, CreateCoacheeDTO, UpdateCoacheeDTO } from '../models/coachee.model';

export class CoacheeService {
  private collection = db.collection('coachees');

  async createCoachee(data: CreateCoacheeDTO): Promise<Coachee> {
    const coachee = {
      userId: data.userId,
      email: data.email,
      displayName: data.displayName,
      coachId: data.coachId,
      programId: data.programId || null,
      status: 'active' as const,
      enrolledAt: new Date(),
      completedAt: null,
      notes: data.notes || '',
      tags: data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await this.collection.add(coachee);
    return { id: docRef.id, ...coachee } as Coachee;
  }

  async getCoacheeById(coacheeId: string): Promise<Coachee | null> {
    const doc = await this.collection.doc(coacheeId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Coachee;
  }

  async getCoacheeByUserId(userId: string): Promise<Coachee | null> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Coachee;
  }

  async getCoacheesByCoach(coachId: string, status?: string): Promise<Coachee[]> {
    let query: FirebaseFirestore.Query = this.collection
      .where('coachId', '==', coachId);

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coachee));
  }

  async updateCoachee(coacheeId: string, data: UpdateCoacheeDTO): Promise<Coachee | null> {
    const docRef = this.collection.doc(coacheeId);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // Si se completa, agregar fecha de completado
    if (data.status === 'completed' && !data.completedAt) {
      updateData.completedAt = new Date();
    }

    await docRef.update(updateData);

    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as Coachee;
  }

  async deleteCoachee(coacheeId: string): Promise<void> {
    await this.collection.doc(coacheeId).delete();
  }

  async getCoacheeStats(coacheeId: string): Promise<{
    totalGoals: number;
    completedGoals: number;
    totalSessions: number;
    completedTools: number;
  }> {
    // Goals
    const goalsSnapshot = await db.collection('goals')
      .where('coacheeId', '==', coacheeId)
      .get();
    
    const goals = goalsSnapshot.docs.map(doc => doc.data());

    // Sessions (futuro)
    const sessionsSnapshot = await db.collection('sessions')
      .where('coacheeId', '==', coacheeId)
      .get();

    // Tools (futuro)
    const toolsSnapshot = await db.collection('tools')
      .where('coacheeId', '==', coacheeId)
      .where('status', '==', 'completed')
      .get();

    return {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      totalSessions: sessionsSnapshot.size,
      completedTools: toolsSnapshot.size,
    };
  }

  async searchCoachees(coachId: string, searchTerm: string): Promise<Coachee[]> {
    // Firestore no soporta búsqueda de texto completo,
    // así que traemos todos y filtramos en memoria
    const snapshot = await this.collection
      .where('coachId', '==', coachId)
      .get();

    const term = searchTerm.toLowerCase();
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Coachee))
      .filter(c => 
        c.displayName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term)
      );
  }
}
