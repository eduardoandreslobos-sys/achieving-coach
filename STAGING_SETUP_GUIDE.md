# 🏗️ Guía de Setup - Staging Environment

## Objetivo
Crear un ambiente de pruebas separado de producción para desarrollo seguro.

## Arquitectura Propuesta

### 3 Ambientes

**1. Development (Local)**
- Firebase Emulators
- Next.js dev server (localhost:3000)
- Backend local (localhost:8080)

**2. Staging (Pre-producción)**
- Firebase Project: achieving-coach-staging
- Domain: staging.achievingcoach.com
- Cloud Run: achieving-coach-frontend-staging

**3. Production (Actual)**
- Firebase Project: achieving-coach-dev-1763154191
- Domain: achievingcoach.com
- Cloud Run: achieving-coach-frontend

## Tiempo Estimado
2-4 horas de implementación

## Costo Adicional
~$10-20/mes para ambiente staging

## Próximos Pasos
1. Crear Firebase project staging
2. Configurar Cloud Run staging services
3. Setup branch-based deployments
4. Documentar workflow dev → staging → prod

*Implementar después de decidir si continuar con Sprint 2 primero*
