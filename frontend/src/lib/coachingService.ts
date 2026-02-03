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
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import {
  CoachingProgram,
  CoachingType,
  Session,
  SessionType,
  SessionStatus,
  BackgroundInfo,
  TripartiteMeeting,
  AlignmentSession,
  CoachingAgreement,
  SessionCalendarEntry,
  SessionAgreement,
  SessionReport,
  ObservedMeetingReport,
  ProcessReport,
  FinalReport,
  DigitalSignature,
  RescheduleEntry,
  TRIPARTITE_QUESTIONS,
  PROGRAM_PHASES,
  isPhaseComplete,
  getPendingRequirements,
  getNextActivePhase
} from '@/types/coaching';

// ============ DIGITAL SIGNATURE ============

export async function generateSignatureHash(
  userId: string,
  programId: string,
  role: string
): Promise<string> {
  const timestamp = Date.now();
  const data = `${userId}|${programId}|${timestamp}|${role}`;
  
  // Generate SHA-256 hash
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

export async function signAgreement(
  programId: string,
  userId: string,
  userName: string,
  userEmail: string,
  role: 'coachee' | 'sponsor' | 'hr' | 'coach',
  acceptedTerms: string[]
): Promise<DigitalSignature> {
  const signatureHash = await generateSignatureHash(userId, programId, role);
  
  const signature: DigitalSignature = {
    oduid: userId,
    name: userName,
    email: userEmail,
    role,
    signedAt: Timestamp.now(),
    signatureHash,
    acceptedTerms,
  };
  
  // Update program with new signature
  const programRef = doc(db, 'coaching_programs', programId);
  const programDoc = await getDoc(programRef);
  
  if (programDoc.exists()) {
    const program = programDoc.data() as CoachingProgram;
    const existingSignatures = program.agreement?.signatures || [];
    
    // Check if already signed by this role
    const alreadySigned = existingSignatures.some(s => s.role === role);
    if (alreadySigned) {
      throw new Error(`Ya existe una firma para el rol ${role}`);
    }
    
    const updatedSignatures = [...existingSignatures, signature];
    
    await updateDoc(programRef, {
      'agreement.signatures': updatedSignatures,
      updatedAt: serverTimestamp(),
    });
    
    // Check if all required signatures are complete
    // Para coaching individual, no se requiere sponsor
    const requiredRoles: Array<'coach' | 'coachee' | 'sponsor' | 'hr'> =
      program.coachingType === 'individual'
        ? ['coach', 'coachee']
        : ['coach', 'coachee', 'sponsor'];

    const signedRoles = updatedSignatures.map(s => s.role);
    const allSigned = requiredRoles.every(r => signedRoles.includes(r));

    if (allSigned) {
      await updateDoc(programRef, {
        'agreement.status': 'signed',
        'agreement.completedAt': serverTimestamp(),
        status: 'active',
      });

      // Auto-actualizar progresión de fases
      await checkAndUpdatePhaseProgression(programId);
    }
  }

  return signature;
}

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
    coachingType?: CoachingType;
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
    coachingType: data.coachingType || 'corporate', // Default: corporate
    status: 'draft',
    startDate: Timestamp.fromDate(data.startDate),
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    currentPhase: 1,
    phasesCompleted: [],
  };

  await setDoc(programRef, program);
  return programRef.id;
}

export async function getCoachingProgram(programId: string): Promise<CoachingProgram | null> {
  const docRef = doc(db, 'coaching_programs', programId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return null;
  
  return { id: docSnap.id, ...docSnap.data() } as CoachingProgram;
}

export async function getCoacheeProgram(
  coachId: string,
  coacheeId: string
): Promise<CoachingProgram | null> {
  const q = query(
    collection(db, 'coaching_programs'),
    where('coachId', '==', coachId),
    where('coacheeId', '==', coacheeId),
    where('status', 'in', ['draft', 'pending_acceptance', 'active'])
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as CoachingProgram;
}

export async function getCoachPrograms(coachId: string): Promise<CoachingProgram[]> {
  const q = query(
    collection(db, 'coaching_programs'),
    where('coachId', '==', coachId),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CoachingProgram));
}

export async function getCoacheePrograms(coacheeId: string): Promise<CoachingProgram[]> {
  const q = query(
    collection(db, 'coaching_programs'),
    where('coacheeId', '==', coacheeId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CoachingProgram));
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

// ============ PHASE PROGRESSION SYSTEM ============

/**
 * Determina a qué fase pertenece una sesión basándose en su número
 */
export function getSessionPhaseId(sessionNumber: number): number {
  if (sessionNumber >= 1 && sessionNumber <= 3) return 5; // Fase 5: Sesiones 1-3
  if (sessionNumber === 4) return 7; // Fase 7: Sesión Observada
  if (sessionNumber >= 5 && sessionNumber <= 6) return 8; // Fase 8: Sesiones 5-6
  return 5; // Default
}

/**
 * Verifica y actualiza automáticamente la fase del programa
 * Esta función se llama después de cualquier acción que podría cambiar el estado de las fases
 */
export async function checkAndUpdatePhaseProgression(programId: string): Promise<{
  previousPhase: number;
  currentPhase: number;
  phasesCompleted: number[];
  pendingRequirements: string[];
}> {
  const program = await getCoachingProgram(programId);
  if (!program) throw new Error('Programa no encontrado');

  const sessions = await getProgramSessions(programId);
  const previousPhase = program.currentPhase || 1;
  const previousCompleted = program.phasesCompleted || [];

  // Calcular qué fases están completas
  const newPhasesCompleted: number[] = [];
  let newCurrentPhase = 1;

  for (const phase of PROGRAM_PHASES) {
    if (isPhaseComplete(phase.id, program, sessions)) {
      if (!newPhasesCompleted.includes(phase.id)) {
        newPhasesCompleted.push(phase.id);
      }
      // Si esta fase está completa y hay una siguiente, avanzar
      if (phase.id < 9) {
        newCurrentPhase = phase.id + 1;
      } else {
        newCurrentPhase = 9;
      }
    } else {
      // Primera fase incompleta es la actual
      newCurrentPhase = phase.id;
      break;
    }
  }

  // Solo actualizar si hay cambios
  const hasChanges =
    newCurrentPhase !== previousPhase ||
    newPhasesCompleted.length !== previousCompleted.length;

  if (hasChanges) {
    const docRef = doc(db, 'coaching_programs', programId);
    await updateDoc(docRef, {
      currentPhase: newCurrentPhase,
      phasesCompleted: newPhasesCompleted,
      updatedAt: serverTimestamp(),
    });

    // Notificar si avanzó de fase
    if (newCurrentPhase > previousPhase) {
      const newPhase = PROGRAM_PHASES.find(p => p.id === newCurrentPhase);
      if (newPhase) {
        await createNotification(
          program.coachId,
          'program',
          `📈 Avance a Fase ${newCurrentPhase}`,
          `El programa de ${program.coacheeName} avanzó a: ${newPhase.name}`,
          `/coach/programs/${programId}`
        );
      }
    }
  }

  // Obtener requisitos pendientes de la fase actual
  const pendingRequirements = getPendingRequirements(newCurrentPhase, program, sessions);

  return {
    previousPhase,
    currentPhase: newCurrentPhase,
    phasesCompleted: newPhasesCompleted,
    pendingRequirements,
  };
}

/**
 * Obtiene el estado detallado de todas las fases de un programa
 */
export async function getProgramPhaseStatus(programId: string): Promise<{
  currentPhase: number;
  phases: {
    id: number;
    name: string;
    status: 'completed' | 'current' | 'locked';
    progress: number;
    pendingRequirements: string[];
  }[];
}> {
  const program = await getCoachingProgram(programId);
  if (!program) throw new Error('Programa no encontrado');

  const sessions = await getProgramSessions(programId);
  const currentPhase = program.currentPhase || 1;
  const phasesCompleted = program.phasesCompleted || [];

  const phases = PROGRAM_PHASES.map(phase => {
    const isComplete = phasesCompleted.includes(phase.id);
    const isCurrent = phase.id === currentPhase;
    const isLocked = phase.id > currentPhase && !isComplete;

    const completedReqs = phase.requirements.filter(req => req.check(program, sessions)).length;
    const progress = phase.requirements.length > 0
      ? Math.round((completedReqs / phase.requirements.length) * 100)
      : 0;

    return {
      id: phase.id,
      name: phase.name,
      status: isComplete ? 'completed' as const : isCurrent ? 'current' as const : 'locked' as const,
      progress: isComplete ? 100 : progress,
      pendingRequirements: isComplete ? [] : getPendingRequirements(phase.id, program, sessions),
    };
  });

  return { currentPhase, phases };
}

/**
 * Verifica si se puede avanzar manualmente a una fase específica
 */
export async function canAdvanceToPhase(
  programId: string,
  targetPhase: number
): Promise<{ canAdvance: boolean; reason?: string }> {
  const program = await getCoachingProgram(programId);
  if (!program) return { canAdvance: false, reason: 'Programa no encontrado' };

  const sessions = await getProgramSessions(programId);

  // Verificar que todas las fases anteriores estén completas
  for (let i = 1; i < targetPhase; i++) {
    if (!isPhaseComplete(i, program, sessions)) {
      const phase = PROGRAM_PHASES.find(p => p.id === i);
      const pending = getPendingRequirements(i, program, sessions);
      return {
        canAdvance: false,
        reason: `Debes completar la fase "${phase?.name}" primero. Pendiente: ${pending.join(', ')}`
      };
    }
  }

  return { canAdvance: true };
}

// ============ PHASE UPDATES ============

export async function saveBackgroundInfo(
  programId: string,
  backgroundInfo: BackgroundInfo
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);
  await updateDoc(docRef, {
    backgroundInfo: {
      ...backgroundInfo,
      completedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(programId);
}

export async function saveTripartiteMeeting(
  programId: string,
  tripartiteMeeting: TripartiteMeeting
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);

  await updateDoc(docRef, {
    tripartiteMeeting: {
      ...tripartiteMeeting,
      completedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(programId);
}

// ============ ALIGNMENT SESSION (Individual Coaching) ============

export async function saveAlignmentSession(
  programId: string,
  alignmentSession: AlignmentSession
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);

  await updateDoc(docRef, {
    alignmentSession: {
      ...alignmentSession,
      completedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(programId);
}

export async function saveCoachingAgreement(
  programId: string,
  agreement: Omit<CoachingAgreement, 'signatures' | 'status'>
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);
  
  await updateDoc(docRef, {
    agreement: {
      ...agreement,
      signatures: [],
      status: 'pending_signatures',
      createdAt: serverTimestamp(),
    },
    status: 'pending_acceptance',
    updatedAt: serverTimestamp(),
  });
}

export async function saveSessionCalendar(
  programId: string,
  calendar: SessionCalendarEntry[]
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);

  await updateDoc(docRef, {
    sessionCalendar: calendar,
    updatedAt: serverTimestamp(),
  });

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(programId);
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
    location?: string;
  }
): Promise<string> {
  // Determinar tipo de sesión y fase
  const sessionNumber = data.sessionNumber;
  const sessionType = data.type || (sessionNumber === 4 ? 'observed' : sessionNumber === 1 ? 'kickstarter' : sessionNumber === 6 ? 'reflection' : 'regular');
  const phaseId = getSessionPhaseId(sessionNumber);

  const sessionRef = doc(collection(db, 'sessions'));

  const session: Omit<Session, 'id'> = {
    programId,
    coachId,
    coacheeId,
    coacheeName,
    sessionNumber,
    type: sessionType,
    phaseId, // Vinculación con fase
    title: data.title,
    scheduledDate: Timestamp.fromDate(data.scheduledDate),
    scheduledTime: data.scheduledTime,
    duration: data.duration,
    location: data.location,
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
  return { id: docSnap.id, ...docSnap.data() } as Session;
}

export async function getProgramSessions(programId: string): Promise<Session[]> {
  const q = query(
    collection(db, 'sessions'),
    where('programId', '==', programId),
    orderBy('sessionNumber', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
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
      orderBy('scheduledDate', 'asc'),
      limit(100)
    );
  } else {
    q = query(
      collection(db, 'sessions'),
      where('coachId', '==', coachId),
      orderBy('scheduledDate', 'desc'),
      limit(100)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
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

// ============ SESSION AGREEMENT & REPORT ============

export async function saveSessionAgreement(
  sessionId: string,
  agreement: SessionAgreement
): Promise<void> {
  const docRef = doc(db, 'sessions', sessionId);
  await updateDoc(docRef, {
    sessionAgreement: {
      ...agreement,
      completedAt: serverTimestamp(),
    },
    status: 'in-progress',
    startedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveSessionReport(
  sessionId: string,
  report: SessionReport
): Promise<void> {
  const docRef = doc(db, 'sessions', sessionId);
  await updateDoc(docRef, {
    sessionReport: {
      ...report,
      completedAt: serverTimestamp(),
    },
    status: 'completed',
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Obtener sesión para verificar progresión
  const sessionDoc = await getDoc(docRef);
  const session = sessionDoc.data() as Session;

  // Auto-generar reporte de proceso después de sesión 3
  if (session.sessionNumber === 3) {
    await generateProcessReport(session.programId);
  }

  // Auto-generar informe final después de sesión 6
  if (session.sessionNumber === 6) {
    // Verificar que todas las sesiones anteriores estén completas
    const sessions = await getProgramSessions(session.programId);
    const allPreviousComplete = [1, 2, 3, 4, 5].every(num =>
      sessions.some(s => s.sessionNumber === num && s.status === 'completed')
    );
    if (allPreviousComplete) {
      await generateFinalReport(session.programId);
    }
  }

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(session.programId);
}

export async function saveObservedMeetingReport(
  sessionId: string,
  report: ObservedMeetingReport
): Promise<void> {
  const docRef = doc(db, 'sessions', sessionId);
  await updateDoc(docRef, {
    observedMeetingReport: {
      ...report,
      completedAt: serverTimestamp(),
    },
    status: 'completed',
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Obtener sesión para actualizar progresión
  const sessionDoc = await getDoc(docRef);
  const session = sessionDoc.data() as Session;

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(session.programId);
}

// ============ AUTO-GENERATED REPORTS ============

export async function generateProcessReport(programId: string): Promise<ProcessReport> {
  const program = await getCoachingProgram(programId);
  if (!program) throw new Error('Programa no encontrado');
  
  const sessions = await getProgramSessions(programId);
  const completedSessions = sessions.filter(s => s.status === 'completed' && s.sessionNumber <= 3);
  
  // Extract themes from session reports
  const themes: string[] = [];
  const practices: { name: string; context: string }[] = [];
  const discoveries: string[] = [];
  
  completedSessions.forEach(session => {
    if (session.sessionReport) {
      if (session.sessionReport.sessionTopic) {
        themes.push(session.sessionReport.sessionTopic);
      }
      if (session.sessionReport.practicesWorked) {
        practices.push({
          name: session.sessionReport.practicesWorked,
          context: session.sessionReport.practiceContext || '',
        });
      }
      if (session.sessionReport.discoveriesAndLearnings) {
        discoveries.push(session.sessionReport.discoveriesAndLearnings);
      }
    }
  });
  
  // Get data from tripartite meeting
  const conservativeForces = program.tripartiteMeeting?.responses
    ?.find(r => r.questionId === 6)?.coacheeResponse || '';
  const transformativeForces = program.tripartiteMeeting?.responses
    ?.find(r => r.questionId === 5)?.coacheeResponse || '';
  
  const processReport: ProcessReport = {
    autoGenerated: true,
    generatedAt: Timestamp.now(),
    centralThemes: themes.join('\n\n'),
    coacheeAspects: {
      conservativeForces: conservativeForces,
      transformativeForces: transformativeForces,
    },
    organizationalContext: {
      conservativeForces: program.tripartiteMeeting?.responses
        ?.find(r => r.questionId === 6)?.hrResponse || '',
      transformativeForces: program.tripartiteMeeting?.responses
        ?.find(r => r.questionId === 5)?.hrResponse || '',
    },
    newPractices: practices,
    relevantDiscoveries: discoveries.join('\n\n'),
    observations: '',
    editedByCoach: false,
  };
  
  // Save to program
  const docRef = doc(db, 'coaching_programs', programId);
  await updateDoc(docRef, {
    processReport,
    updatedAt: serverTimestamp(),
  });

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(programId);

  // Notificar al coach
  await notifyCoachOfAutoReport(program.coachId, programId, 'process', program.coacheeName);
  return processReport;
}

export async function updateProcessReport(
  programId: string,
  updates: Partial<ProcessReport>
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);
  const programDoc = await getDoc(docRef);
  const program = programDoc.data() as CoachingProgram;
  
  await updateDoc(docRef, {
    processReport: {
      ...program.processReport,
      ...updates,
      editedByCoach: true,
      editedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });
}

export async function generateFinalReport(programId: string): Promise<FinalReport> {
  const program = await getCoachingProgram(programId);
  if (!program) throw new Error('Programa no encontrado');
  
  const sessions = await getProgramSessions(programId);
  const completedSessions = sessions.filter(s => s.status === 'completed');
  
  // Extract data from tripartite (starting point)
  const startingPoints = program.tripartiteMeeting?.responses
    ?.find(r => r.questionId === 8)?.coacheeResponse || '';
  
  // Extract incorporated practices from all sessions
  const practices: string[] = [];
  completedSessions.forEach(session => {
    if (session.sessionReport?.practicesWorked) {
      practices.push(session.sessionReport.practicesWorked);
    }
  });
  
  // Extract discoveries as closing aspects
  const closingAspects: string[] = [];
  completedSessions.slice(-3).forEach(session => {
    if (session.sessionReport?.discoveriesAndLearnings) {
      closingAspects.push(session.sessionReport.discoveriesAndLearnings);
    }
  });
  
  // Get process report data
  const processReport = program.processReport;
  
  const finalReport: FinalReport = {
    autoGenerated: true,
    generatedAt: Timestamp.now(),
    startingPointData: startingPoints,
    closingAspects: closingAspects.join('\n\n'),
    incorporatedPractices: practices.join('\n\n'),
    gapsToReinforce: processReport?.coacheeAspects?.conservativeForces || '',
    sustainabilityRecommendations: '',
    finalObservations: '',
    editedByCoach: false,
  };
  
  // Save to program
  const docRef = doc(db, 'coaching_programs', programId);
  await updateDoc(docRef, {
    finalReport,
    updatedAt: serverTimestamp(),
  });

  // Auto-actualizar progresión de fases
  await checkAndUpdatePhaseProgression(programId);

  // Notificar al coach
  await notifyCoachOfAutoReport(program.coachId, programId, 'final', program.coacheeName);
  return finalReport;
}

export async function updateFinalReport(
  programId: string,
  updates: Partial<FinalReport>
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);
  const programDoc = await getDoc(docRef);
  const program = programDoc.data() as CoachingProgram;
  
  await updateDoc(docRef, {
    finalReport: {
      ...program.finalReport,
      ...updates,
      editedByCoach: true,
      editedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });
}

export async function completeFinalReport(programId: string): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);
  const programDoc = await getDoc(docRef);
  const program = programDoc.data() as CoachingProgram;
  
  await updateDoc(docRef, {
    finalReport: {
      ...program.finalReport,
      completedAt: serverTimestamp(),
    },
    status: 'completed',
    phasesCompleted: [...(program.phasesCompleted || []), 9],
    endDate: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ============ LEGACY SUPPORT ============

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

// ============ NOTIFICATIONS ============

export async function createNotification(
  userId: string,
  type: 'message' | 'session' | 'program' | 'file' | 'general',
  title: string,
  message: string,
  actionUrl?: string
): Promise<string> {
  const notificationRef = doc(collection(db, 'notifications'));
  
  await setDoc(notificationRef, {
    userId,
    type,
    title,
    message,
    read: false,
    actionUrl,
    createdAt: serverTimestamp(),
  });
  
  return notificationRef.id;
}

// Notificar al coach cuando se genera un reporte automático
export async function notifyCoachOfAutoReport(
  coachId: string,
  programId: string,
  reportType: 'process' | 'final',
  coacheeName: string
): Promise<void> {
  const title = reportType === 'process' 
    ? '📋 Reporte de Proceso Generado'
    : '🏆 Informe Final Generado';
    
  const message = reportType === 'process'
    ? `Se ha generado automáticamente el reporte de seguimiento del proceso para ${coacheeName}. Revisa y edita según sea necesario.`
    : `Se ha generado el informe final para ${coacheeName}. Revisa, edita y completa el proceso.`;
    
  await createNotification(
    coachId,
    'program',
    title,
    message,
    `/coach/programs/${programId}`
  );
}

// ============ AI INTEGRATION ============

async function callAIReport(
  type: 'process' | 'final',
  sessionReports: any[],
  tripartiteResponses: any[] | undefined,
  coacheeName: string,
  programTitle: string
): Promise<any | null> {
  try {
    const response = await fetch('/api/ai-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        sessionReports,
        tripartiteResponses,
        coacheeName,
        programTitle,
      }),
    });
    
    if (!response.ok) {
      console.error('AI API error:', response.status);
      return null;
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error calling AI API:', error);
    return null;
  }
}

export async function generateProcessReportWithAI(programId: string): Promise<ProcessReport> {
  const program = await getCoachingProgram(programId);
  if (!program) throw new Error('Programa no encontrado');
  
  const sessions = await getProgramSessions(programId);
  const completedSessions = sessions.filter(s => s.status === 'completed' && s.sessionNumber <= 3);
  
  // Prepare data for AI
  const sessionReports = completedSessions.map(s => ({
    sessionNumber: s.sessionNumber,
    topic: s.sessionReport?.sessionTopic || '',
    practices: s.sessionReport?.practicesWorked || '',
    discoveries: s.sessionReport?.discoveriesAndLearnings || '',
    tasks: s.sessionReport?.tasksForNextSession || '',
  }));
  
  const tripartiteResponses = program.tripartiteMeeting?.responses?.map(r => ({
    question: r.questionId?.toString() || '',
    coacheeResponse: r.coacheeResponse || '',
    sponsorResponse: r.sponsorResponse || '',
    hrResponse: r.hrResponse || '',
  }));
  
  // Try AI generation
  const aiResult = await callAIReport(
    'process',
    sessionReports,
    tripartiteResponses,
    program.coacheeName,
    program.title
  );
  
  // Build process report
  let processReport: ProcessReport;
  
  if (aiResult) {
    // Use AI-generated content
    processReport = {
      autoGenerated: true,
      aiGenerated: true,
      generatedAt: Timestamp.now(),
      centralThemes: aiResult.centralThemes || '',
      coacheeAspects: {
        conservativeForces: aiResult.conservativeForces || '',
        transformativeForces: aiResult.transformativeForces || '',
      },
      organizationalContext: {
        conservativeForces: program.tripartiteMeeting?.responses
          ?.find(r => r.questionId === 6)?.hrResponse || '',
        transformativeForces: program.tripartiteMeeting?.responses
          ?.find(r => r.questionId === 5)?.hrResponse || '',
      },
      newPractices: sessionReports.map(s => ({ name: s.practices, context: s.topic })),
      relevantDiscoveries: aiResult.relevantDiscoveries || '',
      observations: aiResult.recommendations || '',
      editedByCoach: false,
    };
  } else {
    // Fallback to manual extraction
    const themes: string[] = [];
    const practices: { name: string; context: string }[] = [];
    const discoveries: string[] = [];
    
    completedSessions.forEach(session => {
      if (session.sessionReport) {
        if (session.sessionReport.sessionTopic) themes.push(session.sessionReport.sessionTopic);
        if (session.sessionReport.practicesWorked) {
          practices.push({
            name: session.sessionReport.practicesWorked,
            context: session.sessionReport.practiceContext || '',
          });
        }
        if (session.sessionReport.discoveriesAndLearnings) {
          discoveries.push(session.sessionReport.discoveriesAndLearnings);
        }
      }
    });
    
    processReport = {
      autoGenerated: true,
      aiGenerated: false,
      generatedAt: Timestamp.now(),
      centralThemes: themes.join('\n\n'),
      coacheeAspects: {
        conservativeForces: program.tripartiteMeeting?.responses
          ?.find(r => r.questionId === 6)?.coacheeResponse || '',
        transformativeForces: program.tripartiteMeeting?.responses
          ?.find(r => r.questionId === 5)?.coacheeResponse || '',
      },
      organizationalContext: {
        conservativeForces: program.tripartiteMeeting?.responses
          ?.find(r => r.questionId === 6)?.hrResponse || '',
        transformativeForces: program.tripartiteMeeting?.responses
          ?.find(r => r.questionId === 5)?.hrResponse || '',
      },
      newPractices: practices,
      relevantDiscoveries: discoveries.join('\n\n'),
      observations: '',
      editedByCoach: false,
    };
  }
  
  // Save to program
  const docRef = doc(db, 'coaching_programs', programId);
  await updateDoc(docRef, {
    processReport,
    currentPhase: 6,
    updatedAt: serverTimestamp(),
  });
  
  // Notify coach
  await notifyCoachOfAutoReport(program.coachId, programId, 'process', program.coacheeName);
  
  return processReport;
}

export async function generateFinalReportWithAI(programId: string): Promise<FinalReport> {
  const program = await getCoachingProgram(programId);
  if (!program) throw new Error('Programa no encontrado');
  
  const sessions = await getProgramSessions(programId);
  const completedSessions = sessions.filter(s => s.status === 'completed');
  
  // Prepare data for AI
  const sessionReports = completedSessions.map(s => ({
    sessionNumber: s.sessionNumber,
    topic: s.sessionReport?.sessionTopic || '',
    practices: s.sessionReport?.practicesWorked || '',
    discoveries: s.sessionReport?.discoveriesAndLearnings || '',
    tasks: s.sessionReport?.tasksForNextSession || '',
  }));
  
  const tripartiteResponses = program.tripartiteMeeting?.responses?.map(r => ({
    question: r.questionId?.toString() || '',
    coacheeResponse: r.coacheeResponse || '',
    sponsorResponse: r.sponsorResponse || '',
    hrResponse: r.hrResponse || '',
  }));
  
  // Try AI generation
  const aiResult = await callAIReport(
    'final',
    sessionReports,
    tripartiteResponses,
    program.coacheeName,
    program.title
  );
  
  let finalReport: FinalReport;
  
  if (aiResult) {
    finalReport = {
      autoGenerated: true,
      aiGenerated: true,
      generatedAt: Timestamp.now(),
      startingPointData: aiResult.startingPointSummary || '',
      closingAspects: aiResult.progressAchieved || '',
      incorporatedPractices: aiResult.incorporatedPractices || '',
      gapsToReinforce: aiResult.areasToReinforce || '',
      sustainabilityRecommendations: aiResult.sustainabilityRecommendations || '',
      finalObservations: '',
      editedByCoach: false,
    };
  } else {
    // Fallback
    const allPractices = completedSessions
      .map(s => s.sessionReport?.practicesWorked)
      .filter(Boolean)
      .join('\n');
    
    const allDiscoveries = completedSessions
      .map(s => s.sessionReport?.discoveriesAndLearnings)
      .filter(Boolean)
      .join('\n\n');
    
    finalReport = {
      autoGenerated: true,
      aiGenerated: false,
      generatedAt: Timestamp.now(),
      startingPointData: program.tripartiteMeeting?.responses
        ?.find(r => r.questionId === 8)?.coacheeResponse || '',
      closingAspects: allDiscoveries,
      incorporatedPractices: allPractices,
      gapsToReinforce: program.processReport?.coacheeAspects?.conservativeForces || '',
      sustainabilityRecommendations: '',
      finalObservations: '',
      editedByCoach: false,
    };
  }
  
  // Save
  const docRef = doc(db, 'coaching_programs', programId);
  await updateDoc(docRef, {
    finalReport,
    currentPhase: 9,
    updatedAt: serverTimestamp(),
  });
  
  // Notify
  await notifyCoachOfAutoReport(program.coachId, programId, 'final', program.coacheeName);

  return finalReport;
}

// ============ SESSION CONFIRMATION ============

/**
 * Confirm a session (coachee action)
 */
export async function confirmSession(
  sessionId: string,
  coacheeId: string
): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Sesión no encontrada');
  }

  const session = sessionDoc.data() as Session;

  // Verify coachee ownership
  if (session.coacheeId !== coacheeId) {
    throw new Error('No tienes permiso para confirmar esta sesión');
  }

  // Verify session is pending confirmation
  if (session.status !== 'pending_confirmation') {
    throw new Error('Esta sesión no está pendiente de confirmación');
  }

  await updateDoc(sessionRef, {
    status: 'scheduled',
    confirmation: {
      confirmedAt: serverTimestamp(),
      confirmedBy: coacheeId,
    },
    updatedAt: serverTimestamp(),
  });

  // Notify coach
  await createNotification(
    session.coachId,
    'session',
    '✅ Sesión Confirmada',
    `${session.coacheeName} confirmó la sesión programada`,
    `/coach/sessions/${sessionId}`
  );
}

/**
 * Reject a session (coachee action)
 */
export async function rejectSession(
  sessionId: string,
  coacheeId: string,
  reason: string
): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Sesión no encontrada');
  }

  const session = sessionDoc.data() as Session;

  // Verify coachee ownership
  if (session.coacheeId !== coacheeId) {
    throw new Error('No tienes permiso para rechazar esta sesión');
  }

  // Verify session is pending confirmation
  if (session.status !== 'pending_confirmation') {
    throw new Error('Esta sesión no está pendiente de confirmación');
  }

  await updateDoc(sessionRef, {
    status: 'rejected',
    confirmation: {
      rejectedAt: serverTimestamp(),
      rejectedBy: coacheeId,
      rejectionReason: reason,
    },
    updatedAt: serverTimestamp(),
  });

  // Notify coach
  await createNotification(
    session.coachId,
    'session',
    '❌ Sesión Rechazada',
    `${session.coacheeName} rechazó la sesión: "${reason}"`,
    `/coach/sessions/${sessionId}`
  );
}

// ============ SESSION CANCELLATION ============

/**
 * Cancel a session (coach or coachee action)
 */
export async function cancelSession(
  sessionId: string,
  userId: string,
  role: 'coach' | 'coachee',
  reason: string
): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Sesión no encontrada');
  }

  const session = sessionDoc.data() as Session;

  // Verify ownership based on role
  if (role === 'coach' && session.coachId !== userId) {
    throw new Error('No tienes permiso para cancelar esta sesión');
  }
  if (role === 'coachee' && session.coacheeId !== userId) {
    throw new Error('No tienes permiso para cancelar esta sesión');
  }

  // Cannot cancel completed sessions
  if (session.status === 'completed') {
    throw new Error('No se puede cancelar una sesión completada');
  }

  await updateDoc(sessionRef, {
    status: 'cancelled',
    cancellation: {
      cancelledAt: serverTimestamp(),
      cancelledBy: userId,
      cancelledByRole: role,
      reason,
    },
    updatedAt: serverTimestamp(),
  });

  // Notify the other party
  const notifyUserId = role === 'coach' ? session.coacheeId : session.coachId;
  const cancellerName = role === 'coach' ? 'Tu coach' : session.coacheeName;

  await createNotification(
    notifyUserId,
    'session',
    '🚫 Sesión Cancelada',
    `${cancellerName} canceló la sesión: "${reason}"`,
    role === 'coach' ? `/sessions/${sessionId}` : `/coach/sessions/${sessionId}`
  );
}

// ============ SESSION RESCHEDULE ============

/**
 * Request to reschedule a session
 */
export async function requestSessionReschedule(
  sessionId: string,
  userId: string,
  role: 'coach' | 'coachee',
  proposedDate: Date,
  proposedStartTime: string,
  proposedEndTime: string,
  reason: string
): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Sesión no encontrada');
  }

  const session = sessionDoc.data() as Session;

  // Verify ownership based on role
  if (role === 'coach' && session.coachId !== userId) {
    throw new Error('No tienes permiso para reprogramar esta sesión');
  }
  if (role === 'coachee' && session.coacheeId !== userId) {
    throw new Error('No tienes permiso para reprogramar esta sesión');
  }

  // Cannot reschedule completed/cancelled sessions
  if (session.status === 'completed' || session.status === 'cancelled') {
    throw new Error('No se puede reprogramar esta sesión');
  }

  // Check if there's already a pending reschedule request
  if (session.currentRescheduleRequest?.status === 'pending') {
    throw new Error('Ya existe una solicitud de reprogramación pendiente');
  }

  const rescheduleEntry = {
    requestedAt: serverTimestamp(),
    requestedBy: userId,
    requestedByRole: role,
    originalDate: session.scheduledDate,
    proposedDate: Timestamp.fromDate(proposedDate),
    proposedStartTime,
    proposedEndTime,
    reason,
    status: 'pending' as const,
  };

  await updateDoc(sessionRef, {
    currentRescheduleRequest: rescheduleEntry,
    updatedAt: serverTimestamp(),
  });

  // Notify the other party
  const notifyUserId = role === 'coach' ? session.coacheeId : session.coachId;
  const requesterName = role === 'coach' ? 'Tu coach' : session.coacheeName;

  await createNotification(
    notifyUserId,
    'session',
    '📅 Solicitud de Reprogramación',
    `${requesterName} solicita reprogramar la sesión`,
    role === 'coach' ? `/sessions/${sessionId}` : `/coach/sessions/${sessionId}`
  );
}

/**
 * Accept a reschedule request
 */
export async function acceptReschedule(
  sessionId: string,
  userId: string
): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Sesión no encontrada');
  }

  const session = sessionDoc.data() as Session;
  const request = session.currentRescheduleRequest;

  if (!request || request.status !== 'pending') {
    throw new Error('No hay solicitud de reprogramación pendiente');
  }

  // Verify the user can accept (must be the other party)
  const canAccept =
    (request.requestedByRole === 'coach' && session.coacheeId === userId) ||
    (request.requestedByRole === 'coachee' && session.coachId === userId);

  if (!canAccept) {
    throw new Error('No tienes permiso para aceptar esta solicitud');
  }

  // Update the session with new date/time
  const completedRequest = {
    ...request,
    status: 'accepted' as const,
    respondedAt: serverTimestamp(),
  };

  // Get existing history or create empty array
  const existingHistory = session.rescheduleHistory || [];

  await updateDoc(sessionRef, {
    scheduledDate: request.proposedDate,
    scheduledTime: request.proposedStartTime,
    currentRescheduleRequest: null,
    rescheduleHistory: [...existingHistory, completedRequest],
    updatedAt: serverTimestamp(),
  });

  // Notify the requester
  await createNotification(
    request.requestedBy,
    'session',
    '✅ Reprogramación Aceptada',
    `Tu solicitud de reprogramación fue aceptada`,
    request.requestedByRole === 'coach' ? `/coach/sessions/${sessionId}` : `/sessions/${sessionId}`
  );
}

/**
 * Reject a reschedule request
 */
export async function rejectReschedule(
  sessionId: string,
  userId: string,
  responseNote: string
): Promise<void> {
  const sessionRef = doc(db, 'sessions', sessionId);
  const sessionDoc = await getDoc(sessionRef);

  if (!sessionDoc.exists()) {
    throw new Error('Sesión no encontrada');
  }

  const session = sessionDoc.data() as Session;
  const request = session.currentRescheduleRequest;

  if (!request || request.status !== 'pending') {
    throw new Error('No hay solicitud de reprogramación pendiente');
  }

  // Verify the user can reject (must be the other party)
  const canReject =
    (request.requestedByRole === 'coach' && session.coacheeId === userId) ||
    (request.requestedByRole === 'coachee' && session.coachId === userId);

  if (!canReject) {
    throw new Error('No tienes permiso para rechazar esta solicitud');
  }

  const completedRequest = {
    ...request,
    status: 'rejected' as const,
    respondedAt: serverTimestamp(),
    responseNote,
  };

  // Get existing history or create empty array
  const existingHistory = session.rescheduleHistory || [];

  await updateDoc(sessionRef, {
    currentRescheduleRequest: null,
    rescheduleHistory: [...existingHistory, completedRequest],
    updatedAt: serverTimestamp(),
  });

  // Notify the requester
  await createNotification(
    request.requestedBy,
    'session',
    '❌ Reprogramación Rechazada',
    `Tu solicitud de reprogramación fue rechazada: "${responseNote}"`,
    request.requestedByRole === 'coach' ? `/coach/sessions/${sessionId}` : `/sessions/${sessionId}`
  );
}

// ============ COACHEE PROGRESS REPORT ============

/**
 * Generate a progress report for a coachee
 */
export async function generateCoacheeProgressReport(
  coacheeId: string
): Promise<import('@/types/coaching').CoacheeProgressReport> {
  // Get coachee profile
  const userRef = doc(db, 'users', coacheeId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('Usuario no encontrado');
  }

  const userData = userDoc.data();

  // Get active program
  const programsQuery = query(
    collection(db, 'coaching_programs'),
    where('coacheeId', '==', coacheeId),
    where('status', 'in', ['active', 'completed']),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  const programsSnapshot = await getDocs(programsQuery);
  let programData = undefined;
  let programSessions: Session[] = [];

  if (!programsSnapshot.empty) {
    const program = programsSnapshot.docs[0].data() as CoachingProgram;
    const programId = programsSnapshot.docs[0].id;

    programSessions = await getProgramSessions(programId);

    // Calculate program progress
    const completedSessions = programSessions.filter(s => s.status === 'completed').length;
    const totalSessions = program.sessionsPlanned || 6;
    const progress = Math.round((completedSessions / totalSessions) * 100);

    programData = {
      id: programId,
      name: program.title,
      startDate: program.startDate,
      status: program.status,
      progress,
    };
  }

  // Get coachee's tools
  const toolsQuery = query(
    collection(db, 'tool_assignments'),
    where('coacheeId', '==', coacheeId)
  );
  const toolsSnapshot = await getDocs(toolsQuery);

  const tools: import('@/types/coaching').ToolSummary[] = [];
  toolsSnapshot.forEach(doc => {
    const data = doc.data();
    tools.push({
      id: doc.id,
      name: data.toolName || 'Herramienta',
      completedAt: data.completedAt,
      status: data.completedAt ? 'completed' : data.startedAt ? 'in-progress' : 'not-started',
    });
  });

  // Get coachee's goals
  const goalsQuery = query(
    collection(db, 'goals'),
    where('userId', '==', coacheeId)
  );
  const goalsSnapshot = await getDocs(goalsQuery);

  const goals: import('@/types/coaching').GoalSummary[] = [];
  goalsSnapshot.forEach(doc => {
    const data = doc.data();
    goals.push({
      id: doc.id,
      title: data.title || 'Meta',
      progress: data.progress || 0,
      status: data.status || 'in-progress',
    });
  });

  // Build session summaries
  const sessionSummaries: import('@/types/coaching').SessionSummary[] = programSessions.map(s => ({
    id: s.id,
    sessionNumber: s.sessionNumber,
    date: s.scheduledDate,
    status: s.status || 'scheduled',
    topic: s.sessionReport?.sessionTopic || s.goal,
  }));

  // Calculate session stats
  const completedSessions = programSessions.filter(s => s.status === 'completed').length;
  const scheduledSessions = programSessions.filter(s => s.status === 'scheduled' || s.status === 'pending_confirmation').length;
  const cancelledSessions = programSessions.filter(s => s.status === 'cancelled').length;

  // Calculate tool stats
  const completedTools = tools.filter(t => t.status === 'completed').length;

  // Calculate goal stats
  const completedGoals = goals.filter(g => g.status === 'completed' || g.progress >= 100).length;
  const inProgressGoals = goals.filter(g => g.status === 'in-progress' && g.progress < 100).length;

  return {
    coachee: {
      id: coacheeId,
      name: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Usuario',
      email: userData.email || '',
    },
    program: programData,
    sessions: {
      total: programSessions.length,
      completed: completedSessions,
      scheduled: scheduledSessions,
      cancelled: cancelledSessions,
      list: sessionSummaries,
    },
    tools: {
      total: tools.length,
      completed: completedTools,
      list: tools,
    },
    goals: {
      total: goals.length,
      completed: completedGoals,
      inProgress: inProgressGoals,
      list: goals,
    },
    generatedAt: Timestamp.now(),
  };
}

// ============ SESSION CREATION WITH PENDING CONFIRMATION ============

/**
 * Create a session with pending_confirmation status (coach schedules, coachee must confirm)
 */
export async function createSessionPendingConfirmation(
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
    location?: string;
  }
): Promise<string> {
  const sessionNumber = data.sessionNumber;
  const sessionType = data.type || (sessionNumber === 4 ? 'observed' : sessionNumber === 1 ? 'kickstarter' : sessionNumber === 6 ? 'reflection' : 'regular');
  const phaseId = getSessionPhaseId(sessionNumber);

  const sessionRef = doc(collection(db, 'sessions'));

  const session: Omit<Session, 'id'> = {
    programId,
    coachId,
    coacheeId,
    coacheeName,
    sessionNumber,
    type: sessionType,
    phaseId,
    title: data.title,
    scheduledDate: Timestamp.fromDate(data.scheduledDate),
    scheduledTime: data.scheduledTime,
    duration: data.duration,
    location: data.location,
    status: 'pending_confirmation',
    goal: data.objective,
    objective: data.objective,
    agenda: [],
    activities: [],
    keyTopics: [],
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(sessionRef, session);

  // Notify coachee
  await createNotification(
    coacheeId,
    'session',
    '📅 Nueva Sesión Programada',
    `Tu coach ha programado una sesión para el ${data.scheduledDate.toLocaleDateString('es-CL')}. Por favor confirma tu asistencia.`,
    `/sessions/${sessionRef.id}`
  );

  return sessionRef.id;
}

// ============ GET COACHEE SESSIONS ============

/**
 * Get sessions for a coachee
 */
export async function getCoacheeSessions(coacheeId: string): Promise<Session[]> {
  const q = query(
    collection(db, 'sessions'),
    where('coacheeId', '==', coacheeId),
    orderBy('scheduledDate', 'desc'),
    limit(100)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));
}
