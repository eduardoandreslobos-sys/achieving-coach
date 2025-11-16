import { Firestore } from '@google-cloud/firestore';
import { GrowSession, CreateGrowSessionDTO, UpdateGrowSessionDTO } from '../models/GrowSession';

export class GrowSessionService {
  private db: Firestore;
  private collection: string = 'grow_sessions';

  constructor(firestore: Firestore) {
    this.db = firestore;
  }

  async createSession(data: CreateGrowSessionDTO): Promise<GrowSession> {
    const now = new Date();
    const sessionRef = this.db.collection(this.collection).doc();
    
    const newSession: GrowSession = {
      id: sessionRef.id,
      coacheeId: data.coacheeId,
      coachId: data.coachId,
      sessionDate: data.sessionDate,
      status: 'draft',
      goal: {
        description: '',
        specificGoal: '',
        measurableOutcome: '',
        achievableSteps: [],
        relevance: '',
        timeframe: '',
        priority: 'medium',
      },
      reality: {
        currentSituation: '',
        obstacles: [],
        resources: [],
        skillsAvailable: [],
        supportSystems: [],
        previousAttempts: '',
        emotionalState: '',
      },
      options: {
        brainstormedOptions: [],
        prosAndCons: [],
        selectedOptions: [],
        alternativePaths: [],
      },
      will: {
        commitmentLevel: 5,
        actionSteps: [],
        potentialObstacles: [],
        supportNeeded: [],
        successMetrics: [],
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        accountabilityPartner: '',
      },
      notes: '',
      attachments: [],
      createdAt: now,
      updatedAt: now,
    };

    await sessionRef.set(newSession);
    return newSession;
  }

  async getSessionById(sessionId: string): Promise<GrowSession | null> {
    const doc = await this.db.collection(this.collection).doc(sessionId).get();
    if (!doc.exists) return null;
    return doc.data() as GrowSession;
  }

  async getSessionsByCoachee(coacheeId: string): Promise<GrowSession[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('coacheeId', '==', coacheeId)
      .orderBy('sessionDate', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data() as GrowSession);
  }

  async getSessionsByCoach(coachId: string): Promise<GrowSession[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('coachId', '==', coachId)
      .orderBy('sessionDate', 'desc')
      .get();
    return snapshot.docs.map(doc => doc.data() as GrowSession);
  }

  async updateSession(sessionId: string, updates: UpdateGrowSessionDTO): Promise<GrowSession | null> {
    const sessionRef = this.db.collection(this.collection).doc(sessionId);
    const doc = await sessionRef.get();
    if (!doc.exists) return null;
    
    const currentData = doc.data() as GrowSession;
    const updatedData: Partial<GrowSession> = {
      ...updates,
      updatedAt: new Date(),
    };
    
    if (updates.goal) updatedData.goal = { ...currentData.goal, ...updates.goal };
    if (updates.reality) updatedData.reality = { ...currentData.reality, ...updates.reality };
    if (updates.options) updatedData.options = { ...currentData.options, ...updates.options };
    if (updates.will) updatedData.will = { ...currentData.will, ...updates.will };
    
    await sessionRef.update(updatedData);
    const updated = await sessionRef.get();
    return updated.data() as GrowSession;
  }

  async completeSession(sessionId: string): Promise<GrowSession | null> {
    const sessionRef = this.db.collection(this.collection).doc(sessionId);
    await sessionRef.update({
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date(),
    });
    const updated = await sessionRef.get();
    return updated.data() as GrowSession;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const sessionRef = this.db.collection(this.collection).doc(sessionId);
    const doc = await sessionRef.get();
    if (!doc.exists) return false;
    await sessionRef.delete();
    return true;
  }
}
