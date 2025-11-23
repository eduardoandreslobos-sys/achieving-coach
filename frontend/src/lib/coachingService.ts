import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { CoachingProgram, Session, SessionType } from '@/types/coaching';

// ============ COACHING PROGRAMS ============

export async function createCoachingProgram(
  coachId: string,
  coacheeId: string,
  coacheeName: string,
  data: {
    title: string;
    description?: string;
    overallGoals: string[];
    duration: number;
    sessionsPlanned: number;
    startDate: Date;
  }
): Promise<string> {
  const programRef = doc(collection(db, 'coaching_programs'));
  
  const program: Omit<CoachingProgram, 'id'> = {
    coachId,
    coacheeId,
    coacheeName,
    title: data.title,
    description: data.description,
    overallGoals: data.overallGoals,
    duration: data.duration,
    sessionsPlanned: data.sessionsPlanned,
    status: 'active',
    startDate: Timestamp.fromDate(data.startDate),
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(programRef, program);
  return programRef.id;
}

export async function getCoachingProgram(programId: string): Promise<CoachingProgram | null> {
  const docRef = doc(db, 'coaching_programs', programId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as CoachingProgram;
}

export async function getCoacheeProgram(
  coachId: string,
  coacheeId: string
): Promise<CoachingProgram | null> {
  const q = query(
    collection(db, 'coaching_programs'),
    where('coachId', '==', coachId),
    where('coacheeId', '==', coacheeId),
    where('status', '==', 'active')
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as CoachingProgram;
}

export async function getCoachPrograms(coachId: string): Promise<CoachingProgram[]> {
  const q = query(
    collection(db, 'coaching_programs'),
    where('coachId', '==', coachId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as CoachingProgram));
}

export async function updateCoachingProgram(
  programId: string,
  updates: Partial<CoachingProgram>
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ============ SESSIONS ============

export async function createSession(
  programId: string,
  coachId: string,
  coacheeId: string,
  coacheeName: string,
  data: {
    sessionNumber: number;
    title: string;
    scheduledDate: Date;
    scheduledTime: string;
    duration: number;
    objective: string;
    type?: SessionType;
  }
): Promise<string> {
  const sessionRef = doc(collection(db, 'sessions'));
  
  const session: Omit<Session, 'id'> = {
    programId,
    coachId,
    coacheeId,
    coacheeName,
    sessionNumber: data.sessionNumber,
    type: data.type || 'regular',
    title: data.title,
    scheduledDate: Timestamp.fromDate(data.scheduledDate),
    scheduledTime: data.scheduledTime,
    duration: data.duration,
    status: 'scheduled',
    goal: data.objective,
    objective: data.objective,
    agenda: [],
    activities: [],
    keyTopics: [],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(sessionRef, session);
  return sessionRef.id;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const docRef = doc(db, 'sessions', sessionId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Session;
}

export async function getProgramSessions(programId: string): Promise<Session[]> {
  const q = query(
    collection(db, 'sessions'),
    where('programId', '==', programId),
    orderBy('sessionNumber', 'asc')
  );
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Session));
}

export async function getCoachSessions(
  coachId: string,
  status?: Session['status']
): Promise<Session[]> {
  let q;
  
  if (status) {
    q = query(
      collection(db, 'sessions'),
      where('coachId', '==', coachId),
      where('status', '==', status),
      orderBy('scheduledDate', 'asc')
    );
  } else {
    q = query(
      collection(db, 'sessions'),
      where('coachId', '==', coachId),
      orderBy('scheduledDate', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Session));
}

export async function updateSession(
  sessionId: string,
  updates: Partial<Session>
): Promise<void> {
  const docRef = doc(db, 'sessions', sessionId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function startSession(sessionId: string): Promise<void> {
  await updateSession(sessionId, {
    status: 'in-progress',
    startedAt: serverTimestamp() as Timestamp,
  });
}

export async function completeSession(
  sessionId: string,
  data: {
    notes?: string;
    transcript?: string;
    summary?: string;
    actualDuration?: number;
  }
): Promise<void> {
  await updateSession(sessionId, {
    status: 'completed',
    completedAt: serverTimestamp() as Timestamp,
    ...data,
  });
}
