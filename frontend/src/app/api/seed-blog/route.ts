import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Blog posts data
const blogPosts = [
  {
    slug: 'guia-competencias-icf-2024',
    title: 'Guía Completa de las 8 Competencias ICF 2024',
    description: 'Todo lo que necesitas saber sobre el nuevo modelo de competencias de la International Coaching Federation y cómo aplicarlo en tu práctica.',
    category: 'ICF',
    readTime: '12 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    featuredImage: { url: '/blog/icf-competencies.jpg', alt: 'Competencias ICF 2024' },
    content: `
      <h2>Introducción a las Competencias ICF</h2>
      <p>La International Coaching Federation (ICF) actualizó su modelo de competencias centrales en 2019, estableciendo un nuevo estándar para la práctica profesional del coaching ejecutivo. Esta guía te ayudará a comprender y aplicar cada una de las 8 competencias en tu práctica diaria como coach profesional.</p>

      <h2>1. Demuestra Práctica Ética</h2>
      <p>La primera competencia establece la base de toda práctica de coaching profesional. Implica comprender y aplicar consistentemente la ética y los estándares del coaching. Como coach ejecutivo, debes:</p>
      <ul>
        <li>Mantener la confidencialidad con la información del cliente</li>
        <li>Ser transparente sobre las limitaciones del coaching</li>
        <li>Reconocer cuando referir a otros profesionales</li>
        <li>Cumplir con el Código de Ética de ICF</li>
      </ul>

      <h2>2. Encarna una Mentalidad de Coaching</h2>
      <p>Esta competencia se centra en el desarrollo continuo del coach y su capacidad de mantener una mentalidad abierta, curiosa y flexible. El coaching ejecutivo efectivo requiere:</p>
      <ul>
        <li>Práctica reflexiva constante</li>
        <li>Supervisión y mentoría regular</li>
        <li>Apertura al feedback</li>
        <li>Compromiso con el desarrollo profesional continuo</li>
      </ul>

      <h2>3. Establece y Mantiene Acuerdos</h2>
      <p>El éxito del proceso de coaching ejecutivo depende de acuerdos claros. Esta competencia incluye:</p>
      <ul>
        <li>Definir expectativas con todas las partes interesadas</li>
        <li>Establecer objetivos medibles para el proceso</li>
        <li>Acordar la logística de las sesiones</li>
        <li>Revisar y ajustar acuerdos según sea necesario</li>
      </ul>

      <h2>4. Cultiva Confianza y Seguridad</h2>
      <p>La plataforma profesional de coaching ejecutivo se construye sobre la confianza. Para cultivarla:</p>
      <ul>
        <li>Crea un espacio seguro para la exploración</li>
        <li>Demuestra respeto genuino por el cliente</li>
        <li>Mantén consistencia entre palabras y acciones</li>
        <li>Honra la autonomía del cliente en sus decisiones</li>
      </ul>

      <h2>5. Mantiene Presencia</h2>
      <p>La presencia del coach es fundamental en el coaching ejecutivo. Implica:</p>
      <ul>
        <li>Estar completamente presente en cada sesión</li>
        <li>Demostrar curiosidad genuina</li>
        <li>Gestionar las propias emociones</li>
        <li>Confiar en la intuición mientras se mantiene objetividad</li>
      </ul>

      <h2>6. Escucha Activamente</h2>
      <p>La escucha activa va más allá de oír palabras. En el sistema operativo del coaching ejecutivo, significa:</p>
      <ul>
        <li>Atender a lo verbal y no verbal</li>
        <li>Captar emociones, valores y creencias subyacentes</li>
        <li>Distinguir entre hechos, interpretaciones y emociones</li>
        <li>Reflejar para confirmar comprensión</li>
      </ul>

      <h2>7. Evoca Conciencia</h2>
      <p>Esta competencia es el corazón del coaching transformacional. Incluye:</p>
      <ul>
        <li>Formular preguntas poderosas</li>
        <li>Usar herramientas como el Modelo GROW, DISC y Rueda de la Vida</li>
        <li>Invitar a la exploración de perspectivas</li>
        <li>Compartir observaciones sin apego</li>
      </ul>

      <h2>8. Facilita el Crecimiento del Cliente</h2>
      <p>El objetivo final es el desarrollo sostenible del cliente. Como plataforma profesional de coaching, facilitamos:</p>
      <ul>
        <li>Conversión de insights en acciones concretas</li>
        <li>Diseño de metas y planes de acción</li>
        <li>Celebración de progresos</li>
        <li>Desarrollo de autonomía del cliente</li>
      </ul>

      <h2>Aplicación Práctica</h2>
      <p>En AchievingCoach, nuestro sistema operativo de coaching ejecutivo está diseñado para ayudarte a implementar estas competencias de manera consistente. Cada herramienta, desde el simulador ICF hasta las evaluaciones DISC, está alineada con estos estándares profesionales.</p>

      <h2>Conclusión</h2>
      <p>Dominar las 8 competencias ICF es un viaje continuo. Te invitamos a explorar nuestra plataforma profesional de coaching ejecutivo y descubrir cómo AchievingCoach puede apoyar tu desarrollo como coach certificado.</p>
    `,
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    slug: 'estructurar-sesion-coaching',
    title: 'Cómo Estructurar una Sesión de Coaching Efectiva',
    description: 'Aprende el framework de 5 pasos que utilizan los coaches más exitosos para maximizar el impacto de cada sesión.',
    category: 'Guías',
    readTime: '8 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `
      <h2>La Importancia de una Estructura Clara</h2>
      <p>Una sesión de coaching ejecutivo bien estructurada maximiza el tiempo y genera resultados tangibles. Como plataforma profesional de coaching, en AchievingCoach hemos identificado los elementos clave de una sesión efectiva.</p>

      <h2>Paso 1: Apertura y Check-in (5-10 minutos)</h2>
      <p>El inicio de la sesión establece el tono. Incluye:</p>
      <ul>
        <li>Saludo y conexión personal breve</li>
        <li>Revisión de compromisos de la sesión anterior</li>
        <li>Identificación del estado emocional del cliente</li>
        <li>Establecimiento de la agenda de la sesión</li>
      </ul>

      <h2>Paso 2: Exploración del Tema (15-20 minutos)</h2>
      <p>El sistema operativo del coaching ejecutivo requiere exploración profunda:</p>
      <ul>
        <li>Preguntas abiertas para entender el contexto</li>
        <li>Escucha activa de múltiples capas</li>
        <li>Identificación de creencias limitantes</li>
        <li>Clarificación de lo que realmente importa</li>
      </ul>

      <h2>Paso 3: Generación de Insights (10-15 minutos)</h2>
      <p>Aquí es donde ocurre la magia del coaching ejecutivo:</p>
      <ul>
        <li>Preguntas poderosas que generan reflexión</li>
        <li>Uso de herramientas como GROW o Rueda de la Vida</li>
        <li>Desafío respetuoso de supuestos</li>
        <li>Exploración de nuevas perspectivas</li>
      </ul>

      <h2>Paso 4: Planificación de Acción (10-15 minutos)</h2>
      <p>El coaching sin acción es solo conversación:</p>
      <ul>
        <li>Definición de compromisos específicos</li>
        <li>Establecimiento de indicadores de éxito</li>
        <li>Identificación de posibles obstáculos</li>
        <li>Creación de accountability</li>
      </ul>

      <h2>Paso 5: Cierre y Reflexión (5 minutos)</h2>
      <p>Una plataforma profesional de coaching siempre cierra con intención:</p>
      <ul>
        <li>Resumen de aprendizajes clave</li>
        <li>Confirmación de compromisos</li>
        <li>Feedback bidireccional</li>
        <li>Programación de próxima sesión</li>
      </ul>
    `,
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    slug: 'preguntas-poderosas-coaching',
    title: 'El Arte de las Preguntas Poderosas',
    description: 'Descubre técnicas avanzadas para formular preguntas que generen reflexión profunda y catalicen el cambio.',
    category: 'Habilidades',
    readTime: '6 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `
      <h2>¿Qué Hace a una Pregunta "Poderosa"?</h2>
      <p>En el coaching ejecutivo, las preguntas son nuestra herramienta principal. Una pregunta poderosa genera reflexión, desafía supuestos y abre nuevas posibilidades.</p>

      <h2>Características de las Preguntas Poderosas</h2>
      <ul>
        <li><strong>Abiertas:</strong> No pueden responderse con sí/no</li>
        <li><strong>Breves:</strong> Mientras más cortas, más impacto</li>
        <li><strong>Orientadas al futuro:</strong> Crean posibilidades</li>
        <li><strong>Provocativas:</strong> Desafían el pensamiento actual</li>
      </ul>

      <h2>Ejemplos por Categoría</h2>
      <h3>Para Explorar Valores</h3>
      <ul>
        <li>¿Qué es lo más importante para ti en esta situación?</li>
        <li>¿Qué te diría tu yo de 80 años sobre esto?</li>
        <li>¿Qué harías si supieras que no puedes fallar?</li>
      </ul>

      <h3>Para Desafiar Creencias</h3>
      <ul>
        <li>¿Qué evidencia tienes de que eso es cierto?</li>
        <li>¿Qué otra interpretación podría existir?</li>
        <li>¿Qué consejo le darías a alguien en tu situación?</li>
      </ul>

      <h3>Para Generar Acción</h3>
      <ul>
        <li>¿Cuál es el primer paso más pequeño?</li>
        <li>¿Qué necesitas soltar para avanzar?</li>
        <li>¿Qué te comprometería a hacer esto inevitable?</li>
      </ul>
    `,
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    slug: 'coaching-lideres-cambio',
    title: 'Coaching para Líderes en Tiempos de Cambio',
    description: 'Estrategias para apoyar a ejecutivos navegando transformaciones organizacionales complejas.',
    category: 'Liderazgo',
    readTime: '10 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `
      <h2>El Rol del Coach en la Transformación</h2>
      <p>Los tiempos de cambio organizacional son cuando el coaching ejecutivo más valor aporta. Los líderes enfrentan desafíos únicos que requieren apoyo especializado.</p>

      <h2>Desafíos Comunes de los Líderes</h2>
      <ul>
        <li>Gestionar su propia incertidumbre mientras proyectan confianza</li>
        <li>Tomar decisiones con información incompleta</li>
        <li>Mantener equipos motivados ante la ambigüedad</li>
        <li>Equilibrar urgencia con bienestar</li>
      </ul>

      <h2>Framework VUCA para Coaching</h2>
      <h3>Volatilidad → Visión</h3>
      <p>Ayuda al líder a crear una visión clara que sirva como ancla.</p>
      <h3>Incertidumbre → Entendimiento</h3>
      <p>Facilita la exploración de escenarios y la preparación para múltiples futuros.</p>
      <h3>Complejidad → Claridad</h3>
      <p>Simplifica sin simplificar demasiado, encuentra los principios guía.</p>
      <h3>Ambigüedad → Agilidad</h3>
      <p>Desarrolla la capacidad de pivotar y adaptarse rápidamente.</p>
    `,
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28'),
  },
  {
    slug: 'roi-coaching-ejecutivo',
    title: 'Métricas de ROI en Coaching Ejecutivo',
    description: 'Cómo medir y comunicar el retorno de inversión del coaching a stakeholders organizacionales.',
    category: 'Tendencias',
    readTime: '7 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `
      <h2>La Importancia de Medir el ROI</h2>
      <p>El coaching ejecutivo es una inversión significativa para las organizaciones. Demostrar el valor de tu trabajo con datos concretos es esencial.</p>

      <h2>Niveles de Medición</h2>
      <h3>Nivel 1: Satisfacción</h3>
      <ul><li>Encuestas post-sesión</li><li>NPS del proceso</li></ul>
      <h3>Nivel 2: Aprendizaje</h3>
      <ul><li>Cambios en conocimientos</li><li>Evaluaciones pre/post</li></ul>
      <h3>Nivel 3: Comportamiento</h3>
      <ul><li>Cambios observables</li><li>Feedback 360°</li></ul>
      <h3>Nivel 4: Resultados</h3>
      <ul><li>Impacto en KPIs</li><li>Retención de talento</li></ul>

      <h2>Fórmula de ROI</h2>
      <p>ROI = (Beneficios - Costos) / Costos × 100</p>
    `,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    slug: 'preparacion-examen-acc-icf',
    title: 'Preparación para el Examen ACC de ICF',
    description: 'Tips prácticos y recursos para aprobar tu certificación Associate Certified Coach.',
    category: 'ICF',
    readTime: '9 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `
      <h2>¿Qué es la Credencial ACC?</h2>
      <p>La credencial Associate Certified Coach (ACC) de ICF es el primer nivel de certificación internacional para coaches profesionales.</p>

      <h2>Requisitos para ACC</h2>
      <ul>
        <li>60+ horas de formación en coaching</li>
        <li>100+ horas de experiencia de coaching</li>
        <li>10+ horas de mentoría</li>
        <li>Aprobar el examen CKA</li>
      </ul>

      <h2>Estructura del Examen CKA</h2>
      <ul>
        <li>155 preguntas de opción múltiple</li>
        <li>3 horas de duración</li>
        <li>Basado en las 8 competencias ICF</li>
      </ul>

      <h2>El Día del Examen</h2>
      <ul>
        <li>Descansa bien la noche anterior</li>
        <li>Lee cada pregunta cuidadosamente</li>
        <li>Busca la respuesta "más coaching"</li>
        <li>Administra tu tiempo</li>
      </ul>
    `,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    slug: 'herramientas-digitales-coaching',
    title: 'Integrando Herramientas Digitales en tu Práctica',
    description: 'Guía práctica para adoptar tecnología sin perder el toque humano del coaching.',
    category: 'Guías',
    readTime: '5 min',
    published: true,
    author: { name: 'AchievingCoach Team', avatar: null },
    content: `
      <h2>La Transformación Digital del Coaching</h2>
      <p>El coaching ejecutivo moderno combina la conexión humana con herramientas tecnológicas poderosas.</p>

      <h2>Herramientas Esenciales</h2>
      <h3>Gestión de Clientes</h3>
      <ul><li>Perfiles centralizados</li><li>Historial de sesiones</li><li>Seguimiento de progreso</li></ul>
      <h3>Evaluaciones Digitales</h3>
      <ul><li>DISC Assessment</li><li>Rueda de la Vida</li><li>Evaluaciones 360°</li></ul>

      <h2>Beneficios de la Digitalización</h2>
      <ul>
        <li>Ahorro de tiempo administrativo</li>
        <li>Mejor seguimiento del progreso</li>
        <li>Datos para demostrar ROI</li>
        <li>Escalabilidad del negocio</li>
      </ul>

      <h2>Manteniendo el Toque Humano</h2>
      <ul>
        <li>Usa la tecnología para prepararte, no durante la sesión</li>
        <li>Personaliza cada interacción</li>
        <li>Equilibra eficiencia con calidez</li>
      </ul>
    `,
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10'),
  },
];

export async function POST(request: NextRequest) {
  // Check for admin secret or authenticated admin user
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SEED_SECRET || 'seed-blog-2024';

  if (authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { created: string[]; skipped: string[]; errors: string[] } = {
    created: [],
    skipped: [],
    errors: [],
  };

  try {
    for (const post of blogPosts) {
      try {
        // Check if post already exists
        const existingQuery = query(
          collection(db, 'blog_posts'),
          where('slug', '==', post.slug)
        );
        const existingDocs = await getDocs(existingQuery);

        if (!existingDocs.empty) {
          results.skipped.push(post.title);
          continue;
        }

        // Create the post with Timestamp
        await addDoc(collection(db, 'blog_posts'), {
          ...post,
          createdAt: Timestamp.fromDate(post.createdAt),
          updatedAt: Timestamp.fromDate(post.updatedAt),
        });
        results.created.push(post.title);
      } catch (error) {
        results.errors.push(`${post.title}: ${error}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog seed completed',
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to seed blog posts', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST request with Authorization header to seed blog posts',
    example: 'curl -X POST -H "Authorization: Bearer seed-blog-2024" https://achievingcoach.com/api/seed-blog',
  });
}
