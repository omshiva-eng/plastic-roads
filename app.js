/* ═══════════════════════════════════════════════════════════
   PLASTIC ROADS RESEARCH PORTAL — app.js
   Animations · Counters · Charts · Navigation
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAVBAR SCROLL BEHAVIOUR ───────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle= document.getElementById('navToggle');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }, { passive: true });

  /* ─── MOBILE MENU ────────────────────────────────────────── */
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  /* ─── ACTIVE NAV ON SCROLL ───────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < bottom) {
          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  /* ─── SCROLL ANIMATIONS ──────────────────────────────────── */
  const animatedEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Don't unobserve — keep as-is for re-entry if user scrolls back
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedEls.forEach(el => observer.observe(el));

  /* ─── COUNTER ANIMATIONS ─────────────────────────────────── */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 2200;
    const startTime = performance.now();

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = target * eased;
      el.textContent = current.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    requestAnimationFrame(tick);
  }

  /* ─── PROGRESS BARS ──────────────────────────────────────── */
  const progressBars = document.querySelectorAll('.pi-bar');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const width = entry.target.dataset.width || '70';
        requestAnimationFrame(() => {
          entry.target.style.width = width + '%';
        });
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => barObserver.observe(bar));

  /* ─── HERO PARTICLES ─────────────────────────────────────── */
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = window.innerWidth < 600 ? 25 : 50;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 1.5;
      const left = Math.random() * 100;
      const delay = Math.random() * 12;
      const duration = Math.random() * 8 + 10;
      p.style.cssText = `
        left: ${left}%;
        bottom: -20px;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  /* ─── COMPARISON CHART (Chart.js) ────────────────────────── */
  function initChart() {
    const canvas = document.getElementById('compChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = [
      'Marshall Stability\n(kN × 10)',
      'Water Resistance\n(score / 10)',
      'Service Life\n(years)',
      'Maintenance Interval\n(years)',
      'Skid Resistance\n(BPN / 10)',
      'Cost Efficiency\n(index)'
    ];

    const conventional = [9.5,  3.5,  6.5,  2.5,  4.8,  5];
    const plastic      = [15.2, 9.0, 12.5,  6.0,  6.5,  9];

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Conventional Bituminous Road',
            data: conventional,
            backgroundColor: 'rgba(107, 143, 122, 0.55)',
            borderColor:     'rgba(107, 143, 122, 0.9)',
            borderWidth: 1.5,
            borderRadius: 4,
          },
          {
            label: 'Plastic-Modified Road',
            data: plastic,
            backgroundColor: 'rgba(42, 157, 92, 0.7)',
            borderColor:     'rgba(42, 157, 92, 1)',
            borderWidth: 1.5,
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        animation: {
          duration: 1600,
          easing: 'easeOutQuart',
          delay: (context) => context.dataIndex * 80,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: "'DM Sans', sans-serif", size: 12 },
              color: '#2E4A38',
              padding: 24,
              usePointStyle: true,
              pointStyle: 'rect',
            }
          },
          tooltip: {
            backgroundColor: '#0B1D14',
            borderColor: 'rgba(42,157,92,0.3)',
            borderWidth: 1,
            titleColor: '#A8E6C3',
            bodyColor: '#8FAF9A',
            titleFont: { family: "'Cormorant Garamond', serif", size: 14, weight: '600' },
            bodyFont: { family: "'DM Sans', sans-serif", size: 12 },
            padding: 12,
            callbacks: {
              title: (items) => items[0].label.replace('\n', ' '),
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: { family: "'DM Sans', sans-serif", size: 10 },
              color: '#6B8F7A',
              maxRotation: 0,
              callback: function(val, index) {
                return this.getLabelForValue(index).split('\n');
              }
            },
            border: { color: 'rgba(42,157,92,0.1)' }
          },
          y: {
            grid: {
              color: 'rgba(42,157,92,0.06)',
              lineWidth: 1,
            },
            ticks: {
              font: { family: "'DM Mono', monospace", size: 10 },
              color: '#6B8F7A',
              padding: 8,
            },
            border: {
              dash: [4, 4],
              color: 'rgba(42,157,92,0.1)'
            },
            beginAtZero: true,
            max: 18,
          }
        }
      }
    });
  }

  // Initialise chart when it scrolls into view
  const chartCanvas = document.getElementById('compChart');
  if (chartCanvas) {
    const chartObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        initChart();
        chartObserver.disconnect();
      }
    }, { threshold: 0.2 });
    chartObserver.observe(chartCanvas);
  }

  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── HOVER TILT ON CARDS ────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.mat-card, .ben-card, .fu-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -4;
      const tiltY  = dx *  4;
      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─── INITIAL CALL ───────────────────────────────────────── */
  updateActiveNav();

  // Trigger hero animations (already in view on load)
  setTimeout(() => {
    document.querySelectorAll('#hero [data-animate]').forEach(el => {
      el.classList.add('in-view');
    });
  }, 100);

})();
