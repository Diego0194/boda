// main.js

document.addEventListener('DOMContentLoaded', () => {
  // Selecciones
  const navLinks = document.querySelectorAll('nav a');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const mainContent = document.querySelector('.page-content') || document.querySelector('.program-container');

  // Fade-in al cargar
  if (mainContent) {
    mainContent.classList.add('page-enter');
  }

  // Menú hamburguesa
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // Animación de fade-out al hacer clic en enlaces
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetPage = this.getAttribute('href');

      if (window.location.pathname.split('/').pop() === targetPage) return;

      if (mainContent) {
        mainContent.classList.remove('page-enter');
        mainContent.classList.add('page-leave');

        mainContent.addEventListener('transitionend', () => {
          window.location.href = targetPage;
        }, { once: true });
      } else {
        // Si no hay mainContent, navega directamente
        window.location.href = targetPage;
      }
    });
  });

  // Contador solo en index.html
  const countdown = document.getElementById('countdown');
  if (countdown) {
    const targetDate = new Date('2026-09-05T13:00:00').getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        countdown.innerHTML = "<p>¡Es el gran día! 💕</p>";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdown.innerHTML = `
        <div class="countdown-box">
          <div><span>${days}</span><small>días</small></div>
          <div><span>${hours}</span><small>horas</small></div>
          <div><span>${minutes}</span><small>min</small></div>
          <div><span>${seconds}</span><small>seg</small></div>
        </div>
      `;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let fireworksActive = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function random(min, max) {
  return Math.random() * (max - min) + min;
}

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

function animate() {
  if (!fireworksActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.015;

    if (p.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;

  requestAnimationFrame(animate);
}

// Evento solo para 2026
const polaroid2026 = document.getElementById("polaroid-2026");

polaroid2026.addEventListener("click", () => {
  polaroid2026.classList.toggle("flipped");

  fireworksActive = true;

  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      createFirework(
        random(100, window.innerWidth - 100),
        random(100, window.innerHeight - 200)
      );
    }, i * 400);
  }

  animate();

  // Apagar fuegos tras unos segundos
  setTimeout(() => {
    fireworksActive = false;
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 4000);
});