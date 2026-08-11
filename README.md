# Portafolio – Santiago Lizcano Suarez

Portafolio personal de **Santiago Lizcano Suarez**, Tecnólogo en Análisis y Desarrollo de Software.

🌐 **[portafolio.slscode.online](https://portafolio.slscode.online)**

## 📋 Descripción

Portafolio web personal construido con HTML, CSS y JavaScript puro. Diseño "Dark Neumorphism 3D" con animaciones de partículas, texto animado, glassmorphism y microinteracciones.

## 🛠️ Stack

- HTML5 / CSS3 / JavaScript (vanilla)
- Docker + Nginx Alpine
- Puerto VPS: **8896**
- Dominio: **portafolio.slscode.online**
- Red Docker: `sodicol_network` (compartida con demás sistemas)

## 🚀 Deploy en VPS — Primera vez (setup completo)

### 1. Clonar el repo en el VPS

```bash
cd /home/ubuntu   # o la carpeta donde tienes los proyectos
git clone https://github.com/Santiago072/Portafolio
cd Portafolio
chmod +x deploy.sh
```

### 2. Copiar config de Nginx y habilitar el sitio

```bash
sudo cp nginx/portafolio.conf /etc/nginx/sites-available/portafolio.conf
sudo ln -sf /etc/nginx/sites-available/portafolio.conf /etc/nginx/sites-enabled/portafolio.conf
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Levantar el contenedor Docker

```bash
sudo docker compose up -d --build
```

### 4. Certificar con HTTPS usando Certbot (Let's Encrypt)

```bash
sudo certbot --nginx -d portafolio.slscode.online --non-interactive --agree-tos -m santiagolizcanosuarez@gmail.com
```

> ✅ Certbot modifica automáticamente el archivo de Nginx para agregar el bloque SSL (443) y la redirección HTTP→HTTPS.

### 5. Verificar renovación automática del certificado

```bash
sudo certbot renew --dry-run
```

## 🔄 Actualizaciones posteriores

```bash
# En el VPS, dentro del directorio del proyecto:
bash deploy.sh
```

El script hace: permisos → `git reset --hard origin/main` → `docker compose up -d --build` → recarga Nginx.

## 🌐 Puertos y dominios del VPS (todos los sistemas)

| Sistema         | Puerto | Dominio                             |
|-----------------|--------|-------------------------------------|
| Sistema Sodicol | 8891   | sistemasodicol.slscode.online       |
| Sistema PQRS    | 8892   | sistemapqrs.slscode.online          |
| Módulo CRUD FE  | 8893   | modulocrud.slscode.online           |
| Módulo CRUD API | 8894   | modulocrud.slscode.online/api       |
| Portafolio      | 8896   | portafolio.slscode.online           |
