// main.js

document.addEventListener('DOMContentLoaded', () => {
  // Selecciones principales
  const navLinks = document.querySelectorAll('nav a');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const mainContent = document.querySelector('.page-content') || document.querySelector('.program-container');

  // Fade-in inmediato al cargar para evitar el parpadeo (FOUC)
  if (mainContent) {
    requestAnimationFrame(() => {
      mainContent.classList.add('page-enter');
    });
  }

  // Menú hamburguesa (móvil)
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // Animación de fade-out al hacer clic en los enlaces de navegación
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = this.getAttribute('href');

      if (!targetPage || window.location.pathname.split('/').pop() === targetPage) return;

      if (mainContent) {
        mainContent.classList.remove('page-enter');
        mainContent.classList.add('page-leave');

        const timeoutSeguridad = setTimeout(() => {
          window.location.href = targetPage;
        }, 400);

        mainContent.addEventListener('transitionend', () => {
          clearTimeout(timeoutSeguridad);
          window.location.href = targetPage;
        }, { once: true });
      } else {
        window.location.href = targetPage;
      }
    });
  });
  
  // ==========================================================================
  // LÓGICA DE LA CUENTA ATRÁS (Añadido)
  // ==========================================================================
  const countdownElement = document.getElementById("countdown");
  
  if (countdownElement) {
    // Definimos la fecha de la boda: 5 de Septiembre de 2026
    const weddingDate = new Date("September 5, 2026 00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const timeLeft = weddingDate - now;

      if (timeLeft < 0) {
        countdownElement.innerHTML = "<div class='countdown-finished'>¡Llegó el gran día! 💍</div>";
        return;
      }

      // Cálculos de tiempo
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

// Inyección del HTML estructurado (Versión más grande)
    countdownElement.innerHTML = `
      <div class="countdown-container" style="display: flex; gap: 0px; justify-content: center; font-family: 'Playfair Display', serif; margin-top: 0px; color: white;">
        <div class="countdown-item" style="text-align: center; min-width: 50px;">
          <strong style="font-size: 1.5rem; display: block; font-weight: 700; line-height: 1.1;">${days}</strong>
          <span style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Días</span>
        </div>
        <div class="countdown-item" style="text-align: center; min-width: 50px;">
          <strong style="font-size: 1.5rem; display: block; font-weight: 700; line-height: 1.1;">${hours}</strong>
          <span style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Horas</span>
        </div>
        <div class="countdown-item" style="text-align: center; min-width: 50px;">
          <strong style="font-size: 1.5rem; display: block; font-weight: 700; line-height: 1.1;">${minutes}</strong>
          <span style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Min</span>
        </div>
        <div class="countdown-item" style="text-align: center; min-width: 50px;">
          <strong style="font-size: 1.5rem; display: block; font-weight: 700; line-height: 1.1;">${seconds}</strong>
          <span style="font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Seg</span>
        </div>
      </div>
    `;
    };

    // Ejecutamos inmediatamente para evitar el delay de 1s de JavaScript
    updateCountdown();
    // Actualizamos cada segundo
    setInterval(updateCountdown, 1000);
  }
  
  // Manejo especial para la tarjeta de 2026 (Giro + Fuegos artificiales)
  const polaroid2026 = document.getElementById('polaroid-2026');
  
  if (polaroid2026) {
    polaroid2026.addEventListener('click', () => {
      polaroid2026.classList.toggle('flipped');
      
      if (polaroid2026.classList.contains('flipped')) {
        window.initFireworks();
      } else {
        window.stopFireworks();
      }
    });
  }
  
  const tarjeta2018 = document.querySelector('.polaroid-hint');
  if (tarjeta2018) {
    tarjeta2018.addEventListener('click', () => {
      tarjeta2018.classList.remove('polaroid-hint');
    }, { once: true });
  }
});

// SOLUCIÓN AL BOTÓN "ATRÁS" DEL NAVEGADOR (BFCache)
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    const mainContent = document.querySelector('.page-content') || document.querySelector('.program-container');
    
    if (mainContent) {
      mainContent.classList.remove('page-leave');
      requestAnimationFrame(() => {
        mainContent.classList.add('page-enter');
      });
    }
    
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    if (toggle && nav) {
      nav.classList.remove('open');
      toggle.classList.remove('active');
    }
  }
});


/* ==========================================================================
   SISTEMA DE FUEGOS ARTIFICIALES (Optimizado y Controlado)
   ========================================================================== */

let canvas, ctx, particles = [], fireworksActive = false, fireworksInterval = null;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

window.initFireworks = function() {
  canvas = document.getElementById("fireworks");
  if (!canvas || fireworksActive) return;

  ctx = canvas.getContext("2d");
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  fireworksActive = true;
  animateFireworks();

  fireworksInterval = setInterval(() => {
    if (document.hidden) return;
    createFirework(random(canvas.width * 0.2, canvas.width * 0.8), random(canvas.height * 0.2, canvas.height * 0.5));
  }, 1500);
};

window.stopFireworks = function() {
  fireworksActive = false;
  if (fireworksInterval) clearInterval(fireworksInterval);
  if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = [];
};

function createFirework(x, y) {
  const colors = ["#ff4d4d", "#ffd633", "#66ffcc", "#66a3ff", "#ff99ff"];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x,
      y,
      vx: Math.cos(i) * random(1, 5),
      vy: Math.sin(i) * random(1, 5),
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function animateFireworks() {
  if (!fireworksActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.015;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateFireworks);
}