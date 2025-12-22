# AchievingCoach - Inventario Completo de Funcionalidades

**Última actualización:** Diciembre 2024  
**URL:** https://achievingcoach.com

---

## 🎯 RESUMEN EJECUTIVO

AchievingCoach es una plataforma SaaS de coaching ejecutivo que permite a coaches profesionales gestionar programas completos de coaching siguiendo metodología estructurada de 9 fases, con herramientas de evaluación, reportes auto-generados con IA, y comunicación integrada.

---

## 👥 ROLES DE USUARIO

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **Coach** | Profesional que conduce los programas | Dashboard completo, gestión de clientes |
| **Coachee** | Cliente que recibe el coaching | Dashboard personal, herramientas asignadas |
| **Admin** | Administrador de la plataforma | Blog, SEO, Analytics, Usuarios |

---

## 🌐 PÁGINAS PÚBLICAS (Sin autenticación)

### Landing & Marketing
| Página | URL | Descripción |
|--------|-----|-------------|
| Home | `/` | Landing page principal |
| Features | `/features` | Características de la plataforma |
| Pricing | `/pricing` | Planes y precios |
| Organizations | `/organizations` | Soluciones para empresas |
| About | `/about` | Acerca de AchievingCoach |
| Contact | `/contact` | Formulario de contacto |
| Blog | `/blog` | Artículos y recursos |
| Blog Post | `/blog/[slug]` | Artículo individual |

### Legal
| Página | URL |
|--------|-----|
| Privacy Policy | `/privacy` |
| Terms of Service | `/terms` |

### Autenticación
| Página | URL | Descripción |
|--------|-----|-------------|
| Sign In | `/sign-in` | Inicio de sesión |
| Sign Up | `/sign-up` | Registro de nuevos usuarios |
| Join Coach | `/join/[coachId]` | Link de invitación de coach |
| Onboarding | `/onboarding` | Configuración inicial |

---

## 🧑‍💼 FUNCIONALIDADES DEL COACH

### Dashboard Principal (`/coach`)
- Vista general de todos los clientes
- Estadísticas de sesiones y programas
- Accesos rápidos a funciones principales

### Gestión de Clientes (`/coach/clients`)
- Lista de todos los coachees asignados
- Búsqueda y filtrado
- Estado de cada cliente

### Perfil de Cliente (`/coach/clients/[id]`)
- Información detallada del coachee
- Historial de sesiones
- Progreso en herramientas
- Métricas de avance

### Asignar Herramientas (`/coach/clients/[id]/assign-tools`)
- Seleccionar herramientas para el coachee
- Establecer fechas límite
- Ver estado de completitud

### Invitar Coachees (`/coach/invite`)
- Generar link de invitación único
- Enviar invitaciones por email
- Tracking de invitaciones pendientes

### ICF Simulator (`/coach/icf-simulator`)
- Práctica de competencias ICF
- Escenarios de coaching
- Retroalimentación automática

### Gestión de Herramientas (`/coach/tools`)
- Ver todas las herramientas disponibles
- Estadísticas de uso
- Resultados de coachees

### Perfil del Coach (`/coach/profile`)
- Editar información personal
- Foto de perfil
- Credenciales y certificaciones

---

## 📋 PROCESO DE COACHING EJECUTIVO (Bitácora CE)

### Crear Programa (`/coach/programs/new`)
- Definir título y descripción
- Seleccionar coachee
- Establecer duración y número de sesiones

### Gestión de Programa (`/coach/programs/[programId]`)

#### **9 FASES DEL PROCESO:**

| Fase | Nombre | Descripción |
|------|--------|-------------|
| 1 | **Antecedentes Generales** | Información del coachee, organización, supervisor, HR |
| 2 | **Reunión Tripartita** | 10 preguntas estructuradas con coachee, sponsor y HR |
| 3 | **Acuerdo de Coaching** | Objetivos, responsabilidades, firmas digitales |
| 4 | **Calendarización** | Programar todas las sesiones del proceso |
| 5 | **Sesiones 1-3** | Primeras sesiones con acuerdos y reportes |
| 6 | **Reporte de Proceso** | 🤖 **AUTO-GENERADO CON IA** después de sesión 3 |
| 7 | **Sesión Observada** | Observación del coachee en contexto real de trabajo |
| 8 | **Sesiones 5-6** | Sesiones finales del proceso |
| 9 | **Informe Final** | 🤖 **AUTO-GENERADO CON IA** al completar |

#### Funcionalidades por Fase:

**Fase 1 - Antecedentes:**
- Datos del coachee (nombre, cargo, teléfono, email)
- Datos de la organización
- Datos del supervisor/sponsor
- Datos de HR

**Fase 2 - Reunión Tripartita:**
- 10 preguntas predefinidas basadas en metodología CCC
- Respuestas de coachee, sponsor y HR
- Registro de fecha y lugar

**Fase 3 - Acuerdo de Coaching:**
- Objetivo general del proceso
- Dominios de trabajo
- Resultados esperados
- Competencias a desarrollar
- Indicadores de progreso
- Responsabilidades de cada actor
- **Firma digital con hash SHA-256**
- Aceptación de: confidencialidad, política de asistencia, vigencia

**Fase 4 - Calendario:**
- Tabla con todas las sesiones
- Fecha, hora, lugar para cada una
- Tipo de sesión (regular, observada)

**Fase 5-8 - Sesiones:**
- **Acuerdo de Sesión** (pre-sesión):
  - Enganche con sesión anterior
  - Foco de la sesión
  - Relevancia en el proceso
  - Prácticas a trabajar
  - Indicadores de éxito
  
- **Tabla de Seguimiento** (post-sesión):
  - Tema trabajado
  - Prácticas elegidas
  - Contextos de práctica
  - Indicadores de avance
  - Descubrimientos y aprendizajes
  - Tareas para próxima sesión

**Fase 7 - Sesión Observada:**
- Integrantes de la reunión
- Antecedentes de la reunión
- Hora inicio/término
- Observaciones del setup
- Prácticas observadas
- Áreas de aprendizaje

**Fase 6 & 9 - Reportes con IA:**
- 🤖 **Generación automática con Google Gemini**
- Síntesis de temas centrales
- Análisis de fuerzas conservadoras/transformadoras
- Prácticas clave identificadas
- Descubrimientos relevantes
- Recomendaciones profesionales
- Editable por el coach

---

## 👤 FUNCIONALIDADES DEL COACHEE

### Dashboard (`/dashboard`)
- Resumen de estado actual
- Próximas sesiones
- Herramientas pendientes
- Mensajes recientes

### Mis Programas (`/programs`)
- Lista de programas asignados
- Estado: pendiente, activo, completado
- Indicador de firma pendiente

### Detalle de Programa (`/programs/[programId]`)
- Ver detalles del programa
- **Firmar acuerdo de coaching:**
  - Aceptar confidencialidad
  - Aceptar política de asistencia
  - Aceptar vigencia
  - Firma digital

### Sesiones (`/sessions`)
- Lista de sesiones programadas
- Clasificación: upcoming vs past
- Estado de cada sesión

### Detalle de Sesión (`/sessions/[sessionId]`)
- Ver información de la sesión
- Objetivo y agenda
- Estado de acuerdo y reporte

### Objetivos (`/goals`)
- Crear y gestionar metas personales
- Tracking de progreso
- Fechas límite

### Mensajes (`/messages`)
- Chat con el coach
- Historial de conversaciones
- Notificaciones en tiempo real

### Reflexiones (`/reflections`)
- Diario de reflexiones
- Registro de aprendizajes
- Insights del proceso

### Recursos (`/resources`)
- Material de apoyo
- Documentos compartidos
- Links útiles

### Configuración (`/settings`)
- Editar perfil
- Cambiar contraseña
- Preferencias de notificaciones

---

## 🛠 HERRAMIENTAS DE COACHING (12 Tools)

| Herramienta | URL | Descripción |
|-------------|-----|-------------|
| **DISC Assessment** | `/tools/disc` | Evaluación de perfil conductual (Dominancia, Influencia, Estabilidad, Cumplimiento) |
| **Wheel of Life** | `/tools/wheel-of-life` | Balance de 8 áreas de vida con visualización radar |
| **GROW Model** | `/tools/grow-model` | Framework Goal-Reality-Options-Will para definir objetivos |
| **Values Clarification** | `/tools/values-clarification` | Identificación y priorización de valores personales |
| **Limiting Beliefs** | `/tools/limiting-beliefs` | Transformación de creencias limitantes |
| **Resilience Scale** | `/tools/resilience-scale` | Medición de resiliencia con escala validada |
| **Career Compass** | `/tools/career-compass` | Orientación de carrera y desarrollo profesional |
| **Emotional Triggers** | `/tools/emotional-triggers` | Identificación de disparadores emocionales |
| **Feedback-Feedforward** | `/tools/feedback-feedforward` | Estructura para dar y recibir retroalimentación |
| **Habit Loop** | `/tools/habit-loop` | Análisis de hábitos (señal-rutina-recompensa) |
| **Stakeholder Map** | `/tools/stakeholder-map` | Mapeo de relaciones e influencias |
| **ICF Simulator** | `/coach/icf-simulator` | Práctica de competencias ICF (solo coaches) |

### Características de las Herramientas:
- ✅ Formularios interactivos
- ✅ Guardado automático de resultados
- ✅ Visualizaciones (gráficos, radar charts)
- ✅ Resultados compartidos con coach
- ✅ Historial de completitud
- ✅ Notificación al coach cuando se completa

---

## 🔔 SISTEMA DE NOTIFICACIONES

| Tipo | Descripción |
|------|-------------|
| `message` | Nuevo mensaje recibido |
| `session` | Recordatorio de sesión próxima |
| `program` | Actualización en programa (firma, reporte) |
| `file` | Nuevo archivo compartido |
| `general` | Notificaciones generales |

### Notificaciones Automáticas:
- 🔔 Cuando coachee completa una herramienta
- 🔔 Cuando hay acuerdo pendiente de firma
- 🔔 Cuando se genera reporte con IA
- 🔔 Recordatorios de sesiones

---

## 🤖 INTELIGENCIA ARTIFICIAL (Google Gemini)

### Generación de Reportes
- **Modelo:** Gemini 1.5 Flash
- **Endpoint:** `/api/ai-report`

### Reporte de Proceso (Fase 6):
La IA analiza sesiones 1-3 y genera:
- Síntesis de temas centrales
- Fuerzas conservadoras del coachee
- Fuerzas transformadoras del coachee
- Contexto organizacional
- Prácticas clave desarrolladas
- Descubrimientos relevantes
- Recomendaciones para siguientes sesiones

### Informe Final (Fase 9):
La IA analiza todo el proceso y genera:
- Resumen del punto de partida
- Progreso y logros alcanzados
- Prácticas incorporadas
- Brechas a reforzar
- Recomendaciones de sostenibilidad

### Fallback:
Si la IA falla, el sistema extrae datos manualmente de los reportes de sesión.

---

## 📊 PANEL DE ADMINISTRACIÓN

### Dashboard Admin (`/admin`)
- Estadísticas generales
- Usuarios activos
- Métricas de uso

### Gestión de Usuarios (`/admin/users`)
- Lista de todos los usuarios
- Cambiar roles
- Activar/desactivar cuentas

### Blog (`/admin/blog`)
- Crear/editar posts
- Subir imágenes
- Publicar/despublicar
- Categorías y tipos

### SEO Dashboard (`/admin/seo`)
- **Google Analytics 4:**
  - Usuarios activos
  - Sesiones
  - Páginas vistas
  - Fuentes de tráfico
  
- **Google Search Console:**
  - Keywords
  - Clicks
  - Impresiones
  - CTR
  - Posiciones

- **Auditoría Técnica:**
  - Score SEO (0-100)
  - Errores y warnings
  - Recomendaciones

### Analytics (`/admin/analytics`)
- Métricas detalladas
- Gráficos de tendencias
- Reportes exportables

### Settings (`/admin/settings`)
- Configuración de la plataforma
- Integraciones
- Variables de entorno

---

## 🔐 SEGURIDAD

### Autenticación
- Firebase Authentication
- Email/Password
- Google OAuth
- Tokens seguros

### Firmas Digitales
- Hash SHA-256
- Timestamp de firma
- Términos aceptados registrados
- Verificación de integridad

### Roles y Permisos
- Firestore Security Rules
- Validación por rol
- Acceso basado en ownership

---

## 🔗 API ENDPOINTS

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/ai-report` | POST | Generar reportes con IA |
| `/api/test-gemini` | GET | Test de conexión Gemini |
| `/api/analytics` | GET | Métricas de Analytics |
| `/api/goals` | GET/POST | Gestión de objetivos |
| `/api/goals/[id]` | GET/PUT/DELETE | Objetivo específico |

---

## 📈 MÉTRICAS TÉCNICAS

| Métrica | Valor |
|---------|-------|
| PageSpeed Desktop | 100/100 |
| PageSpeed Mobile | 62/100 |
| SEO Score | 100/100 |
| Accessibility | 100/100 |

---

## 🎨 CARACTERÍSTICAS DE UX/UI

- ✅ Diseño responsive (mobile-first)
- ✅ Dark/Light mode ready
- ✅ Navegación por tabs
- ✅ Indicadores visuales de progreso
- ✅ Loading states
- ✅ Toast notifications
- ✅ Formularios validados
- ✅ Sidebar colapsable
- ✅ Breadcrumbs

---

## 🚀 STACK TECNOLÓGICO

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | TailwindCSS |
| Base de datos | Firebase Firestore |
| Autenticación | Firebase Auth |
| Storage | Firebase Storage |
| AI | Google Gemini 1.5 Flash |
| Analytics | Google Analytics 4 |
| SEO | Google Search Console |
| Hosting | Google Cloud Run |
| CI/CD | GitHub Actions + Cloud Build |
| Secrets | Google Secret Manager |

---

## ✨ DIFERENCIADORES CLAVE

1. **🤖 AI-Powered Reports** - Reportes auto-generados con Gemini
2. **📝 Metodología Estructurada** - 9 fases basadas en CCC
3. **✍️ Firmas Digitales** - Acuerdos con hash SHA-256
4. **🛠 12 Herramientas Profesionales** - DISC, Wheel of Life, GROW, etc.
5. **📊 SEO Dashboard Integrado** - GA4 + Search Console
6. **🔔 Notificaciones en Tiempo Real** - Actualizaciones automáticas
7. **📱 100% Responsive** - Funciona en cualquier dispositivo
8. **🔐 Seguridad Enterprise** - Firebase + GCP
