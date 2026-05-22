/* ============================================================
   M&M PREMIUM STORE — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. NAVBAR — efecto scroll
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  /* ----------------------------------------------------------
     2. MOBILE MENU
  ---------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const bar1       = document.getElementById('bar1');
  const bar2       = document.getElementById('bar2');
  const bar3       = document.getElementById('bar3');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    bar1.style.transform = 'translateY(8px) rotate(45deg)';
    bar2.style.opacity   = '0';
    bar3.style.transform = 'translateY(-8px) rotate(-45deg)';
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.style.display = 'none';
    document.body.style.overflow = '';
    bar1.style.transform = '';
    bar2.style.opacity   = '1';
    bar3.style.transform = '';
  }

  /* Expuesto globalmente para los onclick del HTML */
  window.closeMobileMenu = closeMenu;

  menuToggle.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  /* Cerrar con clic fuera */
  document.addEventListener('click', (e) => {
    if (menuOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* Cerrar con Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });


  /* ----------------------------------------------------------
     3. SCROLL REVEAL
  ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     4. ACTIVE NAV LINK
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.style.removeProperty('color'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.style.color = '#D4AF37';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));


  /* ----------------------------------------------------------
     5. FOOTER LINKS HOVER
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href]').forEach(link => {
    if (!link.classList.contains('text-white\\/35')) return;
    link.addEventListener('mouseenter', () => { link.style.color = '#D4AF37'; });
    link.addEventListener('mouseleave', () => { link.style.removeProperty('color'); });
  });

});

/* ----------------------------------------------------------
     6. CARRUSEL DE TESTIMONIOS
  ---------------------------------------------------------- */
  const track     = document.getElementById('carousel-track');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');
  const dots      = document.querySelectorAll('.carousel-dot');

  if (track && prevBtn && nextBtn) {

    const cards        = track.querySelectorAll('.testimonial-card');
    const totalCards   = cards.length;
    let currentIndex   = 0;

    /* Cuántas cards se ven según ancho de pantalla */
    function visibleCount() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640)  return 2;
      return 1;
    }

    /* Máximo índice posible */
    function maxIndex() {
      return totalCards - visibleCount();
    }

    /* Ancho de una card + gap */
    function cardWidth() {
      const card = cards[0];
      const gap  = 24; // gap-6 = 24px
      return card.offsetWidth + gap;
    }

    function updateDots() {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, maxIndex()));
      track.style.transform = `translateX(-${currentIndex * cardWidth()}px)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    dots.forEach(dot => {
      dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index)));
    });

    /* Swipe táctil */
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });

    /* Recalcular al cambiar tamaño */
    window.addEventListener('resize', () => goTo(Math.min(currentIndex, maxIndex())));

    /* Autoplay cada 5s */
    let autoplay = setInterval(() => {
      goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
    }, 5000);

    /* Pausar autoplay al interactuar */
    [prevBtn, nextBtn, ...dots].forEach(el => {
      el.addEventListener('click', () => {
        clearInterval(autoplay);
        autoplay = setInterval(() => {
          goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
        }, 5000);
      });
    });
  }