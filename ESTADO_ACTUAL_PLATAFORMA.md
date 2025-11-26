# 📊 Estado Actual de AchievingCoach

**Última actualización:** 25 de Noviembre, 2025  
**Proyecto GCP:** `triple-shift-478220-b2`  
**URL Frontend:** https://achieving-coach-frontend-977373202400.us-central1.run.app

---

## 🎯 Resumen General

AchievingCoach es una plataforma profesional de coaching desplegada en Google Cloud Platform con arquitectura serverless. Actualmente tiene **~40% de completitud** con funcionalidades core operativas.

**Stack Tecnológico:**
- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** Firebase Firestore
- **Autenticación:** Firebase Auth
- **Infraestructura:** Cloud Run (GCP)
- **CI/CD:** Cloud Build automatizado con GitHub

---

## ✅ Funcionalidades Implementadas

### 1. Sistema de Autenticación y Onboarding

| Funcionalidad | Estado | Ruta |
|--------------|--------|------|
| Sign In | ✅ | `/sign-in` |
| Sign Up | ✅ | `/sign-up` |
| Onboarding | ✅ | `/onboarding` |
| Join (invitación coach) | ✅ | `/join/[coachId]` |
| Subscription expired | ✅ | `/subscription-expired` |
| Protected Routes | ✅ | Componente |
| Subscription Guard | ✅ | Componente |

**Características:**
- Firebase Auth con email/password
- Flujo de onboarding para coaches y coachees
- Sistema de invitaciones via link
- Guards de suscripción

---

### 2. Coach Dashboard Completo

| Módulo | Estado | Ruta |
|--------|--------|------|
| Dashboard principal | ✅ | `/coach` |
| Client list | ✅ | `/coach/clients` |
| Client detail | ✅ | `/coach/clients/[id]` |
| Assign tools | ✅ | `/coach/clients/[id]/assign-tools` |
| ICF Simulator | ✅ | `/coach/icf-simulator` |
| Invite coachees | ✅ | `/coach/invite` |
| Profile | ✅ | `/coach/profile` |
| Programs (new) | ✅ | `/coach/programs/new` |
| Program detail | ✅ | `/coach/programs/[programId]` |
| Tools management | ✅ | `/coach/tools` |

**Componentes del Dashboard:**
- `ICFCompetencyWheel.tsx` - Rueda de competencias ICF
- `StatsCard.tsx` - Tarjetas de estadísticas
- `ActiveClients.tsx` - Lista de clientes activos
- `UpcomingSessions.tsx` - Próximas sesiones
- `TasksDue.tsx` - Tareas pendientes
- `ReflectiveNotes.tsx` - Notas reflexivas
- `CoachSidebar.tsx` - Navegación lateral

**Características:**
- Vista 360° de clientes
- Asignación de herramientas a coachees
- Simulador de examen ICF
- Sistema de invitaciones
- Gestión de programas de coaching

---

### 3. Coachee Dashboard

| Módulo | Estado | Ruta |
|--------|--------|------|
| Dashboard principal | ✅ | `/dashboard` |
| Goals | ✅ | `/goals` |
| Sessions | ✅ | `/sessions` |
| Messages | ✅ | `/messages` |
| Reflections | ✅ | `/reflections` |
| Resources | ✅ | `/resources` |
| GROW Worksheet | ✅ | `/grow-worksheet` |

**Componentes del Dashboard:**
- `ActiveGoalsWidget.tsx` - Widget de objetivos activos
- `ProgressOverview.tsx` - Resumen de progreso
- `QuickActionsWidget.tsx` - Acciones rápidas
- `RecentActivityFeed.tsx` - Feed de actividad
- `UpcomingSessionCard.tsx` - Próxima sesión
- `DashboardSidebar.tsx` - Navegación lateral
- `GrowWorksheet.tsx` - Hoja de trabajo GROW completa

**Características:**
- Vista personalizada del progreso
- Acceso a herramientas asignadas
- Sistema de mensajería
- Reflexiones y recursos

---

### 4. Herramientas de Coaching (11 Tools)

#### 4.1 DISC Assessment ✅ **[RECIÉN IMPLEMENTADO]**

**Rutas:**
- `/tools/disc` - Evaluación (6.76 kB)
- `/tools/disc/result/[resultId]` - Resultados (6.81 kB)

**Componentes:**
- `DISCAssessment.tsx` - Cuestionario de 10 preguntas
- `DISCResults.tsx` - Página de resultados
- `DISCCircleChart.tsx` - Gráfico círculo interpersonal
- `DISCBarChart.tsx` - Gráfico de barras con perfil

**Características:**
- Cuestionario de elección forzada (most/least)
- 10 grupos de 4 afirmaciones
- Cálculo de 8 perfiles DISC (D, I, S, C, DI, DC, IS, SC)
- Visualización en círculo interpersonal
- Gráfico de barras con línea de perfil
- Guardado en Firestore
- Fortalezas, áreas de desarrollo, estilo de trabajo, comunicación

**Perfiles DISC disponibles:**
1. D - Dominante
2. I - Influyente
3. S - Estable
4. C - Concienzudo
5. DI - Líder Carismático
6. DC - Ejecutor Exigente
7. IS - Consejero Amigable
8. SC - Especialista Detallista

---

#### 4.2 Wheel of Life ✅

**Ruta:** `/tools/wheel-of-life` (71.7 kB)

**Características:**
- Evaluación de 8 áreas de vida
- Visualización en rueda
- Identificación de áreas de mejora

---

#### 4.3 Career Compass ✅

**Ruta:** `/tools/career-compass` (6.29 kB)

**Componentes:**
- `CareerCompassForm.tsx`
- `CareerCompassResults.tsx`

**Características:**
- Evaluación de dirección profesional
- Resultados personalizados

---

#### 4.4 Resilience Scale ✅

**Ruta:** `/tools/resilience-scale` (4.81 kB)

**Componentes:**
- `ResilienceQuestionnaire.tsx`
- `ResilienceResults.tsx`

**Características:**
- Evaluación de resiliencia
- Análisis de resultados

---

#### 4.5 Limiting Beliefs ✅

**Ruta:** `/tools/limiting-beliefs` (3.83 kB)

**Componentes:**
- `BeliefReframeForm.tsx`
- `BeliefReframeResults.tsx`

**Características:**
- Identificación de creencias limitantes
- Ejercicios de reencuadre

---

#### 4.6 Habit Loop ✅

**Ruta:** `/tools/habit-loop` (5.6 kB)

**Componentes:**
- `HabitLoopForm.tsx`
- `HabitAnalysisResults.tsx`

**Características:**
- Análisis del ciclo de hábitos
- Estrategias de cambio

---

#### 4.7 Values Clarification ✅

**Ruta:** `/tools/values-clarification` (4.59 kB)

**Componentes:**
- `ValuesMatrix.tsx`
- `ValuesResults.tsx`

**Características:**
- Identificación de valores personales
- Matriz de priorización

---

#### 4.8 Emotional Triggers ✅

**Ruta:** `/tools/emotional-triggers` (4.3 kB)

**Características:**
- Identificación de triggers emocionales
- Estrategias de manejo

---

#### 4.9 Feedback/Feedforward ✅

**Ruta:** `/tools/feedback-feedforward` (3.77 kB)

**Características:**
- Framework de feedback constructivo
- Práctica de feedforward

---

#### 4.10 Stakeholder Map ✅

**Ruta:** `/tools/stakeholder-map` (3.85 kB)

**Características:**
- Mapeo de stakeholders
- Análisis de relaciones

---

#### 4.11 GROW Worksheet ✅

**Ruta:** `/grow-worksheet` (2.96 kB)

**Componente:** `GrowWorksheet.tsx`

**Características:**
- Framework GROW completo
- Goal, Reality, Options, Will
- Guardado de sesiones

---

### 5. Backend APIs

**Puerto:** 8080  
**Base URL (local):** http://localhost:8080

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/auth/signup` | POST | Registro de usuarios |
| `/api/v1/auth/signin` | POST | Login |
| `/api/v1/users/:id` | GET | Obtener usuario |
| `/api/v1/users/:id` | PUT | Actualizar usuario |
| `/api/v1/goals` | GET | Listar objetivos |
| `/api/v1/goals` | POST | Crear objetivo |
| `/api/v1/goals/:id` | PUT | Actualizar objetivo |
| `/api/v1/goals/:id` | DELETE | Eliminar objetivo |
| `/api/v1/grow-sessions` | GET | Listar sesiones GROW |
| `/api/v1/grow-sessions` | POST | Crear sesión GROW |
| `/api/v1/grow-sessions/:id` | GET | Obtener sesión GROW |

**Archivos Backend:**
```
backend/
├── src/
│   ├── app.ts                    # Configuración Express
│   ├── server.ts                 # Servidor principal
│   ├── config/
│   │   ├── environment.ts        # Variables de entorno
│   │   └── firebase.ts           # Firebase Admin SDK
│   ├── middleware/
│   │   └── auth.ts               # Middleware de autenticación
│   ├── models/
│   │   ├── goal.model.ts         # Modelo de objetivos
│   │   └── GrowSession.ts        # Modelo de sesiones GROW
│   ├── routes/
│   │   ├── auth.routes.ts        # Rutas de autenticación
│   │   ├── goals.routes.ts       # Rutas de objetivos
│   │   ├── growSessions.ts       # Rutas de sesiones GROW
│   │   ├── users.routes.ts       # Rutas de usuarios
│   │   └── index.ts              # Router principal
│   └── services/
│       ├── goals.service.ts      # Lógica de objetivos
│       └── GrowSessionService.ts # Lógica de sesiones GROW
```

---

### 6. Servicios y Librerías

**Frontend Services:**

| Servicio | Archivo | Descripción |
|----------|---------|-------------|
| API Client | `lib/api-client.ts` | Cliente HTTP para backend |
| Firebase | `lib/firebase.ts` | Configuración Firebase |
| Coaching Service | `lib/coachingService.ts` | Lógica de coaching |
| DISC Service | `lib/discService.ts` | Cálculos y guardado DISC |
| Activity Logger | `lib/activityLogger.ts` | Log de actividades |
| Utils | `lib/utils.ts` | Utilidades generales |

**Contexts:**
- `AuthContext.tsx` - Contexto de autenticación

**Types:**
```
types/
├── index.ts              # Exports principales
├── user.ts               # Tipos de usuario
├── coaching.ts           # Tipos de coaching
├── activity.ts           # Tipos de actividad
├── toolAssignment.ts     # Tipos de asignación de herramientas
├── disc.ts               # Tipos DISC
├── resilience.ts         # Tipos resiliencia
├── belief.ts             # Tipos creencias
├── career.ts             # Tipos carrera
├── habit.ts              # Tipos hábitos
└── values.ts             # Tipos valores
```

---

### 7. Testing

**Framework:** Playwright

**Tests UAT implementados:**
```
tests/uat/
├── accessibility.spec.ts           # Tests de accesibilidad
├── coach-assign-tool.spec.ts       # Asignación de herramientas
├── coach-invite-coachee.spec.ts    # Invitación de coachees
├── coach-onboarding.spec.ts        # Onboarding de coach
├── coachee-complete-tool.spec.ts   # Completar herramienta
└── icf-simulator.spec.ts           # Simulador ICF
```

**Comandos:**
```bash
npm run test:uat      # Tests UAT
npm run test:e2e      # Tests E2E
npm run test:all      # Todos los tests
```

---

## 🔄 En Progreso

| Funcionalidad | Progreso | Prioridad |
|---------------|----------|-----------|
| Backend en Cloud Run | 0% | Alta |
| Infraestructura Terraform | 0% | Media |
| CI/CD completo | 50% | Media |
| Marketing Site | 0% | Baja |

---

## ❌ Pendientes

### Infraestructura
- [ ] Backend desplegado en Cloud Run
- [ ] Terraform para infraestructura completa
- [ ] Cloud SQL o Firestore optimizado
- [ ] Cloud CDN configurado
- [ ] Secret Manager para credenciales
- [ ] Cloud Logging y Monitoring

### Features Faltantes
- [ ] Sistema de pagos (Stripe)
- [ ] Notificaciones (email, push)
- [ ] Video calls (integración)
- [ ] Chat en tiempo real
- [ ] Calendario integrado
- [ ] Reportes y analytics avanzados
- [ ] Multi-idioma (i18n)
- [ ] Mobile apps (React Native)

### Marketing Site (6 páginas)
- [ ] Home
- [ ] Features
- [ ] Pricing
- [ ] About
- [ ] Contact
- [ ] Blog

### Herramientas Adicionales
- [ ] Ikigai
- [ ] Competency Matrix
- [ ] 360° Feedback
- [ ] Energy Audit
- [ ] Time Management Matrix

---

## 📦 Estructura del Proyecto
```
achieving-coach/
├── frontend/                    # Next.js App
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Auth pages
│   │   │   ├── (dashboard)/    # Dashboard pages
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts
│   │   ├── lib/                # Services & utils
│   │   ├── types/              # TypeScript types
│   │   └── data/               # Data files
│   ├── public/                 # Static files
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
│   │   ├── app.ts             # Express app
│   │   └── server.ts          # Server entry
│   ├── Dockerfile             # Docker config
│   └── package.json
│
├── tests/                      # Playwright tests
│   ├── uat/                   # User acceptance tests
│   └── e2e/                   # End-to-end tests
│
├── infrastructure/             # (Pendiente)
│   └── terraform/
│
├── cloudbuild.yaml            # Cloud Build config
├── firebase.json              # Firebase config
└── firestore.rules            # Firestore security rules
```

---

## 🔐 Colecciones Firestore

| Colección | Descripción | Campos principales |
|-----------|-------------|-------------------|
| `users` | Usuarios (coaches y coachees) | uid, email, role, displayName |
| `goals` | Objetivos de coachees | userId, coachId, title, status |
| `growSessions` | Sesiones GROW | userId, coachId, goal, reality, options, will |
| `discResults` | Resultados DISC | userId, profile, responses, completedAt |
| `toolAssignments` | Herramientas asignadas | coachId, coacheeId, toolId, status |
| `coaching_programs` | Programas de coaching | coachId, name, description, duration |

---

## 🚀 Comandos Útiles

### Desarrollo Local
```bash
# Frontend
cd frontend
npm install
npm run dev              # http://localhost:3000

# Backend
cd backend
npm install
npm run dev              # http://localhost:8080

# Tests
npm run test:uat
npm run test:all
```

### Build
```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
npm run build
npm start
```

### Deployment
```bash
# Push a GitHub (trigger automático Cloud Build)
git add -A
git commit -m "Feature: descripción"
git push origin main

# Manual Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Ver builds
gcloud builds list --limit=5

# Ver logs de un build
gcloud builds log [BUILD_ID]
```

### Cloud Run
```bash
# Ver servicios
gcloud run services list

# Ver logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=achieving-coach-frontend" --limit 50 --format json

# Actualizar variables de entorno
gcloud run services update achieving-coach-frontend \
  --set-env-vars="KEY=value"
```

---

## 📊 Métricas de Progreso

### Por Módulo

| Módulo | Progreso | Status |
|--------|----------|--------|
| Autenticación | 100% | ✅ Completo |
| Coach Dashboard | 95% | ✅ Completo |
| Coachee Dashboard | 90% | ✅ Completo |
| Herramientas de Coaching | 70% | 🔄 11/16 tools |
| Backend APIs | 60% | 🔄 En progreso |
| Testing | 40% | 🔄 UAT básicos |
| Infraestructura | 30% | ⚠️ Cloud Run manual |
| Marketing Site | 0% | ❌ Pendiente |

### General
- **Completitud total:** ~40%
- **Frontend:** ~65%
- **Backend:** ~50%
- **Infraestructura:** ~30%
- **Testing:** ~40%

---

## 🔧 Decisiones Técnicas Clave

### 1. Next.js App Router
**Por qué:** SSR para SEO, mejor performance, React Server Components

### 2. Firebase Firestore
**Por qué:** Tiempo real, escalable, fácil integración, sin gestión de infraestructura

### 3. Cloud Run
**Por qué:** Serverless, auto-scaling, pay-per-use, fácil deployment

### 4. TypeScript
**Por qué:** Type safety, mejor DX, menos bugs en producción

### 5. Tailwind CSS
**Por qué:** Desarrollo rápido, consistencia, fácil customización

---

## 🐛 Problemas Conocidos

1. **Backend no está en Cloud Run** - Actualmente solo local
2. **No hay sistema de pagos** - Falta integración Stripe
3. **Autenticación básica** - Falta social login (Google, Microsoft)
4. **Sin notificaciones** - Email y push pendientes
5. **Sin analytics** - Falta Google Analytics / Mixpanel

---

## 🎯 Próximos Pasos Sugeridos

### Corto Plazo (1-2 semanas)
1. ✅ Implementar DISC Assessment (COMPLETADO)
2. Deployar Backend en Cloud Run
3. Configurar dominio personalizado
4. Implementar sistema de pagos básico

### Mediano Plazo (1 mes)
1. Completar herramientas faltantes
2. Implementar notificaciones por email
3. Marketing site básico
4. Tests E2E completos

### Largo Plazo (3 meses)
1. Video calls integrados
2. Chat en tiempo real
3. Mobile apps
4. Multi-idioma

---

## 📞 Información del Proyecto

**Proyecto GCP:** `triple-shift-478220-b2`  
**Región:** us-central1  
**Frontend URL:** https://achieving-coach-frontend-977373202400.us-central1.run.app  
**GitHub:** https://github.com/eduardoandreslobos-sys/achieving-coach

**CI/CD:** Automático con Cloud Build al hacer push a `main`

---

## 📝 Notas Importantes

1. **Variables de entorno:** Frontend usa `.env.local` con credenciales Firebase
2. **Firestore rules:** Actualizadas para soportar `coaching_programs`
3. **Build time:** ~5-7 minutos en Cloud Build
4. **Preguntas DISC:** Incluidas en el código como fallback si Firestore vacío

---

**Última actualización:** 25 de Noviembre, 2025  
**Versión:** 0.4.0  
**Estado:** En desarrollo activo
