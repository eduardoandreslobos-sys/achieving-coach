import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  Stakeholder, 
  StakeholderRole, 
  StakeholderFeedback,
  StakeholderPortalData,
  DEFAULT_PERMISSIONS,
  StakeholderAction
} from '@/types/stakeholder';

// ============ HELPER: Generar Token Único (Cryptographically Secure) ============

function generateAccessToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const tokenLength = 32;
  let token = '';

  // Use Web Crypto API for secure random values (works in browser and modern Node.js)
  const randomValues = new Uint32Array(tokenLength);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < tokenLength; i++) {
    token += chars.charAt(randomValues[i] % chars.length);
  }

  return token;
}

// ============ CREAR STAKEHOLDER ============

export async function createStakeholder(data: {
  name: string;
  email: string;
  phone?: string;
  position?: string;
  role: StakeholderRole;
  programId: string;
  coacheeId: string;
  coachId: string;
}): Promise<Stakeholder> {
  const accessToken = generateAccessToken();
  const now = Timestamp.now();
  
  // Token expira en 90 días
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);
  
  const stakeholderData: Omit<Stakeholder, 'id'> = {
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone || '',
    position: data.position || '',
    role: data.role,
    programId: data.programId,
    coacheeId: data.coacheeId,
    coachId: data.coachId,
    accessToken,
    tokenExpiresAt: Timestamp.fromDate(expiresAt),
    status: 'pending',
    permissions: DEFAULT_PERMISSIONS[data.role],
    invitedAt: now,
    invitedBy: data.coachId,
    accessCount: 0,
    invitationEmailSent: false,
    remindersSent: 0,
    completedActions: [],
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await addDoc(collection(db, 'stakeholders'), stakeholderData);
  
  return {
    id: docRef.id,
    ...stakeholderData,
  };
}

// ============ OBTENER STAKEHOLDERS DE UN PROGRAMA ============

export async function getProgramStakeholders(programId: string): Promise<Stakeholder[]> {
  const q = query(
    collection(db, 'stakeholders'),
    where('programId', '==', programId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Stakeholder));
}

// ============ OBTENER STAKEHOLDER POR TOKEN ============

export async function getStakeholderByToken(token: string): Promise<Stakeholder | null> {
  const q = query(
    collection(db, 'stakeholders'),
    where('accessToken', '==', token)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  const stakeholder = { id: doc.id, ...doc.data() } as Stakeholder;
  
  // Verificar si no ha expirado
  if (stakeholder.tokenExpiresAt.toDate() < new Date()) {
    await updateDoc(doc.ref, { status: 'expired' });
    return { ...stakeholder, status: 'expired' };
  }
  
  return stakeholder;
}

// ============ OBTENER STAKEHOLDER POR ID ============

export async function getStakeholderById(stakeholderId: string): Promise<Stakeholder | null> {
  const docRef = doc(db, 'stakeholders', stakeholderId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) {
    return null;
  }
  
  return { id: snapshot.id, ...snapshot.data() } as Stakeholder;
}

// ============ ACTUALIZAR STAKEHOLDER ============

export async function updateStakeholder(
  stakeholderId: string, 
  data: Partial<Stakeholder>
): Promise<void> {
  const docRef = doc(db, 'stakeholders', stakeholderId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ============ ELIMINAR STAKEHOLDER ============

export async function deleteStakeholder(stakeholderId: string): Promise<void> {
  const docRef = doc(db, 'stakeholders', stakeholderId);
  await deleteDoc(docRef);
}

// ============ REGISTRAR ACCESO AL PORTAL ============

export async function recordPortalAccess(stakeholderId: string): Promise<void> {
  const docRef = doc(db, 'stakeholders', stakeholderId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return;
  
  const current = snapshot.data() as Stakeholder;
  
  await updateDoc(docRef, {
    status: 'active',
    lastAccessAt: serverTimestamp(),
    accessCount: (current.accessCount || 0) + 1,
    updatedAt: serverTimestamp(),
  });
}

// ============ REGISTRAR ACCIÓN DEL STAKEHOLDER ============

export async function recordStakeholderAction(
  stakeholderId: string,
  action: Omit<StakeholderAction, 'timestamp'>
): Promise<void> {
  const docRef = doc(db, 'stakeholders', stakeholderId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return;
  
  const current = snapshot.data() as Stakeholder;
  const newAction: StakeholderAction = {
    ...action,
    timestamp: Timestamp.now(),
  };
  
  await updateDoc(docRef, {
    completedActions: [...(current.completedActions || []), newAction],
    updatedAt: serverTimestamp(),
  });
}

// ============ MARCAR EMAIL ENVIADO ============

export async function markInvitationSent(stakeholderId: string): Promise<void> {
  const docRef = doc(db, 'stakeholders', stakeholderId);
  await updateDoc(docRef, {
    invitationEmailSent: true,
    invitationEmailSentAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ============ MARCAR RECORDATORIO ENVIADO ============

export async function markReminderSent(stakeholderId: string): Promise<void> {
  const docRef = doc(db, 'stakeholders', stakeholderId);
  const snapshot = await getDoc(docRef);
  
  if (!snapshot.exists()) return;
  
  const current = snapshot.data() as Stakeholder;
  
  await updateDoc(docRef, {
    remindersSent: (current.remindersSent || 0) + 1,
    lastReminderAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ============ RENOVAR TOKEN ============

export async function renewStakeholderToken(stakeholderId: string): Promise<string> {
  const newToken = generateAccessToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);
  
  const docRef = doc(db, 'stakeholders', stakeholderId);
  await updateDoc(docRef, {
    accessToken: newToken,
    tokenExpiresAt: Timestamp.fromDate(expiresAt),
    status: 'pending',
    updatedAt: serverTimestamp(),
  });
  
  return newToken;
}

// ============ CREAR FEEDBACK DE STAKEHOLDER ============

export async function createStakeholderFeedback(data: {
  stakeholderId: string;
  programId: string;
  coacheeId: string;
  type: StakeholderFeedback['type'];
  content: string;
  isAnonymous?: boolean;
}): Promise<StakeholderFeedback> {
  const feedbackData: Omit<StakeholderFeedback, 'id'> = {
    stakeholderId: data.stakeholderId,
    programId: data.programId,
    coacheeId: data.coacheeId,
    type: data.type,
    content: data.content,
    isAnonymous: data.isAnonymous || false,
    visibleToCoach: true,
    visibleToCoachee: !data.isAnonymous,
    createdAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, 'stakeholderFeedback'), feedbackData);
  
  // Registrar la acción
  await recordStakeholderAction(data.stakeholderId, {
    type: 'left_feedback',
    details: data.type,
  });
  
  return {
    id: docRef.id,
    ...feedbackData,
  };
}

// ============ OBTENER FEEDBACK DE UN PROGRAMA ============

export async function getProgramFeedback(programId: string): Promise<StakeholderFeedback[]> {
  const q = query(
    collection(db, 'stakeholderFeedback'),
    where('programId', '==', programId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as StakeholderFeedback));
}

// ============ OBTENER DATOS PARA EL PORTAL ============

export async function getStakeholderPortalData(token: string): Promise<StakeholderPortalData | null> {
  const stakeholder = await getStakeholderByToken(token);
  
  if (!stakeholder || stakeholder.status === 'expired') {
    return null;
  }
  
  // Registrar acceso
  await recordPortalAccess(stakeholder.id);
  
  // Obtener datos del programa
  const programRef = doc(db, 'coachingPrograms', stakeholder.programId);
  const programSnap = await getDoc(programRef);
  
  if (!programSnap.exists()) {
    return null;
  }
  
  const program = programSnap.data();
  
  // Obtener datos del coachee
  const coacheeRef = doc(db, 'users', stakeholder.coacheeId);
  const coacheeSnap = await getDoc(coacheeRef);
  const coacheeName = coacheeSnap.exists() 
    ? coacheeSnap.data().displayName || 'Coachee'
    : program.coacheeName || 'Coachee';
  
  // Obtener datos del coach
  const coachRef = doc(db, 'users', stakeholder.coachId);
  const coachSnap = await getDoc(coachRef);
  const coachName = coachSnap.exists()
    ? coachSnap.data().displayName || 'Coach'
    : 'Coach';
  
  // Calcular progreso del programa
  const currentPhase = program.currentPhase || 1;
  const totalPhases = 9;
  const programProgress = Math.round((currentPhase / totalPhases) * 100);
  
  // Construir datos del portal
  const portalData: StakeholderPortalData = {
    stakeholder,
    coacheeName,
    coachName,
    programTitle: program.title || 'Programa de Coaching',
    programPhase: currentPhase,
    programProgress,
    pendingActions: [],
  };
  
  // Agregar goals si tiene permiso
  if (stakeholder.permissions.includes('view_goals') && program.agreement?.expectedResults) {
    portalData.goals = {
      total: program.agreement.expectedResults.length,
      completed: 0, // TODO: calcular desde goals completados
      items: program.agreement.expectedResults.map((r: string) => ({
        title: r,
        status: 'in_progress',
      })),
    };
  }
  
  // Agregar sesiones si tiene permiso
  if (stakeholder.permissions.includes('view_progress')) {
    // TODO: contar sesiones completadas
    portalData.sessionsCompleted = currentPhase > 4 ? 3 : (currentPhase > 2 ? 1 : 0);
    portalData.totalSessions = 6;
  }
  
  return portalData;
}

// ============ VERIFICAR PERMISO ============

export function hasPermission(
  stakeholder: Stakeholder, 
  permission: Stakeholder['permissions'][number]
): boolean {
  return stakeholder.permissions.includes(permission);
}
