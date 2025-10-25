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
