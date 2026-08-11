FROM nginx:1.25-alpine

# Copiar archivos del portafolio
COPY . /usr/share/nginx/html

# Configuración mínima de Nginx para SPA/static
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
  gzip on; \
  gzip_types text/css application/javascript image/svg+xml; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
