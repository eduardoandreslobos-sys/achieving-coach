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
  Session, 
  SessionType,
  BackgroundInfo,
  TripartiteMeeting,
  CoachingAgreement,
  SessionCalendarEntry,
  SessionAgreement,
  SessionReport,
  ObservedMeetingReport,
  ProcessReport,
  FinalReport,
  DigitalSignature,
  TRIPARTITE_QUESTIONS
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
    const requiredRoles: Array<'coach' | 'coachee' | 'sponsor' | 'hr'> = ['coach', 'coachee', 'sponsor'];
    const signedRoles = updatedSignatures.map(s => s.role);
    const allSigned = requiredRoles.every(r => signedRoles.includes(r));
    
    if (allSigned) {
      await updateDoc(programRef, {
        'agreement.status': 'signed',
        'agreement.completedAt': serverTimestamp(),
        status: 'active',
        currentPhase: 4,
        phasesCompleted: [...(program.phasesCompleted || []), 3],
      });
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
    currentPhase: 2,
    phasesCompleted: [1],
    updatedAt: serverTimestamp(),
  });
}

export async function saveTripartiteMeeting(
  programId: string,
  tripartiteMeeting: TripartiteMeeting
): Promise<void> {
  const docRef = doc(db, 'coaching_programs', programId);
  const programDoc = await getDoc(docRef);
  const program = programDoc.data() as CoachingProgram;
  
  await updateDoc(docRef, {
    tripartiteMeeting: {
      ...tripartiteMeeting,
      completedAt: serverTimestamp(),
    },
    currentPhase: 3,
    phasesCompleted: [...(program.phasesCompleted || []), 2],
    updatedAt: serverTimestamp(),
  });
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
  const programDoc = await getDoc(docRef);
  const program = programDoc.data() as CoachingProgram;
  
  await updateDoc(docRef, {
    sessionCalendar: calendar,
    currentPhase: 5,
    phasesCompleted: [...(program.phasesCompleted || []), 4],
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
    location?: string;
  }
): Promise<string> {
  const sessionRef = doc(collection(db, 'sessions'));
  
  const session: Omit<Session, 'id'> = {
    programId,
    coachId,
    coacheeId,
    coacheeName,
    sessionNumber: data.sessionNumber,
    type: data.type || (data.sessionNumber === 4 ? 'observed' : 'regular'),
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
  
  // Check if we need to generate process report (after session 3)
  const sessionDoc = await getDoc(docRef);
  const session = sessionDoc.data() as Session;
  
  if (session.sessionNumber === 3) {
    await generateProcessReport(session.programId);
  }
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
    currentPhase: 6,
    updatedAt: serverTimestamp(),
  });
  
  
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
    currentPhase: 9,
    updatedAt: serverTimestamp(),
  });
  
  
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
