/* ========================
   PARTICLES (mouse-interactive)
======================== */
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: -9999, y: -9999 };

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 1.8 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.a  = Math.random() * 0.5 + 0.1;
  }
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(77,143,255,${this.a})`;
    ctx.fill();
  };
  Particle.prototype.update = function () {
    // gentle mouse repulsion
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      this.vx += dx / dist * 0.3;
      this.vy += dy / dist * 0.3;
    }
    // damping
    this.vx *= 0.99; this.vy *= 0.99;
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  };

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(77,143,255,${0.08 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ========================
   SCROLL PROGRESS BAR
======================== */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docH * 100) + '%';
});

/* ========================
   NAVBAR SCROLL
======================== */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

/* ========================
   MOBILE MENU
======================== */
const navToggle  = document.getElementById('nav-toggle');
const navLinksEl = document.getElementById('nav-links');
navToggle.addEventListener('click', () => navLinksEl.classList.toggle('open'));
navLinksEl.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinksEl.classList.remove('open'))
);

/* ========================
   SPHERE MOUSE PARALLAX
======================== */
const heroVisual = document.getElementById('hero-visual');
if (heroVisual) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    heroVisual.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    heroVisual.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
  });
  heroVisual.style.transition = 'transform 0.15s ease-out';
}

/* ========================
   TYPED TEXT
======================== */
let phrases = [
  'Desarrollador Web',
  'Sistemas con PHP y MySQL',
  'HTML, CSS y JavaScript',
  'Python y Reportes en PDF',
  'Docker y Servidores Linux'
];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeLoop() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    typedEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typedEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 55 : 85);
}
typeLoop();

/* ========================
   SCROLL FADE-IN (staggered)
======================== */
document.querySelectorAll(
  '.about-card, .skill-card, .project-card, .contact-card, .section-header'
).forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));



/* ========================
   COUNTER ANIMATION
======================== */
function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const isPercent = target === 100;
  const timer = setInterval(() => {
    current += target / 60;
    if (current >= target) {
      el.textContent = target + (isPercent ? '%' : '+');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + (isPercent ? '%' : '+');
    }
  }, 18);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-stats').forEach(s => statsObserver.observe(s));

/* ========================
   PROJECT CARD 3D TILT
======================== */
document.querySelectorAll('.project-card').forEach(card => {
  card.style.transformStyle = 'preserve-3d';
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ========================
   INTERNATIONALIZATION (i18n) — ES / EN
======================== */
const phrasesEs = [
  'Desarrollador Web',
  'Sistemas con PHP y MySQL',
  'HTML, CSS y JavaScript',
  'Python y Reportes en PDF',
  'Docker y Servidores Linux'
];

const phrasesEn = [
  'Web Developer',
  'PHP & MySQL Systems',
  'HTML, CSS & JavaScript',
  'Python & PDF Reports',
  'Docker & Linux Servers'
];

const translations = {
  es: {
    'nav.about': 'Sobre mí',
    'nav.skills': 'Habilidades',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    'hero.badge': 'Disponible para proyectos',
    'hero.greeting': 'Hola, soy',
    'hero.desc': 'Estudiante de Análisis y Desarrollo de Software. Creo sistemas web prácticos, claros y pensados para facilitar el trabajo diario.',
    'hero.btnProjects': 'Ver Proyectos',
    'hero.btnCV': 'Ver / Descargar CV',
    'hero.btnContact': 'Contactar',
    'about.title1': 'Sobre',
    'about.title2': 'Mí',
    'about.card1Title': '¿Quién soy?',
    'about.card1Desc': 'Estudiante de Análisis y Desarrollo de Software en el SENA. Me gusta crear sistemas web útiles, bien organizados y fáciles de manejar para las personas que los usan en su trabajo diario.',
    'about.card2Title': '¿Qué hago?',
    'about.card2Desc': 'Desarrollo aplicaciones web con PHP, MySQL, HTML, CSS, JavaScript y Python. Armo desde las pantallas y la base de datos hasta la descarga de documentos en PDF o Excel y la puesta en marcha en servidores Linux con Docker.',
    'about.card3Title': 'Mi forma de trabajar',
    'about.card3Desc': 'Procuro entender bien lo que necesita cada negocio, cuidar los detalles y probar cada función con calma para entregar un sistema claro, seguro y sin complicaciones.',
    'about.stat1': 'Proyectos\nDesarrollados',
    'about.stat2': 'Herramientas\nde Trabajo',
    'about.stat3': '% Dedicación\nen cada entrega',
    'skills.title1': 'Lo que',
    'skills.title2': 'Manejo',
    'projects.title1': 'Mis',
    'projects.title2': 'Proyectos',
    'projects.p1Title': 'Módulo CRUD — Registro de Encuestas',
    'projects.p1Desc': 'Aplicación web para registrar encuestas y datos de contacto desde el celular o computador, incluso sin conexión a internet, guardando la información para enviarla después y exportarla a Excel.',
    'projects.p2Title': 'Sistema Impobiomedical',
    'projects.p2Desc': 'Sistema web para una empresa de equipos biomédicos: permite crear cotizaciones calculando precios e impuestos, organizar el catálogo de productos con fotos, llevar clientes y proveedores, emitir órdenes de compra y descargar documentos en PDF y Excel.',
    'projects.p3Title': 'Sistema de Gestión de Datos',
    'projects.p3Desc': 'Herramienta web para organizar y revisar los reportes de evaluación de aprendices del SENA descargados de Sofia Plus. Lee archivos Excel y PDF para mostrar el avance de cada ficha, el estado de los aprendices y gráficas de resumen.',
    'projects.p4Title': 'Sistema Sodicol',
    'projects.p4Desc': 'Aplicación web para elaborar y consultar cotizaciones comerciales, administrar el listado de productos y clientes, controlar el acceso de los usuarios y generar los formatos listos en PDF.',
    'projects.p5Title': 'Sistema PQRS',
    'projects.p5Desc': 'Sistema web para recibir y dar respuesta a peticiones, quejas, reclamos y sugerencias. Permite radicar solicitudes, hacer seguimiento al estado de cada caso, enviar avisos por correo y descargar reportes en PDF.',
    'contact.title1': '¿Hablamos?',
    'contact.title2': 'Contacto',
    'contact.subtitle': '¿Tienes un proyecto en mente o quieres trabajar juntos? ¡Escríbeme!',
    'contact.emailTitle': 'Correo Electrónico',
    'contact.waTitle': 'WhatsApp',
    'contact.ghTitle': 'GitHub',
    'footer.designedBy': 'Diseñado y desarrollado por',
    'footer.role': 'Tecnólogo en Análisis y Desarrollo de Software'
  },
  en: {
    'nav.about': 'About me',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.badge': 'Available for projects',
    'hero.greeting': 'Hi, I am',
    'hero.desc': 'Software Analysis & Development student. I build practical, clear web systems designed to make daily work easier.',
    'hero.btnProjects': 'View Projects',
    'hero.btnCV': 'View / Download CV',
    'hero.btnContact': 'Get in Touch',
    'about.title1': 'About',
    'about.title2': 'Me',
    'about.card1Title': 'Who am I?',
    'about.card1Desc': 'Software Analysis and Development student at SENA. I enjoy building useful, well-organized, and easy-to-use web systems for everyday work.',
    'about.card2Title': 'What do I do?',
    'about.card2Desc': 'I build web applications with PHP, MySQL, HTML, CSS, JavaScript, and Python—from screens and databases to PDF/Excel reports and deployment on Linux servers with Docker.',
    'about.card3Title': 'How I work',
    'about.card3Desc': 'I focus on understanding what each business needs, paying attention to detail, and testing carefully to deliver clear, secure, and reliable systems.',
    'about.stat1': 'Built\nProjects',
    'about.stat2': 'Working\nTools',
    'about.stat3': '% Dedication\nin every project',
    'skills.title1': 'What I',
    'skills.title2': 'Use',
    'projects.title1': 'My',
    'projects.title2': 'Projects',
    'projects.p1Title': 'CRUD Module — Survey Recording',
    'projects.p1Desc': 'Web application for recording surveys and contact details from a phone or computer, even without internet, saving data to send later and export to Excel.',
    'projects.p2Title': 'Impobiomedical System',
    'projects.p2Desc': 'Web system for a biomedical equipment company: builds quotes with price and tax calculations, manages a product catalog with photos, tracks clients and suppliers, issues purchase orders, and exports PDF and Excel documents.',
    'projects.p3Title': 'Academic Data Management System',
    'projects.p3Desc': 'Web tool to organize and review SENA apprentice evaluation reports from Sofia Plus. Reads Excel and PDF files to display group progress, student status, and summary charts.',
    'projects.p4Title': 'Sodicol System',
    'projects.p4Desc': 'Web application for creating and consulting commercial quotes, managing product and client lists, controlling user access, and generating ready-to-use PDF documents.',
    'projects.p5Title': 'PQRS System',
    'projects.p5Desc': 'Web system for receiving and answering inquiries, complaints, claims, and suggestions. Tracks case status, sends email notices, and exports PDF reports.',
    'contact.title1': 'Let’s talk?',
    'contact.title2': 'Contact',
    'contact.subtitle': 'Do you have a project in mind or want to collaborate? Send me a message!',
    'contact.emailTitle': 'Email Address',
    'contact.waTitle': 'WhatsApp',
    'contact.ghTitle': 'GitHub',
    'footer.designedBy': 'Designed and developed by',
    'footer.role': 'Software Analysis & Development Technologist'
  }
};

let currentLang = localStorage.getItem('portafolio_lang') || 'es';

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('portafolio_lang', lang);
  
  // Actualizar frases del typed text
  phrases = (lang === 'en') ? phrasesEn : phrasesEs;
  pIdx = 0;
  cIdx = 0;
  deleting = false;

  const currentLangText = document.getElementById('current-lang-text');
  if (currentLangText) {
    currentLangText.textContent = lang === 'es' ? 'EN' : 'ES';
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (translations[lang][key].includes('\n')) {
        el.innerHTML = translations[lang][key].replace('\n', '<br/>');
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}

const langToggleBtn = document.getElementById('lang-toggle-btn');
if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    const newLang = currentLang === 'es' ? 'en' : 'es';
    updateLanguage(newLang);
  });
}

// Inicializar idioma guardado
updateLanguage(currentLang);

