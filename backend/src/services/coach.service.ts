import { db } from '../config/firebase';
import { Coach, CreateCoachDTO, UpdateCoachDTO, WeeklyAvailability } from '../models/coach.model';

const defaultAvailability: WeeklyAvailability = {
  monday: [{ start: '09:00', end: '17:00' }],
  tuesday: [{ start: '09:00', end: '17:00' }],
  wednesday: [{ start: '09:00', end: '17:00' }],
  thursday: [{ start: '09:00', end: '17:00' }],
  friday: [{ start: '09:00', end: '17:00' }],
  saturday: [],
  sunday: [],
};

export class CoachService {
  private collection = db.collection('coaches');

  async createCoach(data: CreateCoachDTO): Promise<Coach> {
    const coach = {
      userId: data.userId,
      email: data.email,
      displayName: data.displayName,
      bio: data.bio || '',
      specialties: data.specialties || [],
      certifications: data.certifications || [],
      hourlyRate: data.hourlyRate || 0,
      currency: data.currency || 'USD',
      timezone: data.timezone || 'America/New_York',
      availability: defaultAvailability,
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await this.collection.add(coach);
    return { id: docRef.id, ...coach };
  }

  async getCoachById(coachId: string): Promise<Coach | null> {
    const doc = await this.collection.doc(coachId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Coach;
  }

  async getCoachByUserId(userId: string): Promise<Coach | null> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Coach;
  }

  async getAllCoaches(status?: string): Promise<Coach[]> {
    let query = this.collection.orderBy('createdAt', 'desc');
    
    if (status) {
      query = this.collection
        .where('status', '==', status)
        .orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coach));
  }

  async updateCoach(coachId: string, data: UpdateCoachDTO): Promise<Coach | null> {
    const docRef = this.collection.doc(coachId);
    const doc = await docRef.get();
    
    if (!doc.exists) return null;

    await docRef.update({
      ...data,
      updatedAt: new Date(),
    });

    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as Coach;
  }

  async deleteCoach(coachId: string): Promise<void> {
    await this.collection.doc(coachId).update({
      status: 'inactive',
      updatedAt: new Date(),
    });
  }

  async getCoachStats(coachId: string): Promise<{
    totalCoachees: number;
    activeCoachees: number;
    completedCoachees: number;
  }> {
    const coacheesSnapshot = await db.collection('coachees')
      .where('coachId', '==', coachId)
      .get();

    const coachees = coacheesSnapshot.docs.map(doc => doc.data());
    
    return {
      totalCoachees: coachees.length,
      activeCoachees: coachees.filter(c => c.status === 'active').length,
      completedCoachees: coachees.filter(c => c.status === 'completed').length,
    };
  }
}
