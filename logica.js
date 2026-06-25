'use strict';

document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    once: true,
    offset: 80,
    duration: 900,
    easing: 'ease-out-cubic'
  });

  initNavbar();
  initParticles();
  initPetals();
  initDayCounter();
  initHeartCounter();
  initFireworksCanvas();
});

function initNavbar() {
  const nav = document.querySelector('.elena-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function drawHeart(ctx, x, y, s, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.5, y + s * 0.7, x, y + s * 0.9, x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.9, x + s * 0.5, y + s * 0.7, x + s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const COLORS = ['#FFB7C5', '#E8849A', '#C9967A', '#d4608c', '#f9a8c0'];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : H + 20;
      this.size  = Math.random() * 10 + 4;
      this.speedY = -(Math.random() * 0.5 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha  = Math.random() * 0.15 + 0.04;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.angle  = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.y     += this.speedY;
      this.x     += this.speedX;
      this.angle += this.rotSpeed;
      if (this.y < -30) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      drawHeart(ctx, -this.size / 2, -this.size / 2, this.size, this.alpha);
      ctx.restore();
    }
  }

  const COUNT = Math.min(80, Math.floor((W * H) / 14000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  let rafId;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animate();
  });
}

function initPetals() {
  const container = document.getElementById('petalsContainer');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('petal');
    const left = Math.random() * 100;
    const dur  = Math.random() * 8 + 7;
    const delay = Math.random() * 10;
    const size  = Math.random() * 8 + 8;
    p.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size * 1.5}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(p);
  }
}

function initDayCounter() {
  const elDays = document.getElementById('countDays');
  if (!elDays) return;

  const START_DATE = new Date('2026-05-11T00:00:00');

  function update() {
    const now   = new Date();
    const diff  = Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24));
    const target = Math.max(0, diff);
    animateNumber(elDays, 0, target, 2000);
  }
  update();
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  function step(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * ease).toLocaleString('es');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initHeartCounter() {
  const el = document.getElementById('countHearts');
  if (!el) return;
  const START_DATE = new Date('2026-05-11T00:00:00');
  function update() {
    const seconds = Math.floor((new Date() - START_DATE) / 1000);
    const beats   = seconds * 1;
    el.textContent = beats.toLocaleString('es');
  }
  update();
  setInterval(update, 1000);
}

window.abrirCarta = function() {
  const envelope = document.getElementById('cartaEnvelope');
  const letter   = document.getElementById('cartaLetter');
  const textEl   = document.getElementById('cartaTexto');

  if (!envelope || !letter) return;

  envelope.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  envelope.style.transform  = 'scale(0.8) translateY(-20px)';
  envelope.style.opacity    = '0';

  setTimeout(() => {
    document.querySelector('.carta-envelope-wrapper').classList.add('d-none');
    letter.classList.remove('d-none');

    const texto = `Hay palabras que pensé durante mucho tiempo antes de atreverme a escribirlas. Palabras que se quedaban atrapadas en algún lugar entre el corazón y la garganta, sin saber muy bien cómo salir.

Pero hoy quiero decirte algo simple y verdadero: eres la persona más importante de mi vida. No porque no tenga nadie más, sino porque tú haces que todos los momentos sean mejores, más vivos, más llenos de significado.

Cuando estoy contigo, el mundo tiene más color. Cuando no estás, algo falta. Y cada vez que apareces, sin importar cuántas veces ya lo hayas hecho, siento que es la primera vez que te veo.

Eso, Elena, es lo que me has dado. Un amor que no se gasta, que no se cansa, que sigue eligiéndote todos los días, en cada momento, sin dudarlo ni un segundo.

Te amo. Hoy, mañana y todos los días que vengan.`;

    typewriterEffect(textEl, texto, 28);
  }, 600);
};

function typewriterEffect(el, text, speed) {
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.classList.add('cursor-blink');
  el.appendChild(cursor);

  const lines  = text.split('\n');
  let lineIdx  = 0;
  let charIdx  = 0;

  function tick() {
    if (lineIdx >= lines.length) {
      cursor.remove();
      return;
    }
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      cursor.insertAdjacentText('beforebegin', line[charIdx]);
      charIdx++;
      setTimeout(tick, speed);
    } else {
      lineIdx++;
      charIdx = 0;
      if (lines[lineIdx] === '') {
        cursor.insertAdjacentHTML('beforebegin', '<br><br>');
        lineIdx++;
      } else {
        cursor.insertAdjacentHTML('beforebegin', '<br>');
      }
      setTimeout(tick, speed * 4);
    }
  }
  tick();
}

function initFireworksCanvas() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const FW_COLORS = [
    '#FFB7C5','#E8849A','#C9967A','#fff0f5',
    '#f5a0c0','#ffd6e5','#e870a0','#ffc8e0','#d4a0ff'
  ];

  let particles = [];
  let running   = false;
  let rafId;

  class FWParticle {
    constructor(x, y, color) {
      this.x  = x; this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.radius = Math.random() * 3 + 1.5;
      this.gravity = 0.08;
      this.decay   = Math.random() * 0.015 + 0.008;
      this.isHeart = Math.random() < 0.3;
      this.size    = Math.random() * 6 + 3;
    }
    update() {
      this.vx *= 0.98;
      this.vy  = this.vy * 0.98 + this.gravity;
      this.x  += this.vx;
      this.y  += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle   = this.color;
      if (this.isHeart) {
        drawHeart2(ctx, this.x, this.y, this.size);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    isDead() { return this.alpha <= 0; }
  }

  function drawHeart2(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.25);
    ctx.bezierCurveTo(x, y,           x - s * 0.5, y,           x - s * 0.5, y + s * 0.25);
    ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6,    x, y + s * 0.85,          x, y + s);
    ctx.bezierCurveTo(x, y + s * 0.85, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.25);
    ctx.bezierCurveTo(x + s * 0.5, y,  x, y,           x, y + s * 0.25);
    ctx.closePath();
    ctx.fill();
  }

  function launch(x, y) {
    const color = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
    const count = Math.floor(Math.random() * 50) + 60;
    for (let i = 0; i < count; i++) {
      particles.push(new FWParticle(x, y, color));
    }
  }

  function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);
    particles = particles.filter(p => !p.isDead());
    particles.forEach(p => { p.update(); p.draw(); });
    if (running || particles.length > 0) {
      rafId = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }

  let autoInterval;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        running = true;
        resize();
        loop();
        autoInterval = setInterval(() => {
          const x = Math.random() * W;
          const y = Math.random() * H * 0.65 + H * 0.05;
          launch(x, y);
        }, 800);
      } else {
        running = false;
        clearInterval(autoInterval);
      }
    });
  }, { threshold: 0.1 });

  const finalSection = document.querySelector('.section-final');
  if (finalSection) observer.observe(finalSection);

  window.launchFireworks = function() {
    resize();
    if (!running) { running = true; loop(); }
    let count = 0;
    const burst = setInterval(() => {
      const x = Math.random() * W;
      const y = Math.random() * H * 0.5 + 0.1 * H;
      launch(x, y);
      count++;
      if (count >= 12) clearInterval(burst);
    }, 200);
    setTimeout(() => {
      launchTextBurst();
    }, 500);
  };

  function launchTextBurst() {
    const cx = W / 2;
    const cy = H / 2;
    for (let i = 0; i < 40; i++) {
      const p = new FWParticle(cx, cy, '#FFB7C5');
      p.isHeart = true;
      p.size    = Math.random() * 10 + 5;
      p.vx     *= 1.5;
      p.vy     *= 1.5;
      particles.push(p);
    }
  }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

document.addEventListener('click', function(e) {
  const card = e.target.closest('.razon-card');
  if (!card) return;
  const ripple = document.createElement('span');
  const rect   = card.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    width: ${size}px; height: ${size}px;
    left: ${e.clientX - rect.left - size/2}px;
    top:  ${e.clientY - rect.top  - size/2}px;
    background: rgba(232,132,154,0.15);
    transform: scale(0);
    animation: rippleAnim 0.7s ease-out forwards;
    pointer-events: none;
  `;
  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style');
    s.id = 'rippleStyle';
    s.textContent = '@keyframes rippleAnim{to{transform:scale(2.5);opacity:0;}}';
    document.head.appendChild(s);
  }
  card.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});
