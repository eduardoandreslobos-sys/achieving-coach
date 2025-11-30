# 🔧 Configurar GA4 en Cloud Build

## ARCHIVOS A ACTUALIZAR:

### 1. cloudbuild.yaml (Production)
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_API_KEY=${_FIREBASE_API_KEY}'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${_FIREBASE_AUTH_DOMAIN}'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_PROJECT_ID=${_FIREBASE_PROJECT_ID}'
      - '--build-arg'
      - 'NEXT_PUBLIC_GA_ID=G-9J43WG4NL7'  # ← AGREGAR ESTA LÍNEA
      # ... resto
```

### 2. cloudbuild-staging.yaml (Staging)
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCl1IDjT-laldAoGDpxgYj5518urzpcItQ'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=achieving-coach-staging.firebaseapp.com'
      - '--build-arg'
      - 'NEXT_PUBLIC_FIREBASE_PROJECT_ID=achieving-coach-staging'
      - '--build-arg'
      - 'NEXT_PUBLIC_GA_ID=G-9J43WG4NL7'  # ← AGREGAR ESTA LÍNEA
      # ... resto
```

## EJECUTAR ACTUALIZACIÓN:
```bash
cd ~/achieving-coach

# Actualizar cloudbuild.yaml
sed -i '/NEXT_PUBLIC_FIREBASE_PROJECT_ID/a \      - '\''--build-arg'\''\n      - '\''NEXT_PUBLIC_GA_ID=G-9J43WG4NL7'\''' cloudbuild.yaml

# Actualizar cloudbuild-staging.yaml
sed -i '/NEXT_PUBLIC_FIREBASE_PROJECT_ID=achieving-coach-staging/a \      - '\''--build-arg'\''\n      - '\''NEXT_PUBLIC_GA_ID=G-9J43WG4NL7'\''' cloudbuild-staging.yaml

# Commit
git add cloudbuild.yaml cloudbuild-staging.yaml
git commit -m "config: Add GA4 ID to Cloud Build configs"
git push origin feature/organization-model
```
