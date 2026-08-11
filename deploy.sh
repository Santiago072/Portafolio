#!/bin/bash
# ============================================================
# deploy.sh — Script oficial de actualización del Portafolio
# Usar en el VPS: chmod +x deploy.sh && ./deploy.sh
# ============================================================

set -e  # Detiene el script si cualquier comando falla

echo ""
echo "=========================================="
echo " 🚀 Desplegando Portafolio en el VPS..."
echo "=========================================="
echo ""

# Paso 1: Asegurar permisos para evitar conflictos entre Docker y Git
echo "🔒 Ajustando permisos..."
sudo chown -R $USER:$USER .

# Paso 2: Descargar la versión más reciente desde GitHub
echo "⬇️  Obteniendo código desde GitHub (rama main)..."
git fetch origin
git reset --hard origin/main

# Paso 3: Reconstruir imagen y reiniciar contenedor
echo "🐳 Reconstruyendo y levantando contenedor Docker..."
sudo docker compose up -d --build

# Paso 4: Copiar config de Nginx al directorio del sistema
echo "🔧 Actualizando configuración de Nginx..."
sudo cp nginx/portafolio.conf /etc/nginx/sites-available/portafolio.conf
sudo ln -sf /etc/nginx/sites-available/portafolio.conf /etc/nginx/sites-enabled/portafolio.conf
sudo nginx -t && sudo systemctl reload nginx

# Paso 5: Limpiar imágenes obsoletas
echo "🧹 Limpiando imágenes antiguas..."
sudo docker image prune -f

# Paso 6: Mostrar el estado final de los contenedores
echo ""
echo "📊 Estado de los contenedores:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=========================================="
echo " ✅ ¡Despliegue completado con éxito!"
echo "    🌐 App: https://prtf.slscode.online"
echo "=========================================="
echo ""
