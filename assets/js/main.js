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
const phrases = [
  'Desarrollador Web',
  'PHP Developer',
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
