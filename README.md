# Portafolio — Santiago Lizcano Suarez

Portafolio personal de **Santiago Lizcano Suarez**, Tecnólogo en Análisis y Desarrollo de Software.

🌐 **[prtf.slscode.online](https://prtf.slscode.online)**

| Documento | Descripción |
|---|---|
| 📜 [Registro de Cambios](CHANGELOG.md) | Historial de versiones y modificaciones |
| ⚖️ [Licencia MIT](LICENSE) | Términos de uso |

---

## 📋 Descripción

Portafolio web personal construido con HTML, CSS y JavaScript puro. Diseño **Dark Neumorphism 3D** con animaciones de partículas, texto animado con efecto typewriter, glassmorphism y microinteracciones.

---

## 🛠️ Stack

| Tecnología | Uso |
|---|---|
| HTML5 / CSS3 / JavaScript | Frontend estático |
| Docker + Nginx Alpine | Contenedor de producción |
| Nginx (host) | Reverse proxy + SSL |
| Let's Encrypt / Certbot | Certificado HTTPS |

---

## 🚀 Deploy en VPS — Primera vez

### 1. Clonar el repositorio

```bash
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

### 4. Certificar con HTTPS (Let's Encrypt)

```bash
sudo certbot --nginx -d prtf.slscode.online \
  --non-interactive --agree-tos \
  -m santiagolizcanosuarez@gmail.com
```

> Certbot agrega automáticamente el bloque SSL (puerto 443) y la redirección HTTP → HTTPS.

### 5. Verificar renovación automática

```bash
sudo certbot renew --dry-run
```

---

## 🔄 Actualizar (deploys posteriores)

```bash
bash deploy.sh
```

El script hace: `git reset --hard origin/main` → Docker rebuild → Nginx reload → limpieza de imágenes.

---

## 🔒 Seguridad implementada

- Headers HTTP: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`
- `server_tokens off` — oculta versión de Nginx
- HTTPS con HSTS gestionado por Certbot
- `.dockerignore` — la imagen solo contiene `index.html` y `assets/`

---

## ⚙️ Detalles técnicos

- **Puerto VPS**: `8896`
- **Dominio**: `prtf.slscode.online`
- **Contenedor**: `portafolio_app`
- **Red Docker**: `sodicol_network` (externa)
