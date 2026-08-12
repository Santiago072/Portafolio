#!/bin/bash
# ============================================================
# deploy.sh — Actualización del Portafolio en el VPS
# Usar: bash deploy.sh
#
# NOTA: La configuración de Nginx (SSL incluido) se gestiona
# una sola vez durante el setup inicial. Este script solo
# actualiza el código y el contenedor Docker.
# ============================================================

set -e

echo ""
echo "=========================================="
echo " 🚀 Desplegando Portafolio en el VPS..."
echo "=========================================="
echo ""

# Paso 1: Obtener la versión más reciente desde GitHub
echo "⬇️  Obteniendo código desde GitHub (rama main)..."
git fetch origin
git reset --hard origin/main

# Paso 2: Reconstruir imagen y reiniciar contenedor
echo "🐳 Reconstruyendo y levantando contenedor Docker..."
docker compose up -d --build

# Paso 3: Limpiar imágenes obsoletas
echo "🧹 Limpiando imágenes antiguas..."
docker image prune -f

# Paso 4: Estado final
echo ""
echo "📊 Estado del contenedor:"
docker ps --filter "name=portafolio_app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=========================================="
echo " ✅ ¡Despliegue completado con éxito!"
echo "    🌐 App: https://prtf.slscode.online"
echo "=========================================="
echo ""
