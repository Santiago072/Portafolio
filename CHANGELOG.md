# Registro de Cambios (Changelog)

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere al [Versionamiento Semántico](https://semver.org/lang/es/).

---

## [v1.2.0] - 2026-08-12
### Intro Screen animado con GSAP

#### ✨ Nueva característica
- **Pantalla de intro** al cargar la página: animación de 50 triángulos SVG que se expanden y contraen usando GSAP, con overlay de gradiente y etiqueta `<SLS />` pulsante.
- **Secuencia**: fade-in del SVG → spread de triángulos → hold → colapso → fade-out → reveal del portafolio (~6 segundos total).
- Color del trazo adaptado a la paleta del portafolio (`#4d8fff`).
- El `<body>` bloquea el scroll (`overflow: hidden`) durante el intro y lo libera al terminar.
- El nodo del intro se elimina del DOM tras la transición de salida (sin overhead residual).

---

## [v1.1.0] - 2026-08-11

### Seguridad, Infraestructura y Madurez del Repositorio

#### 🔒 Seguridad
- **Headers HTTP de seguridad** en `nginx/portafolio.conf`: `X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy` y `Permissions-Policy` (bloquea cámara, micrófono, geolocalización y pagos).
- **`server_tokens off`**: se oculta la versión de Nginx en las respuestas HTTP.
- **HTTPS con Let's Encrypt**: certificado SSL gratuito obtenido vía Certbot para `prtf.slscode.online`. Redirección automática HTTP → HTTPS gestionada por Certbot.
- **`.dockerignore`**: creado para excluir `.git/`, `nginx/`, `deploy.sh`, `README.md` y documentación de la imagen Docker. Solo `index.html` y `assets/` quedan en el contenedor.

#### 🏗️ Infraestructura
- **`nginx/portafolio.conf`**: archivo de configuración de Nginx como reverse proxy al contenedor Docker (puerto 8896). Incluye cache de 30 días para assets estáticos.
- **`deploy.sh`**: script de despliegue automatizado mejorado (`set -e`, `sudo`, copia automática del config de Nginx, recarga de Nginx y limpieza de imágenes obsoletas).
- **`docker-compose.yml`**: contenedor `portafolio_app` en red `sodicol_network` externa, puerto `8896:80`.

#### 📄 Documentación y Legalidad
- **`LICENSE`**: incorporación de licencia MIT.
- **`CHANGELOG.md`**: este archivo.
- **`.gitignore`**: ajustado al stack real (HTML/CSS/JS estático), eliminando entradas PHP/Node irrelevantes.

#### 🐛 Correcciones
- Footer: año actualizado de 2025 → 2026.
- URL del mensaje final en `deploy.sh` corregida a `prtf.slscode.online`.
- `.gitignore` heredado de proyectos PHP reemplazado por uno específico para sitio estático.

---

## [v1.0.0] - 2026-08-01
### Lanzamiento inicial

#### ✨ Primera versión del portafolio
- Diseño **Dark Neumorphism 3D** con fondo oscuro, glassmorphism y partículas animadas en canvas.
- **Secciones**: Hero, Sobre mí, Skills (marquee animado), Proyectos, Contacto y Footer.
- **Animaciones**: texto con efecto typewriter, esfera 3D con orbitas de tecnologías, orbes de fondo animados, barra de progreso de scroll y microinteracciones en hover.
- **Estadísticas animadas**: contadores con animación al entrar en viewport.
- **Responsive**: diseño adaptado a móvil, tablet y escritorio.
- **SEO**: meta tags, Open Graph y estructura semántica HTML5.
- **Stack**: HTML5, CSS3 vanilla, JavaScript vanilla, Docker + Nginx Alpine.
- **Despliegue**: Docker en VPS con Nginx como reverse proxy en puerto 8896.
- **Dominio**: `prtf.slscode.online`.
