// main.js

document.addEventListener('DOMContentLoaded', () => {
  // Selecciones principales
  const navLinks = document.querySelectorAll('nav a');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const mainContent = document.querySelector('.page-content') || document.querySelector('.program-container');

  // Fade-in inmediato al cargar para evitar el parpadeo (FOUC)
  if (mainContent) {
    // Usamos requestAnimationFrame para asegurar que el navegador ya ha aplicado el CSS base
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

      // Si ya estamos en la página de destino o es un enlace vacío, no hacemos nada
      if (!targetPage || window.location.pathname.split('/').pop() === targetPage) return;

      if (mainContent) {
        mainContent.classList.remove('page-enter');
        mainContent.classList.add('page-leave');

        // Seguridad: si la transición CSS falla o no se dispara, forzamos la redirección tras 400ms
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
  
  // Manejo especial para la tarjeta de 2026 (Giro + Fuegos artificiales)
  const polaroid2026 = document.getElementById('polaroid-2026');
  
  if (polaroid2026) {
    polaroid2026.addEventListener('click', () => {
      // Hace que la tarjeta gire alternando la clase 'flipped'
      polaroid2026.classList.toggle('flipped');
      
      // Si se ha girado (tiene la clase flipped), encendemos los fuegos artificiales
      if (polaroid2026.classList.contains('flipped')) {
        window.initFireworks();
      } else {
        // Opcional: si la vuelven a girar para ver la foto, apagamos los fuegos
        window.stopFireworks();
      }
    });
  }
  
  const tarjeta2018 = document.querySelector('.polaroid-hint');
  if (tarjeta2018) {
    tarjeta2018.addEventListener('click', () => {
      tarjeta2018.classList.remove('polaroid-hint');
    }, { once: true }); // Solo se ejecuta la primera vez
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
    
    // Resetear el menú móvil por si acaso
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

// Hacemos la función global asignándola a 'window' para poder llamarla desde el HTML
window.initFireworks = function() {
  // Si ya están activos o no existe el canvas, no hacemos nada
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

  // Lanzar fuegos artificiales automáticamente de forma intermitente
  fireworksInterval = setInterval(() => {
    if (document.hidden) return;
    createFirework(random(canvas.width * 0.2, canvas.width * 0.8), random(canvas.height * 0.2, canvas.height * 0.5));
  }, 1500);
};

// Función opcional para detenerlos si se cambia de tarjeta o estado
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

  // Recorremos al revés para poder eliminar elementos con splice sin saltarnos índices
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
} // <-- Aquí se eliminó la llave extra que rompía el código