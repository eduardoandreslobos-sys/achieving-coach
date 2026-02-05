# Estado Actual de AchievingCoach

**Ultima actualizacion:** 5 de Febrero, 2026
**Version:** 0.9.0
**Proyecto GCP:** `triple-shift-478220-b2`
**URL Frontend:** https://achieving-coach-frontend-977373202400.us-central1.run.app
**URL Produccion:** https://achievingcoach.com
**URL Staging:** https://staging-achievingcoach.com

---

## Resumen General

AchievingCoach es una plataforma SaaS profesional de coaching ejecutivo desplegada en Google Cloud Platform con arquitectura serverless. Actualmente tiene **~75% de completitud** con funcionalidades core operativas, sistema de suscripciones, CRM, directorio de coaches, paginas de marketing, firma visual, envio de PDFs por email y sistema de notas compartidas.

**Stack Tecnologico:**
- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** Firebase Firestore
- **Autenticacion:** Firebase Auth
- **Pagos:** Stripe (Checkout + Billing Portal)
- **IA:** Google Gemini 1.5 Flash
- **Email:** Brevo API (transaccional + PDFs)
- **PDF:** jsPDF (generacion de reportes)
- **Analytics:** Google Analytics 4 + Search Console + Microsoft Clarity
- **Infraestructura:** Cloud Run (GCP) - E2_HIGHCPU_32 (32GB RAM)
- **CI/CD:** GitHub Actions + Cloud Build
- **Secrets:** Google Secret Manager
- **Testing:** Jest (207 unit tests) + Playwright (21 E2E tests)

---

## Funcionalidades Implementadas

### 1. Sistema de Autenticacion y Onboarding

| Funcionalidad | Estado | Ruta |
|--------------|--------|------|
| Sign In | Completo | `/sign-in` |
| Sign Up | Completo | `/sign-up` |
| Onboarding | Completo | `/onboarding` |
| Join (invitacion coach) | Completo | `/join/[coachId]` |
| Subscription expired | Completo | `/subscription-expired` |
| Protected Routes | Completo | Componente |
| Subscription Guard | Completo | Componente |
| Feature Gate | Completo | Componente |

---

### 2. Paginas Publicas (Marketing Site)

| Pagina | Estado | Ruta |
|--------|--------|------|
| Home (Landing) | Completo | `/` |
| Features | Completo | `/features` |
| Pricing | Completo | `/pricing` |
| Organizations | Completo | `/organizations` |
| About | Completo | `/about` |
| Contact | Completo | `/contact` |
| Blog | Completo | `/blog` |
| Blog Post | Completo | `/blog/[slug]` |
| Coach Directory | Completo | `/coaches` |
| Coach Profile | Completo | `/coaches/[slug]` |
| Privacy Policy | Completo | `/privacy` |
| Terms of Service | Completo | `/terms` |

---

### 3. Sistema de Suscripciones y Pagos (Stripe)

| Funcionalidad | Estado | Ruta |
|--------------|--------|------|
| Planes de suscripcion | Completo | `/pricing` |
| Checkout (Stripe) | Completo | `/api/stripe/checkout` |
| Billing Portal | Completo | `/api/stripe/portal` |
| Webhooks | Completo | `/api/stripe/webhook` |
| Billing Dashboard | Completo | `/coach/billing` |

**Planes:**
| Plan | Precio Mensual | Precio Anual | Clientes |
|------|---------------|--------------|----------|
| Core | $25/mes | $225/ano (25% dto) | 15 |
| Pro | $40/mes | $360/ano (25% dto) | Ilimitados |
| Enterprise | Custom | Custom | Ilimitados |

**Caracteristicas del Feature Gate:**
- `FeatureGate` - Componente wrapper que muestra/oculta segun plan
- `useFeatureAccess()` - Hook para verificar acceso a features
- Fallbacks: hide, blur, upgrade-prompt
- 70+ feature SKUs definidos por categoria

---

### 4. Coach Dashboard

| Modulo | Estado | Ruta |
|--------|--------|------|
| Dashboard principal | Completo | `/coach` |
| Client list | Completo | `/coach/clients` |
| Client detail (analytics) | Completo | `/coach/clients/[id]` |
| Assign tools | Completo | `/coach/clients/[id]/assign-tools` |
| Client results | Completo | `/coach/clients/[id]/results` |
| ICF Simulator | Completo | `/coach/icf-simulator` |
| ICF Results | Completo | `/coach/icf-simulator/results/[id]` |
| Invite coachees | Completo | `/coach/invite` |
| Profile | Completo | `/coach/profile` |
| Programs (new) | Completo | `/coach/programs/new` |
| Program detail | Completo | `/coach/programs/[programId]` |
| Tools management | Completo | `/coach/tools` |
| Sessions | Completo | `/coach/sessions` |
| Billing | Completo | `/coach/billing` |

**Navegacion del Coach (Sidebar):**
- Principal: Dashboard, Clientes, Herramientas, Invitar Coachees, Simulador ICF
- Comunicacion: Mensajes, Sesiones
- Booking: Reservas, Booking Publico
- CRM: Dashboard, Pipeline, Leads
- Directorio: Configuracion, Consultas
- Cuenta: Perfil, Facturacion

---

### 5. CRM (Customer Relationship Management)

| Modulo | Estado | Ruta |
|--------|--------|------|
| CRM Dashboard | Completo | `/coach/crm` |
| Pipeline Board (Kanban) | Completo | `/coach/crm/pipeline` |
| Leads List | Completo | `/coach/crm/leads` |
| Lead Details | Completo | `/coach/crm/leads/[id]` |

**Etapas del Pipeline (alineadas con Salesforce):**
- Prospecting (10%)
- Qualification (25%)
- Needs Analysis (40%)
- Proposal (60%)
- Negotiation (90%)
- Closed Won (100%)
- Closed Lost (0%)

**Lead Scoring:**
- BANT Qualification (Budget, Authority, Need, Timeline)
- Engagement Score (0-30)
- Fit Score (0-30)
- Total Score (0-100)
- Categorias: Hot (80+), Warm (60-79), Neutral (40-59), Cold (0-39)

**Componentes CRM:**
- `LeadCard.tsx` - Tarjeta resumen de lead
- `LeadScoreBadge.tsx` - Badge de puntuacion
- `PipelineBoard.tsx` - Vista Kanban
- `BANTQualification.tsx` - Evaluacion BANT
- `ActivityTimeline.tsx` - Historial de actividades
- `SalesPath.tsx` - Guia por etapa

---

### 6. Directorio de Coaches

| Modulo | Estado | Ruta |
|--------|--------|------|
| Directorio publico | Completo | `/coaches` |
| Perfil publico coach | Completo | `/coaches/[slug]` |
| Configuracion perfil | Completo | `/coach/directory-settings` |
| Gestion de consultas | Completo | `/coach/inquiries` |

**Campos del perfil publico:**
- Nombre, headline, bio, foto, cover photo
- Especialidades (12+ opciones)
- Certificaciones (ICF ACC/PCC/MCC, CTI CPCC, etc.)
- Idiomas, anos de experiencia
- Precios por sesion y programa
- Disponibilidad por dia
- Ubicacion (ciudad, pais, timezone)
- Audiencia target, industrias, metodologias
- Links sociales (LinkedIn, website, Instagram, video intro)

**Flujo de consultas:**
- New -> Viewed -> Responded -> Converted/Declined
- Captura de datos del prospecto
- Conversion a lead del CRM

---

### 7. Coachee Dashboard

| Modulo | Estado | Ruta |
|--------|--------|------|
| Dashboard principal | Completo | `/dashboard` |
| Goals | Completo | `/goals` |
| Sessions | Completo | `/sessions` |
| Messages | Completo | `/messages` |
| Reflections | Completo | `/reflections` |
| Resources | Completo | `/resources` |
| Programs | Completo | `/programs` |
| Program detail | Completo | `/programs/[programId]` |
| Settings | Completo | `/settings` |

---

### 8. Herramientas de Coaching (12 Tools)

| Herramienta | Ruta | Descripcion |
|-------------|------|-------------|
| DISC Assessment | `/tools/disc` | Perfil conductual (D, I, S, C) |
| Wheel of Life | `/tools/wheel-of-life` | Balance de 8 areas de vida |
| GROW Model | `/tools/grow-model` | Framework Goal-Reality-Options-Will |
| Values Clarification | `/tools/values-clarification` | Priorizacion de valores personales |
| Limiting Beliefs | `/tools/limiting-beliefs` | Transformacion de creencias |
| Resilience Scale | `/tools/resilience-scale` | Medicion de resiliencia |
| Career Compass | `/tools/career-compass` | Orientacion profesional |
| Emotional Triggers | `/tools/emotional-triggers` | Disparadores emocionales |
| Feedback-Feedforward | `/tools/feedback-feedforward` | Retroalimentacion estructurada |
| Habit Loop | `/tools/habit-loop` | Analisis senal-rutina-recompensa |
| Stakeholder Map | `/tools/stakeholder-map` | Mapeo de relaciones |
| ICF Simulator | `/coach/icf-simulator` | Practica competencias ICF (solo coaches) |

---

### 9. Proceso de Coaching Ejecutivo (9 Fases)

| Fase | Nombre | Estado |
|------|--------|--------|
| 1 | Antecedentes Generales | Completo |
| 2 | Reunion Tripartita | Completo |
| 3 | Acuerdo de Coaching | Completo |
| 4 | Calendarizacion | Completo |
| 5 | Sesiones 1-3 | Completo |
| 6 | Reporte de Proceso (IA) | Completo |
| 7 | Sesion Observada | Completo |
| 8 | Sesiones 5-6 | Completo |
| 9 | Informe Final (IA) | Completo |

**Reportes con IA (Google Gemini):**
- Generacion automatica de Reporte de Proceso (Fase 6)
- Generacion automatica de Informe Final (Fase 9)
- Sintesis de temas, fuerzas conservadoras/transformadoras
- Practicas clave, descubrimientos, recomendaciones
- Editable por el coach
- **✨ Exportar a PDF** - Generacion de documentos profesionales
- **✨ Enviar por Email** - Envio directo al coachee via Brevo API

**Firma Visual (Febrero 2026):**
- **✨ Canvas interactivo** para dibujar firma manuscrita
- Soporte touch para dispositivos moviles
- Guardado como imagen base64 PNG
- Visualizacion de firmas en acuerdos

---

### 10. Sistema de Mensajeria

| Funcionalidad | Estado |
|--------------|--------|
| Conversaciones en tiempo real (Firestore onSnapshot) | Completo |
| Lista de conversaciones con busqueda | Completo |
| Auto-seleccion de primera conversacion | Completo |
| Contact picker para nueva conversacion | Completo |
| Indicador de mensajes no leidos | Completo |
| Mark as read automatico | Completo |
| Deduplicacion de conversaciones | Completo |
| Batch fetch de recipientes (optimizado N+1) | Completo |

---

### 11. Gestion de Sesiones

| Funcionalidad | Estado |
|--------------|--------|
| Crear sesion (modal) | Completo |
| Pre-seleccion de coachee desde perfil de cliente | Completo |
| Editar sesion | Completo |
| Eliminar sesion | Completo |
| Cambiar estado (scheduled/completed/cancelled/no-show) | Completo |
| Filtros (todas/proximas/pasadas/canceladas) | Completo |
| Busqueda por nombre/email | Completo |
| Link de reunion (Zoom, Meet, etc.) | Completo |
| Notas pre/post sesion | Completo |
| Notificacion automatica al coachee | Completo |
| Estadisticas (total, proximas, completadas, canceladas) | Completo |

---

### 12. Panel de Administracion

| Modulo | Estado | Ruta |
|--------|--------|------|
| Admin Dashboard | Completo | `/admin` |
| User Management | Completo | `/admin/users` |
| Blog Management | Completo | `/admin/blog` |
| Blog Drafts & Scheduling | Completo | `/admin/blog` |
| Seed Blog | Completo | `/admin/seed-blog` |
| SEO Dashboard (GA4 + Search Console) | Completo | `/admin/seo` |
| Analytics | Completo | `/admin/analytics` |
| Settings | Completo | `/admin/settings` |

---

### 13. SEO y Analytics

| Funcionalidad | Estado |
|--------------|--------|
| Google Analytics 4 integrado | Completo |
| Google Search Console | Completo |
| Microsoft Clarity | Completo |
| GEO Metadata componente | Completo |
| Sitemap dinamico | Completo |
| Blog con SEO optimizado | Completo |
| Post scheduling y auto-publish | Completo |

---

### 14. Seguridad y Compliance

| Funcionalidad | Estado |
|--------------|--------|
| Firebase Auth (email/password) | Completo |
| Firestore Security Rules | Completo |
| Firmas digitales (SHA-256) | Completo |
| GDPR Compliance | Completo |
| CCPA Compliance | Completo |
| HIPAA Considerations | Completo |
| Secret Manager (GCP) | Completo |

---

### 15. Customer Success (Types definidos)

| Funcionalidad | Estado |
|--------------|--------|
| Client Health Score | Types definidos |
| Expansion Opportunities | Types definidos |
| Coach Reviews | Types definidos |
| Referral Program | Types definidos |
| Success Stories | Types definidos |
| NPS Surveys | Types definidos |

---

## Arquitectura CI/CD

### Cloud Build

**Produccion (`cloudbuild.yaml`):**
- Build Docker image del frontend
- Push a Google Container Registry
- Deploy a Cloud Run (`achieving-coach-frontend`)
- Region: us-central1
- Secrets: GA4_CREDENTIALS, GEMINI_API_KEY, CLARITY_API_TOKEN
- **Machine: E2_HIGHCPU_32 (32GB RAM)** - ✨ Actualizado Feb 2026
- Timeout: 1800s

**Staging (`cloudbuild-staging.yaml`):**
- Build con credenciales Firebase de staging
- Deploy a Cloud Run (`achieving-coach-frontend-staging`)
- **Machine: E2_HIGHCPU_32 (32GB RAM)** - ✨ Actualizado Feb 2026

### GitHub Actions

| Workflow | Trigger | Accion |
|----------|---------|--------|
| `deploy-staging.yaml` | Push a `main` | Deploy a staging |
| `deploy-production.yaml` | Manual (workflow_dispatch) | UAT + Deploy a prod |
| `pr-tests.yaml` | Pull requests | Unit tests + build check + UAT |
| `test.yml` | PRs y pushes | Tests con coverage |

### Flujo de Despliegue

```
Push a main → GitHub Actions → Deploy Staging
Manual trigger → UAT en staging → Deploy Produccion
```

---

## Colecciones Firestore

| Coleccion | Descripcion |
|-----------|-------------|
| `users` | Usuarios (coaches, coachees, admins) |
| `goals` | Objetivos de coachees |
| `sessions` | Sesiones de coaching |
| `conversations` | Conversaciones de mensajeria |
| `conversations/{id}/messages` | Mensajes individuales |
| `notifications` | Notificaciones del sistema |
| `coaching_programs` | Programas de coaching |
| `tool_assignments` | Herramientas asignadas |
| `discResults` | Resultados DISC |
| `growSessions` | Sesiones GROW |
| `reflections` | Reflexiones de coachees |
| `blog_posts` | Posts del blog |
| `subscriptions` | Suscripciones activas |
| `billing_history` | Historial de facturas |
| `coaches` | Perfiles publicos de coaches |
| `inquiries` | Consultas del directorio |
| `leads` | Leads del CRM |
| `activities` | Actividades de leads |

---

## API Endpoints

### Next.js API Routes (Frontend)

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/api/ai-report` | POST | Generar reportes con IA (Gemini) |
| `/api/test-gemini` | GET | Test de conexion Gemini |
| `/api/analytics` | GET | Metricas de Analytics |
| `/api/stripe/checkout` | POST | Crear sesion de checkout |
| `/api/stripe/portal` | POST | Portal de billing del cliente |
| `/api/stripe/webhook` | POST | Webhook de Stripe |
| `/api/send-pdf-report` | POST | ✨ Enviar reportes PDF por email (Brevo) |

### Backend Express APIs

| Endpoint | Metodo | Descripcion |
|----------|--------|-------------|
| `/api/v1/auth/signup` | POST | Registro |
| `/api/v1/auth/signin` | POST | Login |
| `/api/v1/users/:id` | GET/PUT | Gestion de usuario |
| `/api/v1/goals` | GET/POST | Objetivos |
| `/api/v1/goals/:id` | PUT/DELETE | Objetivo especifico |
| `/api/v1/grow-sessions` | GET/POST | Sesiones GROW |
| `/api/v1/grow-sessions/:id` | GET | Sesion GROW especifica |

---

## Estructura del Proyecto

```
achieving-coach/
├── frontend/                    # Next.js 14 App
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Auth pages
│   │   │   ├── (dashboard)/    # Dashboard (coach + coachee)
│   │   │   ├── admin/          # Admin panel
│   │   │   ├── api/            # API routes (Stripe, AI, Analytics)
│   │   │   ├── blog/           # Blog publico
│   │   │   ├── coaches/        # Directorio de coaches
│   │   │   ├── pricing/        # Pagina de precios
│   │   │   └── ...             # Otras paginas publicas
│   │   ├── components/         # React components
│   │   │   ├── crm/            # Componentes CRM
│   │   │   ├── directory/      # Componentes directorio
│   │   │   ├── seo/            # Componentes SEO
│   │   │   └── ...
│   │   ├── contexts/           # React contexts (Auth)
│   │   ├── hooks/              # Custom hooks (useFeatureAccess)
│   │   ├── lib/                # Firebase, Stripe, services
│   │   ├── services/           # Business logic services
│   │   ├── types/              # TypeScript types
│   │   ├── config/             # Analytics config
│   │   └── data/               # Static data
│   ├── tests/                  # Playwright + Jest tests
│   ├── Dockerfile              # Docker config
│   └── package.json
│
├── backend/                    # Express API
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Data models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── types/             # TypeScript types
│   ├── Dockerfile             # Docker config
│   └── package.json
│
├── .github/workflows/          # CI/CD pipelines
├── cloudbuild.yaml            # Cloud Build (prod)
├── cloudbuild-staging.yaml    # Cloud Build (staging)
├── firebase.json              # Firebase config
├── firestore.rules            # Security rules
├── firestore.indexes.json     # Firestore indexes
└── package.json               # Root monorepo
```

---

## Metricas de Progreso

### Por Modulo

| Modulo | Progreso | Status |
|--------|----------|--------|
| Autenticacion | 100% | Completo |
| Marketing Site | 100% | Completo |
| Coach Dashboard | 95% | Completo |
| Coachee Dashboard | 90% | Completo |
| Herramientas de Coaching | 80% | 12/16 tools |
| Suscripciones/Pagos (Stripe) | 90% | Completo |
| CRM | 85% | Completo |
| Directorio de Coaches | 85% | Completo |
| Mensajeria | 90% | Completo |
| Sesiones | 95% | Completo |
| Blog + SEO | 90% | Completo |
| Admin Panel | 85% | Completo |
| Backend APIs | 60% | En progreso |
| Testing | 50% | UAT + functional |
| Infraestructura CI/CD | 80% | Completo |

### General
- **Completitud total:** ~75%
- **Frontend:** ~90%
- **Backend:** ~50%
- **Infraestructura:** ~85%
- **Testing:** ~65% (207 unit + 21 E2E tests)

---

## Pendientes

### Infraestructura
- [ ] Backend desplegado en Cloud Run (Dockerfile listo)
- [ ] Cloud CDN configurado
- [ ] Cloud Logging y Monitoring avanzado

### Features Faltantes
- [ ] Notificaciones push (Firebase Cloud Messaging)
- [x] ✅ Email transaccional (Brevo API) - **Completado Feb 2026**
- [ ] Video calls integrados
- [ ] Calendario integrado (Google Calendar sync)
- [ ] Multi-idioma (i18n)
- [ ] Mobile apps (React Native)
- [ ] Booking publico funcional
- [ ] Customer Success dashboards (types definidos, falta UI)

### Herramientas Adicionales
- [ ] Ikigai
- [ ] Competency Matrix
- [ ] 360 Feedback
- [ ] Energy Audit
- [ ] Time Management Matrix

### Testing
- [x] ✅ Unit tests: 207 tests pasando (Jest)
- [x] ✅ E2E tests nuevas features: 21 tests (Playwright)
- [ ] Coverage > 80%
- [ ] E2E tests completos para CRM
- [ ] E2E tests para Stripe flows
- [ ] E2E tests para directorio

---

## Nuevas Funcionalidades (Febrero 2026)

### 1. Notas Compartidas para Coachee
- Vista de sesiones con indicadores de notas compartidas
- Badges visuales: "Acuerdo Compartido", "Informe Compartido"
- Boton "Ver Notas" para acceso directo
- Coach puede activar/desactivar compartir desde detalle de sesion

### 2. Notificaciones de Notas Compartidas
- Nuevo tipo de notificacion: `notes_shared`
- Notificacion automatica cuando coach comparte acuerdo
- Notificacion automatica cuando coach comparte informe
- Icono y color diferenciado (Share2, azul)

### 3. Firma Visual Dibujada
- Componente `SignaturePad` con canvas interactivo
- Soporte para mouse y touch (dispositivos moviles)
- Boton "Limpiar" para reiniciar firma
- Guardado como imagen base64 PNG
- Visualizacion de firmas en acuerdos de programa

### 4. Envio de PDFs por Email
- Generacion de PDFs profesionales (jsPDF)
- Envio via Brevo API con adjuntos
- Soporte para: Reporte de Proceso, Informe Final, Acuerdo
- Boton "Enviar por Email" en cada reporte
- Boton "Exportar PDF" para descarga local

### 5. Infraestructura
- Cloud Build actualizado a E2_HIGHCPU_32 (32GB RAM)
- Tests unitarios: 207 tests pasando
- Tests funcionales Playwright para nuevas features

---

## Problemas Conocidos (Corregidos)

1. ~~No se podia iniciar sesion desde perfil de cliente~~ - CORREGIDO (boton "Nueva Sesion" agregado)
2. ~~No se podian asignar herramientas desde perfil de cliente~~ - CORREGIDO (boton "Asignar Herramientas" agregado)
3. ~~Mensajeria no mostraba historial en primera vista~~ - CORREGIDO (auto-seleccion de primera conversacion)
4. ~~Build fallaba por memoria insuficiente~~ - CORREGIDO (Cloud Build a 32GB RAM)

---

## Informacion del Proyecto

**Proyecto GCP:** `triple-shift-478220-b2`
**Region:** us-central1
**Frontend URL:** https://achieving-coach-frontend-977373202400.us-central1.run.app
**GitHub:** https://github.com/eduardoandreslobos-sys/achieving-coach
**CI/CD:** GitHub Actions + Cloud Build

---

**Ultima actualizacion:** 5 de Febrero, 2026
**Version:** 0.9.0
**Estado:** En desarrollo activo
