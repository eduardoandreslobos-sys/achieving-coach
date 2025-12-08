import { db } from './firebase';
import { collection, getDocs, addDoc, doc, getDoc, query, where, orderBy, Timestamp, updateDoc, serverTimestamp } from 'firebase/firestore';
import { DISCQuestionGroup, DISCResponse, DISCProfile, DISCResult, DISCScores, DISCCoordinates, DISCProfileInfo } from '@/types/disc';

// Perfil definitions siguiendo el modelo de 16 estilos
const DISC_PROFILES: Record<string, DISCProfileInfo> = {
  'D': {
    code: 'D',
    name: 'Dominante',
    description: 'Directo, decidido y orientado a resultados. Toma el control de situaciones y busca lograr objetivos rápidamente.',
    strengths: ['Toma de decisiones rápida', 'Orientación a resultados', 'Acepta desafíos', 'Liderazgo natural'],
    challenges: ['Puede ser impaciente', 'Tiende a dominar conversaciones', 'Puede ignorar detalles', 'Falta de diplomacia'],
    workStyle: 'Prefiere autonomía, desafíos y resultados medibles. Trabaja mejor con objetivos claros.',
    communication: 'Directo y al grano. Prefiere comunicación concisa y orientada a resultados.',
    motivation: 'Logros, poder, desafíos y control sobre resultados.',
    stressResponse: 'Se vuelve más agresivo y controlador bajo presión.',
  },
  'I': {
    code: 'I',
    name: 'Influyente',
    description: 'Entusiasta, persuasivo y sociable. Inspira y motiva a otros con optimismo y carisma.',
    strengths: ['Excelentes habilidades sociales', 'Entusiasmo contagioso', 'Persuasión natural', 'Optimismo'],
    challenges: ['Puede ser desorganizado', 'Evita detalles', 'Tiende a sobre-prometer', 'Dificultad para decir no'],
    workStyle: 'Prospera en ambientes colaborativos y dinámicos. Prefiere variedad y interacción social.',
    communication: 'Expresivo, amigable y persuasivo. Disfruta contar historias y conectar emocionalmente.',
    motivation: 'Reconocimiento social, popularidad, variedad y oportunidades de influir.',
    stressResponse: 'Busca apoyo social y puede volverse desorganizado bajo presión.',
  },
  'S': {
    code: 'S',
    name: 'Estable',
    description: 'Paciente, leal y colaborador. Busca estabilidad, armonía y prefiere ambientes predecibles.',
    strengths: ['Confiabilidad', 'Paciencia', 'Lealtad', 'Trabajo en equipo', 'Escucha activa'],
    challenges: ['Resistencia al cambio', 'Dificultad para decir no', 'Evita confrontación', 'Lentitud en decisiones'],
    workStyle: 'Prefiere rutinas establecidas, claridad de expectativas y ambientes armoniosos.',
    communication: 'Calmado, empático y diplomático. Prefiere conversaciones personales y sinceras.',
    motivation: 'Estabilidad, apreciación, trabajo en equipo y ayudar a otros.',
    stressResponse: 'Se retrae y busca seguridad. Puede volverse pasivo-agresivo.',
  },
  'C': {
    code: 'C',
    name: 'Concienzudo',
    description: 'Analítico, preciso y sistemático. Valora la calidad, precisión y el seguimiento de estándares.',
    strengths: ['Atención al detalle', 'Análisis profundo', 'Alta calidad', 'Pensamiento crítico'],
    challenges: ['Perfeccionismo excesivo', 'Crítico con otros', 'Lento en decisiones', 'Evita riesgos'],
    workStyle: 'Prefiere trabajar de forma independiente con estándares claros y tiempo para análisis.',
    communication: 'Formal, preciso y basado en datos. Prefiere comunicación escrita y bien estructurada.',
    motivation: 'Calidad, precisión, conocimiento y seguir procedimientos correctos.',
    stressResponse: 'Se vuelve más crítico y perfeccionista. Análisis parálisis.',
  },
  'DI': {
    code: 'DI',
    name: 'Líder Carismático',
    description: 'Combina orientación a resultados con habilidades sociales. Líder dinámico que inspira acción.',
    strengths: ['Liderazgo inspirador', 'Toma decisiones rápidas', 'Excelente comunicador', 'Orientado a resultados'],
    challenges: ['Puede ser impulsivo', 'Ignora detalles', 'Demasiado optimista', 'Impaciente con procesos lentos'],
    workStyle: 'Prospera liderando equipos hacia objetivos ambiciosos en ambientes dinámicos.',
    communication: 'Persuasivo, directo y entusiasta. Motiva a la acción.',
    motivation: 'Logros visibles, reconocimiento público y desafíos de liderazgo.',
    stressResponse: 'Se vuelve más dominante y puede ignorar preocupaciones del equipo.',
  },
  'DC': {
    code: 'DC',
    name: 'Ejecutor Exigente',
    description: 'Orientado a resultados de alta calidad. Combina determinación con estándares rigurosos.',
    strengths: ['Excelencia en ejecución', 'Altos estándares', 'Pensamiento estratégico', 'Resolución efectiva'],
    challenges: ['Muy exigente', 'Puede ser perfeccionista', 'Difícil de complacer', 'Crítico con errores'],
    workStyle: 'Prefiere autonomía con objetivos claros y estándares de calidad definidos.',
    communication: 'Directo, formal y orientado a datos. Espera precisión.',
    motivation: 'Excelencia, eficiencia y logro de resultados de alta calidad.',
    stressResponse: 'Se vuelve más crítico y exigente bajo presión.',
  },
  'IS': {
    code: 'IS',
    name: 'Consejero Amigable',
    description: 'Combina entusiasmo con empatía. Excelente para construir relaciones y apoyar a otros.',
    strengths: ['Empatía natural', 'Habilidades sociales', 'Construcción de relaciones', 'Optimismo'],
    challenges: ['Evita conflictos', 'Dificultad para criticar', 'Puede ser indeciso', 'Desorganización'],
    workStyle: 'Prospera en ambientes colaborativos y de apoyo con interacción personal.',
    communication: 'Cálido, empático y alentador. Escucha activamente.',
    motivation: 'Armonía, relaciones positivas y ayudar a otros a tener éxito.',
    stressResponse: 'Busca apoyo y validación. Puede volverse sobre-complaciente.',
  },
  'SC': {
    code: 'SC',
    name: 'Especialista Detallista',
    description: 'Combina consistencia con precisión. Confiable en mantener estándares y procesos.',
    strengths: ['Consistencia excepcional', 'Atención al detalle', 'Confiabilidad', 'Seguimiento de procesos'],
    challenges: ['Resistencia al cambio', 'Perfeccionismo', 'Lentitud en adaptación', 'Rigidez'],
    workStyle: 'Prefiere rutinas establecidas con procedimientos claros y estándares de calidad.',
    communication: 'Calmado, preciso y estructurado. Prefiere lo escrito.',
    motivation: 'Estabilidad, calidad, procedimientos claros y reconocimiento por exactitud.',
    stressResponse: 'Se aferra más a procedimientos y evita riesgos.',
  },
};

export async function loadDISCQuestions(): Promise<DISCQuestionGroup[]> {
  try {
    const questionsSnapshot = await getDocs(collection(db, 'discQuestions'));
    const questions: DISCQuestionGroup[] = [];
    
    questionsSnapshot.forEach((doc) => {
      questions.push(doc.data() as DISCQuestionGroup);
    });
    
    // Ordenar por groupId
    return questions.sort((a, b) => a.groupId - b.groupId);
  } catch (error) {
    console.error('Error loading DISC questions:', error);
    throw error;
  }
}

export function calculateDISCProfile(responses: DISCResponse[]): DISCProfile {
  // Inicializar scores
  const mostScores: DISCScores = { D: 0, I: 0, S: 0, C: 0 };
  const leastScores: DISCScores = { D: 0, I: 0, S: 0, C: 0 };
  
  // Contar respuestas
  responses.forEach(response => {
    mostScores[response.mostLike]++;
    leastScores[response.leastLike]++;
  });
  
  // Calcular scores finales (Most - Least)
  const scores: DISCScores = {
    D: mostScores.D - leastScores.D,
    I: mostScores.I - leastScores.I,
    S: mostScores.S - leastScores.S,
    C: mostScores.C - leastScores.C,
  };
  
  // Normalizar a valores positivos para gráficos
  const minScore = Math.min(scores.D, scores.I, scores.S, scores.C);
  const normalizedScores: DISCScores = {
    D: scores.D - minScore,
    I: scores.I - minScore,
    S: scores.S - minScore,
    C: scores.C - minScore,
  };
  
  // Calcular porcentajes
  const total = normalizedScores.D + normalizedScores.I + normalizedScores.S + normalizedScores.C;
  const percentages: DISCScores = {
    D: total > 0 ? Math.round((normalizedScores.D / total) * 100) : 25,
    I: total > 0 ? Math.round((normalizedScores.I / total) * 100) : 25,
    S: total > 0 ? Math.round((normalizedScores.S / total) * 100) : 25,
    C: total > 0 ? Math.round((normalizedScores.C / total) * 100) : 25,
  };
  
  // Calcular coordenadas del círculo interpersonal
  // Control (Y-axis): Alto con D, bajo con S
  // Afiliación (X-axis): Alto con I y S, bajo con D y C
  const coordinates: DISCCoordinates = {
    control: ((normalizedScores.D - normalizedScores.S) / Math.max(1, total)) * 100,
    affiliation: ((normalizedScores.I + normalizedScores.S - normalizedScores.D - normalizedScores.C) / Math.max(1, total)) * 100,
  };
  
  // Determinar estilo primario
  const sortedDimensions = (Object.entries(percentages) as [keyof DISCScores, number][])
    .sort(([, a], [, b]) => b - a);
  
  let primaryStyle = sortedDimensions[0][0];
  
  // Si hay dos dimensiones dominantes (diferencia <15%), es un estilo mixto
  if (sortedDimensions[0][1] - sortedDimensions[1][1] < 15) {
    primaryStyle = sortedDimensions[0][0] + sortedDimensions[1][0];
  }
  
  // Obtener información del perfil
  const profileInfo = DISC_PROFILES[primaryStyle] || DISC_PROFILES['D'];
  
  return {
    primaryStyle,
    scores: normalizedScores,
    percentages,
    coordinates,
    profileInfo,
  };
}

export async function saveDISCResult(
  userId: string,
  coachId: string | undefined,
  responses: DISCResponse[],
  profile: DISCProfile
): Promise<string> {
  const result: Omit<DISCResult, 'id'> = {
    userId,
    coachId,
    responses,
    profile,
    completedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, 'discResults'), result);
  return docRef.id;
}


export async function saveDISCResultComplete(
  userId: string,
  userProfile: any,
  responses: DISCResponse[],
  profile: DISCProfile
): Promise<string> {
  const coachId = userProfile?.role === 'coachee' 
    ? userProfile?.coacheeInfo?.coachId 
    : userId;

  // 1. Guardar en discResults (mantener compatibilidad)
  const result: Omit<DISCResult, 'id'> = {
    userId,
    coachId,
    responses,
    profile,
    completedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(collection(db, 'discResults'), result);

  // 2. Guardar en tool_results (para consistencia con otras tools)
  await addDoc(collection(db, 'tool_results'), {
    userId,
    toolId: 'disc',
    toolName: 'DISC Assessment',
    coachId,
    results: {
      primaryStyle: profile.primaryStyle,
      percentages: profile.percentages,
      profileInfo: profile.profileInfo,
      discResultId: docRef.id,
    },
    completedAt: serverTimestamp(),
  });

  // 3. Si es coachee, actualizar assignment y notificar al coach
  if (userProfile?.role === 'coachee' && coachId) {
    const assignmentQuery = query(
      collection(db, 'tool_assignments'),
      where('coacheeId', '==', userId),
      where('toolId', '==', 'disc'),
      where('completed', '==', false)
    );
    
    const assignmentSnapshot = await getDocs(assignmentQuery);
    
    if (!assignmentSnapshot.empty) {
      const assignmentDoc = assignmentSnapshot.docs[0];
      
      await updateDoc(doc(db, 'tool_assignments', assignmentDoc.id), {
        completed: true,
        completedAt: serverTimestamp(),
      });

      await addDoc(collection(db, 'notifications'), {
        userId: coachId,
        type: 'tool_completed',
        title: 'Tool Completed',
        message: `${userProfile.displayName || userProfile.email} completed DISC Assessment`,
        read: false,
        createdAt: serverTimestamp(),
        actionUrl: `/coach/clients/${userId}`,
      });
    }
  }

  return docRef.id;
}

export async function getDISCResult(resultId: string): Promise<DISCResult | null> {
  try {
    const docRef = doc(db, 'discResults', resultId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DISCResult;
    }
    return null;
  } catch (error) {
    console.error('Error getting DISC result:', error);
    return null;
  }
}

export async function getUserDISCResults(userId: string): Promise<DISCResult[]> {
  try {
    const q = query(
      collection(db, 'discResults'),
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DISCResult));
  } catch (error) {
    console.error('Error getting user DISC results:', error);
    return [];
  }
}
