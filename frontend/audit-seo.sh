#!/bin/bash

echo "🔍 AUDITORÍA SEO COMPLETA - AchievingCoach"
echo "=========================================="
echo ""

# 1. AUDITORÍA DE IMÁGENES
echo "📸 1. AUDITORÍA DE IMÁGENES"
echo "----------------------------"
echo ""

echo "Buscando etiquetas <img> sin ALT:"
grep -r "<img" src/ --include="*.tsx" --include="*.jsx" | grep -v "alt=" | wc -l
echo ""

echo "Buscando etiquetas <Image> de Next.js sin ALT:"
grep -r "<Image" src/ --include="*.tsx" --include="*.jsx" | grep -v "alt=" | wc -l
echo ""

echo "Archivos de imagen en public/:"
find public/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) | head -20
echo ""

# 2. AUDITORÍA DE METADATA
echo "📄 2. AUDITORÍA DE METADATA POR PÁGINA"
echo "---------------------------------------"
echo ""

echo "Páginas sin metadata export:"
for file in $(find src/app -name "page.tsx"); do
  if ! grep -q "export const metadata" "$file" && ! grep -q "export const generateMetadata" "$file"; then
    echo "❌ $file"
  fi
done
echo ""

# 3. AUDITORÍA DE HEADERS SEMÁNTICOS
echo "📐 3. HEADERS SEMÁNTICOS (H1)"
echo "-----------------------------"
echo ""

echo "Páginas sin H1:"
for file in $(find src/app -name "page.tsx"); do
  if ! grep -q "<h1" "$file"; then
    echo "⚠️  $file"
  fi
done
echo ""

echo "Páginas con múltiples H1:"
for file in $(find src/app -name "page.tsx"); do
  h1_count=$(grep -o "<h1" "$file" | wc -l)
  if [ "$h1_count" -gt 1 ]; then
    echo "❌ $file (${h1_count} H1s)"
  fi
done
echo ""

# 4. AUDITORÍA DE COMPONENTES
echo "🧩 4. COMPONENTES"
echo "-----------------"
echo ""

echo "Total de componentes:"
find src/components -name "*.tsx" -o -name "*.jsx" | wc -l
echo ""

echo "Total de páginas:"
find src/app -name "page.tsx" | wc -l
echo ""

# 5. AUDITORÍA DE ACCESIBILIDAD
echo "♿ 5. ACCESIBILIDAD"
echo "------------------"
echo ""

echo "Botones sin ARIA o texto:"
grep -r "<button" src/ --include="*.tsx" | grep -v "aria-label" | grep -v ">" | head -10
echo ""

echo "Links sin texto descriptivo:"
grep -r "<Link" src/ --include="*.tsx" | grep -v "aria-label" | head -10
echo ""

# 6. PERFORMANCE
echo "⚡ 6. PERFORMANCE"
echo "----------------"
echo ""

echo "Imágenes grandes (>500KB) en public/:"
find public/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -size +500k
echo ""

echo "Scripts sin defer/async:"
grep -r "<script" src/ --include="*.tsx" | grep -v "defer" | grep -v "async" | head -10
echo ""

# 7. ESTRUCTURA DE URLs
echo "🔗 7. ESTRUCTURA DE URLs"
echo "------------------------"
echo ""

echo "Páginas dinámicas [id]:"
find src/app -type d -name "\[*\]"
echo ""

echo "Rutas totales:"
find src/app -name "page.tsx" | sed 's|src/app||' | sed 's|/page.tsx||'
echo ""

echo "✅ Auditoría completa"
