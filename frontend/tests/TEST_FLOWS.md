# Flujos de Usuario - AchievingCoach (Completo)

## Resumen de Cobertura

| Módulo | Flujos | Estado Tests |
|--------|--------|--------------|
| Autenticación | 8 | ✅ Creados |
| Dashboard | 6 | ✅ Creados |
| Herramientas | 12 | ✅ Creados |
| Mensajería | 5 | ✅ Creados |
| Blog Admin | 9 | ✅ Creados |
| Control Acceso | 7 | ✅ Creados |
| Goals | 6 | 🆕 Por crear |
| Sessions | 8 | 🆕 Por crear |
| Programs | 5 | 🆕 Por crear |
| Reflections | 4 | 🆕 Por crear |
| ICF Simulator | 6 | 🆕 Por crear |
| Coach Clients | 7 | 🆕 Por crear |
| Notifications | 4 | 🆕 Por crear |
| Settings/Profile | 5 | 🆕 Por crear |
| Public Pages | 8 | 🆕 Por crear |
| Integrations | 4 | 🆕 Por crear |

---

## 1. AUTENTICACIÓN (✅ Tests creados)

### 1.1 Sign In
- Página carga correctamente
- Validación de campos vacíos
- Validación de email inválido
- Error con credenciales incorrectas
- Login exitoso redirige según rol
- Remember device funciona

### 1.2 Sign Up
- Página carga correctamente
- Validación de campos requeridos
- Validación de password
- Registro crea usuario
- Verificación de email

### 1.3 Forgot Password
- Página carga correctamente
- Validación de email
- Envío de email de recuperación
- Reset password funciona

### 1.4 Logout
- Cierra sesión correctamente
- Redirige a login
- No puede acceder a rutas protegidas

### 1.5 Onboarding (🆕)
- Primera vez muestra onboarding
- Puede completar perfil
- Selección de rol
- Redirige a dashboard correcto

---

## 2. DASHBOARD (✅ Tests creados)

### 2.1 Coachee Dashboard
- Carga con métricas correctas
- Muestra saludo según hora
- Stats cards: Goals, Sessions, Streak, Tools
- Widget de próximas sesiones
- Widget de herramientas asignadas
- Widget de goals activos

### 2.2 Coach Dashboard
- Carga con analytics
- Selector de rango de tiempo
- Gráfico de sesiones
- Lista de coachees top
- Métricas de engagement
- Exportar a PDF funciona

### 2.3 Admin Dashboard
- Stats de plataforma
- Usuarios totales
- Posts de blog
- Resultados de tools

---

## 3. GOALS (🆕 Por crear tests)

### 3.1 Ver Goals
**Ruta:** `/goals`
- Lista todos los goals del usuario
- Muestra progreso con barra
- Filtra por estado (Active, Completed, Paused)
- Estado vacío si no hay goals

### 3.2 Crear Goal
- Modal de nuevo goal
- Campos: título, descripción, fecha límite
- Validación de campos requeridos
- Guarda en Firestore
- Aparece en lista

### 3.3 Editar Goal
- Click en goal abre editor
- Pre-llena campos existentes
- Puede modificar progreso
- Guarda cambios

### 3.4 Actualizar Progreso
- Slider de progreso (0-100%)
- Auto-completa al llegar a 100%
- Guarda en tiempo real

### 3.5 Cambiar Estado
- Puede pausar goal
- Puede reactivar goal
- Puede marcar como completado

### 3.6 Eliminar Goal
- Confirmación antes de eliminar
- Elimina de Firestore
- Desaparece de lista

---

## 4. SESSIONS (🆕 Por crear tests)

### 4.1 Coachee - Ver Sessions
**Ruta:** `/sessions`
- Tabs: Próximas, Pasadas
- Lista sesiones con fecha/hora
- Muestra nombre del coach
- Estado: Scheduled, Completed, Cancelled

### 4.2 Coachee - Detalle Session
**Ruta:** `/sessions/[id]`
- Información completa de sesión
- Botón "Unirse" si tiene link
- Notas de la sesión
- Historial de sesión

### 4.3 Coach - Gestión Sessions
**Ruta:** `/coach/sessions`
- Calendario mensual navegable
- Crear nueva sesión (modal)
- Editar sesión existente
- Cancelar sesión
- Filtros: All, Upcoming, Past, Cancelled

### 4.4 Coach - Crear Session
- Seleccionar coachee
- Fecha y hora
- Duración
- Notas pre-sesión
- Link de meeting
- Asignar a programa (opcional)

### 4.5 Coach - Notas de Session
- Agregar notas pre-sesión
- Agregar notas post-sesión
- Guardar cambios

### 4.6 Coach - Cancelar Session
- Confirmación de cancelación
- Notifica al coachee
- Actualiza estado

---

## 5. PROGRAMS (🆕 Por crear tests)

### 5.1 Coachee - Ver Programs
**Ruta:** `/programs`
- Lista programas inscritos
- Progreso de cada programa
- Sesiones completadas/totales

### 5.2 Coachee - Detalle Program
**Ruta:** `/programs/[id]`
- Descripción del programa
- Lista de sesiones
- Progreso visual

### 5.3 Coach - Gestión Programs
**Ruta:** `/coach/programs`
- Lista de programas creados
- Crear nuevo programa
- Editar programa
- Ver inscritos

### 5.4 Coach - Crear Program
**Ruta:** `/coach/programs/new`
- Nombre y descripción
- Número de sesiones
- Duración estimada
- Guardar programa

### 5.5 Coach - Asignar Program
- Seleccionar coachee
- Asignar programa
- Definir fecha inicio

---

## 6. REFLECTIONS (🆕 Por crear tests)

### 6.1 Ver Reflections
**Ruta:** `/reflections`
- Lista de reflexiones
- Ordenadas por fecha
- Puede buscar/filtrar

### 6.2 Crear Reflection
- Botón nueva reflexión
- Título y contenido
- Guarda con timestamp

### 6.3 Editar Reflection
- Click abre editor
- Modifica contenido
- Guarda cambios

### 6.4 Eliminar Reflection
- Confirmación
- Elimina de base de datos

---

## 7. ICF SIMULATOR (🆕 Por crear tests)

### 7.1 Iniciar Examen
**Ruta:** `/coach/icf-simulator`
- Botón iniciar examen
- Timer de 60 minutos
- Preguntas de opción múltiple

### 7.2 Responder Preguntas
- Seleccionar respuesta
- Navegar entre preguntas
- Skip/flag preguntas

### 7.3 Temporizador
- Muestra tiempo restante
- Alerta cuando queda poco
- Auto-submit al terminar

### 7.4 Enviar Examen
- Botón enviar
- Confirmación
- Calcula resultados

### 7.5 Ver Resultados
**Ruta:** `/coach/icf-simulator/results/[id]`
- Puntuación total
- Breakdown por competencia
- Breakdown por dominio
- Respuestas correctas/incorrectas

### 7.6 Historial de Intentos
- Lista de exámenes previos
- Comparación de resultados
- Progreso en el tiempo

---

## 8. COACH - CLIENTS (🆕 Por crear tests)

### 8.1 Lista de Clients
**Ruta:** `/coach/clients`
- Lista todos los clientes
- Búsqueda por nombre/email
- Estado: Active, Pending
- Avatar con iniciales

### 8.2 Perfil de Client
**Ruta:** `/coach/clients/[id]`
- Información del cliente
- Tools asignados
- Goals del cliente
- Sessions historial

### 8.3 Asignar Tools
**Ruta:** `/coach/clients/[id]/assign-tools`
- Lista de tools disponibles
- Seleccionar múltiples
- Asignar con fecha límite

### 8.4 Ver Resultados
**Ruta:** `/coach/clients/[id]/results`
- Resultados de tools completados
- Timeline de progreso
- Exportar resultados

### 8.5 Invitar Client
**Ruta:** `/coach/invite`
- Generar link de invitación
- Enviar por email
- Tracking de invitaciones

### 8.6 Coach Profile
**Ruta:** `/coach/profile`
- Editar perfil público
- Foto, bio, especialidades
- Configuración de booking

### 8.7 Coach Bookings
**Ruta:** `/coach/bookings`
- Ver reservas pendientes
- Aprobar/rechazar
- Configurar disponibilidad

---

## 9. NOTIFICATIONS (🆕 Por crear tests)

### 9.1 Notification Bell
- Muestra contador de no leídas
- Click abre panel

### 9.2 Notification Panel
- Lista de notificaciones
- Mark as read
- Link a recurso relacionado

### 9.3 Notification Types
- Nueva sesión agendada
- Tool asignado
- Mensaje recibido
- Goal completado

### 9.4 Mark All Read
- Botón marcar todas leídas
- Actualiza contador

---

## 10. SETTINGS & PROFILE (🆕 Por crear tests)

### 10.1 Profile Settings
**Ruta:** `/settings`
- Editar nombre
- Subir foto de perfil
- Cambiar contraseña

### 10.2 Photo Upload
- Seleccionar imagen
- Preview antes de guardar
- Compresión automática
- Validación de tamaño

### 10.3 Password Change
- Requiere contraseña actual
- Nueva contraseña con confirmación
- Validación de requisitos

### 10.4 Privacy Settings
**Ruta:** `/settings/privacy`
- Toggle data sharing
- CCPA opt-out
- Exportar datos
- Eliminar cuenta

### 10.5 Theme Toggle
- Switch dark/light mode
- Persiste preferencia
- Aplica inmediatamente

---

## 11. PUBLIC PAGES (🆕 Por crear tests)

### 11.1 Home Page
**Ruta:** `/`
- Hero section carga
- Features visibles
- CTAs funcionan
- Demo modal abre

### 11.2 Pricing Page
**Ruta:** `/pricing`
- Planes visibles
- Precios correctos
- CTAs llevan a registro

### 11.3 Features Page
**Ruta:** `/features`
- Lista de features
- Descripciones visibles

### 11.4 About Page
**Ruta:** `/about`
- Info de empresa
- Team/mission visible

### 11.5 Contact Page
**Ruta:** `/contact`
- Formulario de contacto
- Validación de campos
- Envío exitoso

### 11.6 Blog Page
**Ruta:** `/blog`
- Lista posts publicados
- Filtro por categoría
- Búsqueda funciona

### 11.7 Blog Post
**Ruta:** `/blog/[slug]`
- Contenido completo
- Metadata visible
- Posts relacionados

### 11.8 Public Booking
**Ruta:** `/book/[coachId]`
- Calendario de disponibilidad
- Seleccionar fecha/hora
- Completar booking

---

## 12. INTEGRATIONS (🆕 Por crear tests)

### 12.1 Google Calendar
- Conectar cuenta Google
- Ver eventos sincronizados
- Crear eventos desde app
- Actualizar disponibilidad

### 12.2 AI Report Generation
- Generar reporte con Gemini
- Basado en datos de coachee
- Descargable

### 12.3 PDF Export
- Exportar analytics a PDF
- Exportar resultados de tools
- Formato correcto

### 12.4 Cookie Consent
- Banner aparece primera vez
- Opciones: Todas, Necesarias, Configurar
- Guarda preferencia
- No reaparece

---

## 13. ADMIN (Extender tests existentes)

### 13.1 User Management
**Ruta:** `/admin/users`
- Lista todos los usuarios
- Filtrar por rol
- Cambiar rol de usuario
- Suspender/activar

### 13.2 Analytics
**Ruta:** `/admin/analytics`
- Métricas de plataforma
- Gráficos de uso
- Tendencias

### 13.3 SEO Management
**Ruta:** `/admin/seo`
- Configurar meta tags
- Ver Search Console
- Gestionar sitemap

### 13.4 Settings
**Ruta:** `/admin/settings`
- Configuración global
- Feature flags
- Email settings

---

## 14. HERRAMIENTAS - Detalle (Extender)

### Para cada herramienta (12 total):
1. **Wheel of Life** - 8 áreas, sliders, radar chart
2. **DISC Assessment** - Cuestionario, resultados con charts
3. **GROW Model** - 4 secciones texto
4. **Values Clarification** - Ranking de valores
5. **Limiting Beliefs** - Identificar y reframe
6. **Career Compass** - Exploración de carrera
7. **Habit Loop** - Análisis Cue-Routine-Reward
8. **Resilience Scale** - Cuestionario con score
9. **Stakeholder Map** - Mapa visual de relaciones
10. **Feedback Feed-Forward** - Formulario estructurado
11. **Emotional Triggers** - Diario de triggers
12. **Results History** - Ver resultados previos

---

## Prioridad de Tests

### P0 - Crítico (Core Business)
1. ✅ Autenticación completa
2. ✅ Dashboard funcional
3. 🆕 Goals CRUD
4. 🆕 Sessions management
5. ✅ Messaging
6. ✅ Tools funcionando

### P1 - Alta
7. 🆕 ICF Simulator completo
8. 🆕 Coach Clients management
9. 🆕 Programs
10. ✅ Blog admin

### P2 - Media
11. 🆕 Notifications
12. 🆕 Settings/Profile
13. 🆕 Reflections
14. 🆕 Public pages

### P3 - Baja
15. 🆕 Integrations (Calendar, AI)
16. 🆕 Admin avanzado
17. Performance testing
18. Accessibility testing

---

## Comandos de Test

```bash
# Tests existentes
npm run test:functional           # Todos
npm run test:functional:auth      # Autenticación
npm run test:functional:dashboard # Dashboard
npm run test:functional:tools     # Herramientas
npm run test:functional:messaging # Mensajería
npm run test:functional:blog      # Blog
npm run test:functional:access    # Acceso

# Tests nuevos (por crear)
npm run test:functional:goals     # Goals
npm run test:functional:sessions  # Sessions
npm run test:functional:programs  # Programs
npm run test:functional:icf       # ICF Simulator
npm run test:functional:clients   # Coach Clients
npm run test:functional:public    # Public Pages
```
