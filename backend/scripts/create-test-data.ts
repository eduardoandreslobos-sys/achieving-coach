/**
 * Script to create test data for E2E testing
 * Run with: npx ts-node scripts/create-test-data.ts
 */

import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || 'achieving-coach-dev-1763154191';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
  });
}

const auth = admin.auth();
const db = new Firestore({ projectId });

// Get user UIDs
async function getUserUid(email: string): Promise<string | null> {
  try {
    const user = await auth.getUserByEmail(email);
    return user.uid;
  } catch {
    console.log(`User ${email} not found`);
    return null;
  }
}

// Test data with realistic coaching content
const TEST_PROGRAMS = [
  {
    name: 'Programa de Liderazgo Transformacional',
    description: 'Un programa de 12 semanas diseñado para desarrollar habilidades de liderazgo efectivo, comunicación estratégica y gestión de equipos de alto rendimiento.',
    status: 'active',
    phases: [
      { name: 'Fase 1: Autoconocimiento', description: 'Evaluación de fortalezas y áreas de desarrollo' },
      { name: 'Fase 2: Definición de Metas', description: 'Establecimiento de objetivos SMART' },
      { name: 'Fase 3: Desarrollo', description: 'Implementación de estrategias y hábitos' },
      { name: 'Fase 4: Consolidación', description: 'Evaluación de resultados y próximos pasos' },
    ],
    duration: '12 semanas',
    sessionsCompleted: 4,
    totalSessions: 12,
  },
  {
    name: 'Programa de Desarrollo Personal',
    description: 'Coaching integral para alcanzar el equilibrio entre vida personal y profesional, mejorar la productividad y desarrollar resiliencia emocional.',
    status: 'active',
    phases: [
      { name: 'Fase 1: Diagnóstico Inicial', description: 'Evaluación de situación actual' },
      { name: 'Fase 2: Planificación', description: 'Diseño del plan de acción' },
      { name: 'Fase 3: Implementación', description: 'Ejecución y seguimiento' },
    ],
    duration: '8 semanas',
    sessionsCompleted: 2,
    totalSessions: 8,
  },
  {
    name: 'Programa de Transición de Carrera',
    description: 'Acompañamiento profesional para profesionales que buscan un cambio de carrera significativo o emprender nuevos proyectos.',
    status: 'completed',
    phases: [
      { name: 'Fase 1: Exploración', description: 'Identificación de intereses y habilidades transferibles' },
      { name: 'Fase 2: Estrategia', description: 'Desarrollo del plan de transición' },
      { name: 'Fase 3: Acción', description: 'Implementación del cambio' },
    ],
    duration: '10 semanas',
    sessionsCompleted: 10,
    totalSessions: 10,
  },
];

const TEST_GOALS = [
  {
    title: 'Mejorar habilidades de comunicación',
    description: 'Desarrollar técnicas de comunicación asertiva para presentaciones ejecutivas y reuniones de equipo.',
    status: 'in_progress',
    progress: 65,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    milestones: [
      { title: 'Completar curso de oratoria', completed: true },
      { title: 'Practicar 3 presentaciones', completed: true },
      { title: 'Recibir feedback del equipo', completed: false },
    ],
  },
  {
    title: 'Desarrollar liderazgo de equipos',
    description: 'Fortalecer capacidades de liderazgo para gestionar equipos multidisciplinarios y fomentar un ambiente de trabajo colaborativo.',
    status: 'in_progress',
    progress: 40,
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    milestones: [
      { title: 'Realizar evaluación 360°', completed: true },
      { title: 'Implementar reuniones 1:1 semanales', completed: false },
      { title: 'Desarrollar plan de desarrollo del equipo', completed: false },
    ],
  },
  {
    title: 'Equilibrio vida-trabajo',
    description: 'Establecer límites saludables y rutinas que permitan mantener un balance entre responsabilidades profesionales y bienestar personal.',
    status: 'completed',
    progress: 100,
    dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    milestones: [
      { title: 'Definir horarios de desconexión', completed: true },
      { title: 'Establecer rutina de ejercicio', completed: true },
      { title: 'Implementar técnica Pomodoro', completed: true },
    ],
  },
];

const TEST_SESSIONS = [
  {
    title: 'Sesión de inicio - Definición de objetivos',
    description: 'Primera sesión para establecer expectativas, conocer al coachee y definir los objetivos del programa.',
    status: 'completed',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    duration: 60,
    notes: 'Excelente primera sesión. El coachee mostró gran claridad sobre sus objetivos profesionales. Se establecieron 3 metas principales para el trimestre.',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    title: 'Sesión de seguimiento - Revisión de avances',
    description: 'Revisión del progreso en las metas establecidas y ajuste de estrategias según sea necesario.',
    status: 'completed',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    duration: 45,
    notes: 'Buen avance en la meta de comunicación. Se identificaron algunos bloqueos en la gestión del tiempo que abordaremos en la próxima sesión.',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
  },
  {
    title: 'Sesión de trabajo - Técnicas de liderazgo',
    description: 'Exploración de herramientas y técnicas de liderazgo situacional.',
    status: 'scheduled',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    duration: 60,
    notes: '',
    meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
  },
  {
    title: 'Sesión de cierre de fase',
    description: 'Evaluación de la primera fase del programa y planificación de la siguiente etapa.',
    status: 'scheduled',
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    duration: 75,
    notes: '',
    meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
  },
];

const TEST_BLOG_POSTS = [
  {
    title: '5 Claves para Desarrollar un Liderazgo Efectivo',
    slug: '5-claves-liderazgo-efectivo',
    excerpt: 'Descubre las habilidades fundamentales que todo líder debe cultivar para inspirar y guiar a sus equipos hacia el éxito.',
    content: `
# 5 Claves para Desarrollar un Liderazgo Efectivo

El liderazgo efectivo no es un talento innato, sino una habilidad que se desarrolla con práctica y dedicación. Aquí te comparto las cinco claves fundamentales:

## 1. Comunicación Clara y Empática
La comunicación es la base de todo liderazgo. Un líder efectivo sabe transmitir su visión de manera clara y, al mismo tiempo, escucha activamente a su equipo.

## 2. Toma de Decisiones Informada
Los buenos líderes no temen tomar decisiones difíciles. Se informan, analizan opciones y actúan con determinación.

## 3. Desarrollo del Equipo
Un líder verdadero invierte en el crecimiento de sus colaboradores. Identifica fortalezas, proporciona retroalimentación constructiva y crea oportunidades de desarrollo.

## 4. Adaptabilidad
En un mundo cambiante, la flexibilidad es esencial. Los líderes efectivos se adaptan a nuevas circunstancias sin perder de vista sus objetivos.

## 5. Integridad y Coherencia
La confianza se construye con acciones coherentes. Un líder íntegro cumple sus compromisos y actúa de acuerdo con los valores que promueve.

---

*¿Quieres desarrollar estas habilidades? El coaching puede ayudarte a acelerar tu crecimiento como líder.*
    `.trim(),
    status: 'published',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: 'Liderazgo',
    tags: ['liderazgo', 'desarrollo profesional', 'coaching'],
    author: 'Test Coach',
    featuredImage: '/images/blog/leadership.jpg',
  },
  {
    title: 'Cómo Establecer Metas SMART para tu Desarrollo Personal',
    slug: 'metas-smart-desarrollo-personal',
    excerpt: 'Aprende a definir objetivos claros y alcanzables utilizando la metodología SMART para transformar tus sueños en realidad.',
    content: `
# Cómo Establecer Metas SMART para tu Desarrollo Personal

Las metas bien definidas son el primer paso hacia el éxito. La metodología SMART te ayuda a crear objetivos claros y alcanzables.

## ¿Qué significa SMART?

- **S**pecific (Específico): Define exactamente qué quieres lograr
- **M**easurable (Medible): Establece indicadores de progreso
- **A**chievable (Alcanzable): Asegúrate de que sea realista
- **R**elevant (Relevante): Alinea con tus valores y visión
- **T**ime-bound (Con plazo): Define una fecha límite

## Ejemplo Práctico

❌ Meta vaga: "Quiero ser mejor líder"

✅ Meta SMART: "En los próximos 3 meses, completaré un programa de liderazgo, realizaré 6 sesiones de coaching y recibiré feedback de mi equipo para mejorar mi puntuación de liderazgo en un 20%"

## Consejos para el Éxito

1. Escribe tus metas
2. Compártelas con alguien de confianza
3. Revisa tu progreso semanalmente
4. Celebra los pequeños logros
5. Ajusta según sea necesario

---

*El coaching te ayuda a clarificar tus metas y crear un plan de acción efectivo.*
    `.trim(),
    status: 'published',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: 'Desarrollo Personal',
    tags: ['metas', 'productividad', 'desarrollo personal', 'SMART'],
    author: 'Test Coach',
    featuredImage: '/images/blog/goals.jpg',
  },
  {
    title: 'El Poder del Coaching en la Transformación Profesional',
    slug: 'poder-coaching-transformacion-profesional',
    excerpt: 'Descubre cómo el coaching puede acelerar tu crecimiento profesional y ayudarte a alcanzar tu máximo potencial.',
    content: `
# El Poder del Coaching en la Transformación Profesional

El coaching profesional se ha convertido en una herramienta esencial para quienes buscan acelerar su desarrollo y alcanzar sus metas.

## ¿Qué es el Coaching?

El coaching es un proceso de acompañamiento donde un coach certificado te ayuda a:
- Clarificar tus objetivos
- Identificar obstáculos y creencias limitantes
- Desarrollar estrategias efectivas
- Mantener la motivación y el enfoque

## Beneficios Comprobados

- **Mayor claridad**: Define tu visión y propósito
- **Mejor rendimiento**: Aumenta tu productividad y efectividad
- **Desarrollo de habilidades**: Fortalece competencias clave
- **Balance vida-trabajo**: Encuentra el equilibrio que necesitas
- **Toma de decisiones**: Mejora tu capacidad de decidir

## ¿Para quién es el Coaching?

El coaching beneficia a:
- Ejecutivos y directivos
- Profesionales en transición
- Emprendedores
- Cualquier persona comprometida con su crecimiento

---

*Agenda tu sesión de descubrimiento gratuita y descubre cómo el coaching puede transformar tu carrera.*
    `.trim(),
    status: 'published',
    publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    category: 'Coaching',
    tags: ['coaching', 'desarrollo profesional', 'transformación'],
    author: 'Test Coach',
    featuredImage: '/images/blog/coaching.jpg',
  },
  {
    title: 'Técnicas de Gestión del Tiempo para Profesionales Ocupados',
    slug: 'gestion-tiempo-profesionales',
    excerpt: 'Estrategias probadas para maximizar tu productividad y recuperar el control de tu agenda.',
    content: `
# Técnicas de Gestión del Tiempo para Profesionales Ocupados

En un mundo donde el tiempo es nuestro recurso más valioso, aprender a gestionarlo es fundamental.

## La Matriz de Eisenhower

Clasifica tus tareas en cuatro cuadrantes:
1. **Urgente e Importante**: Hazlo ahora
2. **Importante pero No Urgente**: Programa
3. **Urgente pero No Importante**: Delega
4. **Ni Urgente ni Importante**: Elimina

## Técnica Pomodoro

1. Elige una tarea
2. Trabaja 25 minutos sin interrupciones
3. Toma un descanso de 5 minutos
4. Repite 4 veces
5. Toma un descanso largo de 15-30 minutos

## Time Blocking

Reserva bloques de tiempo en tu calendario para:
- Trabajo profundo (sin interrupciones)
- Reuniones y colaboración
- Tareas administrativas
- Tiempo personal

## Consejos Adicionales

- Di "no" más a menudo
- Revisa tu correo solo 2-3 veces al día
- Automatiza tareas repetitivas
- Delega cuando sea posible

---

*¿Necesitas ayuda para implementar estas técnicas? El coaching puede acelerar tu transformación.*
    `.trim(),
    status: 'draft',
    publishedAt: null,
    category: 'Productividad',
    tags: ['productividad', 'gestión del tiempo', 'trabajo'],
    author: 'Test Coach',
    featuredImage: '/images/blog/time.jpg',
  },
];

const TEST_WHEEL_OF_LIFE = {
  areas: [
    { name: 'Carrera/Profesión', score: 7, notes: 'Satisfecho con el progreso, busco más desafíos' },
    { name: 'Finanzas', score: 6, notes: 'Estable, pero quiero mejorar el ahorro' },
    { name: 'Salud', score: 5, notes: 'Necesito más ejercicio y mejor alimentación' },
    { name: 'Familia', score: 8, notes: 'Buenas relaciones, quiero más tiempo de calidad' },
    { name: 'Relaciones Sociales', score: 6, notes: 'Pocas pero buenas amistades' },
    { name: 'Desarrollo Personal', score: 7, notes: 'Activamente aprendiendo' },
    { name: 'Diversión/Ocio', score: 4, notes: 'Necesito más tiempo para hobbies' },
    { name: 'Entorno Físico', score: 7, notes: 'Cómodo con mi espacio de vida' },
  ],
  completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
};

const TEST_GROW_WORKSHEETS = [
  {
    title: 'Mejorar liderazgo de equipo',
    goal: 'Desarrollar un estilo de liderazgo más colaborativo y empoderador en los próximos 3 meses',
    reality: 'Actualmente mi estilo es más directivo. El equipo cumple pero no se siente muy comprometido. Las encuestas de satisfacción muestran un 65% de engagement.',
    options: [
      'Implementar reuniones 1:1 semanales con cada miembro del equipo',
      'Delegar más responsabilidades y dar autonomía',
      'Crear un programa de mentoría interna',
      'Tomar un curso de liderazgo situacional',
    ],
    willDo: 'Empezaré con reuniones 1:1 semanales durante el primer mes. Luego agregaré delegación gradual de proyectos importantes.',
    completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Balance vida-trabajo',
    goal: 'Establecer límites claros entre trabajo y vida personal para reducir el estrés y mejorar mi bienestar',
    reality: 'Trabajo en promedio 55 horas semanales. Reviso correos hasta las 11pm. No hago ejercicio regular. Nivel de estrés: 8/10.',
    options: [
      'Definir una hora de "cierre" diario del trabajo',
      'Desactivar notificaciones de correo después de las 7pm',
      'Bloquear tiempo para ejercicio en el calendario',
      'Contratar ayuda para tareas domésticas',
    ],
    willDo: 'Esta semana: definir 7pm como hora de cierre. Próxima semana: inscribirme en el gimnasio cerca de casa.',
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

async function createTestData() {
  console.log('Creating test data for E2E testing...');
  console.log(`Project ID: ${projectId}\n`);

  // Get user UIDs
  const coachUid = await getUserUid('test-coach@achievingcoach.com');
  const coacheeUid = await getUserUid('test-coachee@achievingcoach.com');

  if (!coachUid || !coacheeUid) {
    console.error('❌ Test users not found. Run create-test-users.ts first.');
    process.exit(1);
  }

  console.log(`Coach UID: ${coachUid}`);
  console.log(`Coachee UID: ${coacheeUid}\n`);

  // Create Programs
  console.log('Creating programs...');
  for (const program of TEST_PROGRAMS) {
    const programRef = db.collection('programs').doc();
    await programRef.set({
      ...program,
      coachId: coachUid,
      coacheeId: coacheeUid,
      coacheeName: 'Test Coachee',
      coachName: 'Test Coach',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✓ Program: ${program.name}`);
  }

  // Create Goals
  console.log('\nCreating goals...');
  for (const goal of TEST_GOALS) {
    const goalRef = db.collection('goals').doc();
    await goalRef.set({
      ...goal,
      userId: coacheeUid,
      coachId: coachUid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✓ Goal: ${goal.title}`);
  }

  // Create Sessions
  console.log('\nCreating sessions...');
  for (const session of TEST_SESSIONS) {
    const sessionRef = db.collection('sessions').doc();
    await sessionRef.set({
      ...session,
      coachId: coachUid,
      coacheeId: coacheeUid,
      coacheeName: 'Test Coachee',
      coachName: 'Test Coach',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✓ Session: ${session.title}`);
  }

  // Create Blog Posts
  console.log('\nCreating blog posts...');
  for (const post of TEST_BLOG_POSTS) {
    const postRef = db.collection('blogPosts').doc();
    await postRef.set({
      ...post,
      authorId: coachUid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`  ✓ Blog post: ${post.title}`);
  }

  // Create Wheel of Life assessment
  console.log('\nCreating Wheel of Life assessment...');
  const wheelRef = db.collection('wheelOfLife').doc();
  await wheelRef.set({
    ...TEST_WHEEL_OF_LIFE,
    userId: coacheeUid,
    coachId: coachUid,
    createdAt: new Date(),
  });
  console.log('  ✓ Wheel of Life assessment');

  // Create GROW worksheets
  console.log('\nCreating GROW worksheets...');
  for (const worksheet of TEST_GROW_WORKSHEETS) {
    const worksheetRef = db.collection('growWorksheets').doc();
    await worksheetRef.set({
      ...worksheet,
      userId: coacheeUid,
      coachId: coachUid,
      createdAt: new Date(),
    });
    console.log(`  ✓ GROW worksheet: ${worksheet.title}`);
  }

  // Create client relationship
  console.log('\nCreating coach-client relationship...');
  const relationshipRef = db.collection('coachClients').doc();
  await relationshipRef.set({
    coachId: coachUid,
    coacheeId: coacheeUid,
    coacheeName: 'Test Coachee',
    coacheeEmail: 'test-coachee@achievingcoach.com',
    status: 'active',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    programCount: 2,
    sessionCount: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log('  ✓ Coach-client relationship');

  // Create messages
  console.log('\nCreating messages...');
  const conversationRef = db.collection('conversations').doc();
  await conversationRef.set({
    participants: [coachUid, coacheeUid],
    participantNames: {
      [coachUid]: 'Test Coach',
      [coacheeUid]: 'Test Coachee',
    },
    lastMessage: 'Perfecto, nos vemos en la próxima sesión.',
    lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  });

  const messages = [
    { text: 'Hola, ¿cómo te fue con las tareas de esta semana?', senderId: coachUid },
    { text: 'Muy bien! Pude completar las reuniones 1:1 con mi equipo.', senderId: coacheeUid },
    { text: 'Excelente, eso es un gran avance. ¿Cómo te sentiste?', senderId: coachUid },
    { text: 'Al principio un poco incómodo, pero mejorando. El equipo pareció apreciarlo.', senderId: coacheeUid },
    { text: 'Es normal sentirse así al inicio. Lo importante es la consistencia.', senderId: coachUid },
    { text: 'Perfecto, nos vemos en la próxima sesión.', senderId: coacheeUid },
  ];

  for (let i = 0; i < messages.length; i++) {
    const messageRef = conversationRef.collection('messages').doc();
    await messageRef.set({
      ...messages[i],
      senderName: messages[i].senderId === coachUid ? 'Test Coach' : 'Test Coachee',
      createdAt: new Date(Date.now() - (messages.length - i) * 60 * 60 * 1000),
      read: true,
    });
  }
  console.log(`  ✓ ${messages.length} messages`);

  console.log('\n✅ All test data created successfully!');
  process.exit(0);
}

createTestData().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
