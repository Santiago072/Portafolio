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
  'PHP & Arquitectura MVC',
  'React & PWA Offline',
  'Python & Flask Dev',
  'MySQL & Docker',
  'Full Stack Developer'
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
  'PHP & Arquitectura MVC',
  'React & PWA Offline',
  'Python & Flask Dev',
  'MySQL & Docker',
  'Full Stack Developer'
];

const phrasesEn = [
  'Web Developer',
  'PHP & MVC Architecture',
  'React & Offline PWA',
  'Python & Flask Dev',
  'MySQL & Docker',
  'Full Stack Developer'
];

const translations = {
  es: {
    'nav.about': 'Sobre mí',
    'nav.skills': 'Skills',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    'hero.badge': 'Disponible para proyectos',
    'hero.greeting': 'Hola, soy',
    'hero.desc': 'Tecnólogo en Análisis y Desarrollo de Software apasionado por crear soluciones web robustas, eficientes y escalables.',
    'hero.btnProjects': 'Ver Proyectos',
    'hero.btnCV': 'Ver / Descargar CV',
    'hero.btnContact': 'Contactar',
    'about.title1': 'Sobre',
    'about.title2': 'Mí',
    'about.card1Title': '¿Quién soy?',
    'about.card1Desc': 'Tecnólogo en Análisis y Desarrollo de Software con sólida experiencia en programación, bases de datos y arquitecturas web. Me especializo en construir aplicaciones funcionales, escalables y bien estructuradas que resuelven problemas reales.',
    'about.card2Title': '¿Qué hago?',
    'about.card2Desc': 'Desarrollo aplicaciones web de punta a punta usando PHP, Python con Flask, MySQL, HTML, CSS, JavaScript y React. Implemento soluciones con Docker y gestiono despliegues en entornos de producción sobre VPS.',
    'about.card3Title': 'Mi enfoque',
    'about.card3Desc': 'Perfil proactivo, autodidacta y orientado a la resolución de problemas. Me adapto con facilidad a nuevos retos tecnológicos y trabajo con atención al detalle para entregar soluciones limpias y de calidad.',
    'about.stat1': 'Proyectos\nCompletados',
    'about.stat2': 'Tecnologías\nDominadas',
    'about.stat3': '% Compromiso\nen cada proyecto',
    'skills.title1': 'Mis',
    'skills.title2': 'Skills',
    'projects.title1': 'Mis',
    'projects.title2': 'Proyectos',
    'projects.p1Title': 'Módulo CRUD — PWA Encuestas',
    'projects.p1Desc': 'Aplicación Web Progresiva (PWA) Offline-First con IndexedDB (Dexie.js), sincronización reactiva en segundo plano, autenticación JWT, rotación inteligente de prioridades telefónicas y exportación nativa a Excel (.xlsx) con ExcelJS.',
    'projects.p2Title': 'Sistema Impobiomedical',
    'projects.p2Desc': 'Plataforma web de gestión comercial, cotizaciones médicas, calculadora de rentabilidad, catálogo de productos con imágenes, órdenes de compra por proveedor (P.O.), generación de PDFs oficiales y reportes estadísticos avanzados.',
    'projects.p3Title': 'Sistema Gestión de Datos',
    'projects.p3Desc': 'Sistema analítico y de auditoría académica para el SENA. Incluye procesamiento por lotes de juicios evaluativos de Sofia Plus, extracción curricular automatizada con Python (PDF GFPI-F-016), curvas de retención y auditoría de instructores.',
    'projects.p4Title': 'Sistema Sodicol',
    'projects.p4Desc': 'Aplicación web integral para la gestión y administración empresarial de Sodicol. Incluye módulos de autenticación, generación de PDFs, gestión de datos y reportes avanzados.',
    'projects.p5Title': 'Sistema PQRS',
    'projects.p5Desc': 'Plataforma de gestión de Peticiones, Quejas, Reclamos y Sugerencias. Permite el seguimiento, clasificación, generación de reportes en PDF y gestión completa del ciclo de vida de cada caso.',
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
    'hero.desc': 'Software Analysis & Development Technologist passionate about building robust, efficient, and scalable web solutions.',
    'hero.btnProjects': 'View Projects',
    'hero.btnCV': 'View / Download CV',
    'hero.btnContact': 'Get in Touch',
    'about.title1': 'About',
    'about.title2': 'Me',
    'about.card1Title': 'Who am I?',
    'about.card1Desc': 'Software Analysis and Development Technologist with strong experience in programming, databases, and web architectures. I specialize in building functional, scalable, and well-structured applications that solve real-world problems.',
    'about.card2Title': 'What I do?',
    'about.card2Desc': 'I develop end-to-end web applications using PHP, Python with Flask, MySQL, HTML, CSS, JavaScript, and React. I implement containerized solutions with Docker and manage production deployments on VPS.',
    'about.card3Title': 'My Approach',
    'about.card3Desc': 'Proactive, self-taught, and problem-solving oriented. I adapt quickly to new technical challenges and maintain high attention to detail to deliver clean and high-quality software solutions.',
    'about.stat1': 'Completed\nProjects',
    'about.stat2': 'Mastered\nTechnologies',
    'about.stat3': '% Commitment\nin every project',
    'skills.title1': 'My',
    'skills.title2': 'Skills',
    'projects.title1': 'My',
    'projects.title2': 'Projects',
    'projects.p1Title': 'CRUD Module — Survey PWA',
    'projects.p1Desc': 'Offline-First Progressive Web App (PWA) powered by IndexedDB (Dexie.js), background reactive synchronization, JWT authentication, smart phone queue prioritization, and native Excel (.xlsx) export via ExcelJS.',
    'projects.p2Title': 'Impobiomedical System',
    'projects.p2Desc': 'Commercial and biomedical management platform: automated quotations, margin calculator, product catalog with image processing, supplier purchase orders (P.O.), official PDF generation, and analytics.',
    'projects.p3Title': 'Academic Data Management System',
    'projects.p3Desc': 'Analytics and audit platform for SENA: batch processing of Sofia Plus evaluations, automated curriculum extraction with Python (PDF GFPI-F-016), apprentice retention metrics, and instructor auditing.',
    'projects.p4Title': 'Sodicol System',
    'projects.p4Desc': 'Comprehensive enterprise management web application for Sodicol. Features user authentication, PDF generation, customer data management, and business reporting.',
    'projects.p5Title': 'PQRS System',
    'projects.p5Desc': 'Inquiries, Complaints, Claims, and Suggestions management platform. Enables ticket lifecycle tracking, categorization, PDF reporting, and automated notifications.',
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

