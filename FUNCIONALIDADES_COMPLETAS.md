# AchievingCoach - Inventario Completo de Funcionalidades

**Última actualización:** Enero 2026
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

### Directorio de Coaches
| Página | URL | Descripción |
|--------|-----|-------------|
| Directorio | `/coaches` | Lista pública de coaches |
| Perfil Coach | `/coaches/[slug]` | Perfil público individual |

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

### Gestión de Sesiones (`/coach/sessions`)
- Lista de todas las sesiones programadas
- Filtros: Todas, Próximas, Pasadas, Canceladas
- Búsqueda por nombre o email del coachee
- Estadísticas: Total, Próximas, Completadas, Canceladas

#### Estados de Sesión:
| Estado | Descripción |
|--------|-------------|
| `scheduled` | Sesión programada |
| `in-progress` | Sesión en curso |
| `completed` | Sesión completada |
| `cancelled` | Sesión cancelada |
| `no-show` | Coachee no asistió |

#### Crear Nueva Sesión:
- Seleccionar coachee
- Fecha y hora
- Duración (30, 45, 60, 90, 120 min)
- Link de reunión (Zoom, Meet, etc.)
- Notas

#### Acciones en Lista:
- **Iniciar** - Cambia estado a "en curso" y abre link de reunión
- **Continuar** - Para sesiones en curso, ir al detalle
- **Ver detalle** - Página completa de la sesión
- **Editar** - Modificar estado, link, notas
- **Eliminar** - Borrar sesión

### Detalle de Sesión (`/coach/sessions/[sessionId]`)
Página completa para gestionar una sesión individual:

#### Información:
- Datos del coachee
- Fecha y hora programada
- Duración y link de reunión
- Estado actual con timestamps

#### Acciones:
- **Iniciar Sesión** - Para sesiones programadas
- **Unirse a Reunión** - Abrir link de videollamada
- **Completar Sesión** - Marcar como terminada

#### Pestañas de Contenido:

**1. Resumen:**
- Notas generales
- Timestamps de inicio y fin
- Indicadores de estado

**2. Acuerdo de Sesión (Pre-sesión):**
- Meta del Coachee
- Objetivo de la Sesión
- Indicadores de Éxito
- Obstáculos Identificados
- Recursos Disponibles
- Plan de Acción
- Compromiso

**3. Reporte de Sesión (Post-sesión):**
- Temas Discutidos
- Insights / Descubrimientos
- Acciones a Tomar
- Seguimiento
- Notas del Coach (privadas)

### Gestión de Herramientas (`/coach/tools`)
- Ver todas las herramientas disponibles
- Estadísticas de uso
- Resultados de coachees

### Perfil del Coach (`/coach/profile`)
- Editar información personal
- Foto de perfil
- Credenciales y certificaciones

### Booking (`/coach/bookings` & `/coach/booking`)

#### Reservas (`/coach/bookings`):
- Lista de reservaciones de clientes
- Estado de cada reserva
- Historial de citas

#### Booking Público (`/coach/booking`):
- Configuración de disponibilidad
- Página pública de agendamiento
- Integración con calendario

---

## 🌐 DIRECTORIO DE COACHES (Público)

### Listado de Coaches (`/coaches`)
- Directorio público de coaches publicados
- Filtros por especialidad, ubicación, idioma, precio
- Coaches destacados
- Tarjetas con info resumida

### Perfil Público del Coach (`/coaches/[slug]`)
- Información completa del coach
- Especialidades y certificaciones
- Reviews de clientes
- Videos introductorios
- Enlaces a LinkedIn y sitio web
- **Botón "Contactar"** - Abre formulario de inquietud

### Formulario de Contacto (InquiryForm)
Cuando un visitante hace clic en "Contactar":

| Campo | Obligatorio |
|-------|-------------|
| Nombre | Sí |
| Email | Sí |
| Teléfono | No |
| Áreas de interés | No |
| ¿Cuándo te gustaría empezar? | No |
| Medio de contacto preferido | No |
| Mensaje | Sí |
| Experiencia previa con coaching | No |

---

## 📊 CRM DEL COACH

### Consultas del Directorio (`/coach/inquiries`)
Cuando alguien contacta al coach desde el directorio público:

#### Estados de Consulta:
| Estado | Color | Descripción |
|--------|-------|-------------|
| `new` | Azul | Nueva, no leída |
| `viewed` | Ámbar | Vista por el coach |
| `responded` | Verde | Respondida |
| `converted` | Púrpura | Convertida a Lead |
| `declined` | Rojo | Rechazada |

#### Acciones:
- Ver detalles de la consulta
- Responder (aceptar/rechazar)
- **Convertir a Lead del CRM**

### Dashboard CRM (`/coach/crm`)
- Métricas generales del pipeline
- Valor estimado del pipeline
- Leads por etapa
- Actividad reciente

### Pipeline (`/coach/crm/pipeline`)
- Vista Kanban de leads
- Arrastrar y soltar entre etapas
- Filtros por fuente, score, fecha

### Leads (`/coach/crm/leads`)
Lista completa de leads con:

#### Información del Lead:
- Nombre, email, teléfono
- Empresa y cargo
- Fuente (directory, referral, etc.)
- Etapa en el pipeline
- Score de engagement

#### Etapas del Pipeline:
| Etapa | Probabilidad |
|-------|--------------|
| Prospecting | 10% |
| Qualification | 25% |
| Proposal | 50% |
| Negotiation | 75% |
| Won | 100% |
| Lost | 0% |

#### Flujo Directorio → Lead:
```
Visitante contacta coach desde /coaches/[slug]
        ↓
Se crea Inquietud (coach_inquiries)
        ↓
Coach revisa en /coach/inquiries
        ↓
Coach hace clic "Convertir a Lead"
        ↓
Se crea Lead en CRM con source: "directory"
        ↓
Lead visible en /coach/crm/leads
```

### Configuración del Directorio (`/coach/directory-settings`)
- Activar/desactivar perfil público
- Configurar slug personalizado
- Especialidades y precios
- Fotos y videos
- Testimonios

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
9. **🌐 Directorio Público de Coaches** - Marketplace para encontrar coaches
10. **📊 CRM Integrado** - Pipeline de ventas con leads y conversiones
11. **📅 Gestión de Sesiones** - Iniciar, documentar y completar sesiones con acuerdos y reportes
