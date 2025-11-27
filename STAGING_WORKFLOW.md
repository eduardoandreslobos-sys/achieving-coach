# 🏗️ Staging Workflow - AchievingCoach

## 📊 Ambientes Configurados

### Development (Local)
- Firebase Emulators
- `npm run dev`
- http://localhost:3000

### Staging (Pre-producción)
- Firebase Project: `achieving-coach-staging`
- Cloud Run: `achieving-coach-frontend-staging`
- Branch: `staging`
- URL: Will be available after first deploy

### Production
- Firebase Project: `achieving-coach-dev-1763154191`
- Cloud Run: `achieving-coach-frontend`
- Branch: `main`
- URL: https://achievingcoach.com

---

## 🔄 Workflow de Desarrollo

### 1. Crear Feature Branch
```bash
git checkout staging
git pull origin staging
git checkout -b feature/your-feature-name

# ... hacer cambios ...

git add .
git commit -m "feat: descripción del cambio"
git push origin feature/your-feature-name
```

### 2. Merge a Staging y Deploy
```bash
# Merge a staging
git checkout staging
git merge feature/your-feature-name
git push origin staging

# Deploy manual a staging (opcional)
./deploy-staging.sh
```

### 3. Testing en Staging
- ✅ Probar todas las funcionalidades nuevas
- ✅ Verificar que no hay regresiones
- ✅ Testing manual completo
- ✅ Verificar logs para errores

### 4. Deploy a Production
```bash
# Solo si staging está OK
git checkout main
git merge staging
git push origin main
# Auto-deploy a producción vía CI/CD
```

---

## 🛠️ Comandos Útiles

### Switch entre Firebase environments
```bash
# Ver ambiente actual
firebase use

# Cambiar a staging
firebase use staging

# Cambiar a production
firebase use production
```

### Deploy manual de Firestore
```bash
# Deploy rules e indexes a staging
firebase use staging
firebase deploy --only firestore

# Deploy rules e indexes a production
firebase use production
firebase deploy --only firestore
```

### Ver logs de Cloud Run
```bash
# Staging
gcloud run services logs read achieving-coach-frontend-staging \
  --region us-central1 --limit 50 --project triple-shift-478220-b2

# Production
gcloud run services logs read achieving-coach-frontend \
  --region us-central1 --limit 50 --project triple-shift-478220-b2
```

### Verificar despliegues
```bash
# Ver último deploy en staging
gcloud run services describe achieving-coach-frontend-staging \
  --region us-central1 --project triple-shift-478220-b2

# Ver último deploy en production
gcloud run services describe achieving-coach-frontend \
  --region us-central1 --project triple-shift-478220-b2
```

---

## 🚨 Reglas de Oro

1. ✅ **NUNCA** hacer commit directo a `main`
2. ✅ **SIEMPRE** probar en `staging` primero
3. ✅ **NUNCA** hacer deploy manual a producción
4. ✅ **SIEMPRE** hacer PR: feature → staging → main
5. ✅ Mantener `staging` sincronizado con `main`
6. ✅ Si staging falla, NO mergear a main
7. ✅ Usar mensajes de commit descriptivos

---

## 📋 Checklist Pre-Deploy a Production

- [ ] Código testeado en staging
- [ ] Sin errores en logs de staging
- [ ] Tests manuales completos
- [ ] Firestore rules actualizadas
- [ ] Variables de entorno correctas
- [ ] Sin regresiones en funcionalidad existente
- [ ] Documentación actualizada

---

*Setup completado el 27 de Noviembre 2025*
