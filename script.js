/**
 * ============================================================
 *  West Sumatra Private Driver & Tour — Landing Page Script
 *  Version: 2.0.0
 * ============================================================
 */

(function () {
  'use strict';

  /* ── CONSTANTS ──────────────────────────────────────────── */

  const WHATSAPP_NUMBER = '6285265668068';
  const WHATSAPP_MESSAGE = encodeURIComponent(
    'Halo Puti Tour & Travel. 👋\n\n' +
    'Saya tertarik dengan layanan tur Anda dan ingin menanyakan penawaran harga untuk detail berikut:\n\n' +
    '📌 Detail Rencana:\n' +
    '• Tujuan / Rute: \n' +
    '• Tanggal Perjalanan: \n' +
    '• Jumlah Rombongan: orang\n' +
    '• Jenis Layanan: (Full Tour / Antar Jemput Saja)\n' +
    '• Catatan Khusus: \n\n' +
    'Mohon info ketersediaan armada dan harganya ya. Terima kasih.'
  );

  const SCROLL_THRESHOLD = 80;
  const SECTION_IDS = ['home', 'destinations', 'services', 'gallery', 'about', 'faq', 'contact'];
  const PREFERS_REDUCED_MOTION =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── UTILITIES ──────────────────────────────────────────── */

  function throttle(fn, limit = 16) {
    let waiting = false;
    let lastArgs = null;
    return function (...args) {
      lastArgs = args;
      if (waiting) return;
      waiting = true;
      requestAnimationFrame(function () {
        fn.apply(null, lastArgs);
        setTimeout(function () { waiting = false; }, limit);
      });
    };
  }

  function qs(s, p) { return (p || document).querySelector(s); }
  function qsa(s, p) { return Array.from((p || document).querySelectorAll(s)); }

  /* ── 1. STICKY NAV ─────────────────────────────────────── */

  function initStickyNav() {
    var navbar = qs('.navbar');
    if (!navbar) return;

    function update() {
      navbar.classList.toggle('scrolled', window.pageYOffset > SCROLL_THRESHOLD);
    }
    update();
    window.addEventListener('scroll', throttle(update, 50), { passive: true });
  }

  /* ── 2. SMOOTH SCROLL ──────────────────────────────────── */

  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (id === '#') return;
      var target = qs(id);
      if (!target) return;
      e.preventDefault();
      var navbar = qs('.navbar');
      var offset = navbar ? navbar.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      if (!PREFERS_REDUCED_MOTION) {
        window.scrollTo({ top: top, behavior: 'smooth' });
      } else {
        window.scrollTo(0, top);
      }
      closeMobileMenu();
    });
  }

  /* ── 3. MOBILE NAV ─────────────────────────────────────── */

  var _menuOpen = false;

  function closeMobileMenu() {
    var toggle = qs('.nav-mobile-toggle');
    var menu = qs('.nav-mobile');
    if (!menu) return;
    menu.classList.remove('active');
    if (toggle) toggle.classList.remove('active');
    document.body.classList.remove('no-scroll');
    _menuOpen = false;
  }

  function openMobileMenu() {
    var toggle = qs('.nav-mobile-toggle');
    var menu = qs('.nav-mobile');
    if (!menu) return;
    menu.classList.add('active');
    if (toggle) toggle.classList.add('active');
    document.body.classList.add('no-scroll');
    _menuOpen = true;
  }

  function initMobileNav() {
    var toggle = qs('.nav-mobile-toggle');
    var menu = qs('.nav-mobile');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      _menuOpen ? closeMobileMenu() : openMobileMenu();
    });

    document.addEventListener('click', function (e) {
      if (!_menuOpen) return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMobileMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _menuOpen) closeMobileMenu();
    });
  }

  /* ── 4. SCROLL REVEAL ──────────────────────────────────── */

  function initScrollReveal() {
    var reveals = qsa('.reveal');
    if (!reveals.length) return;

    if (PREFERS_REDUCED_MOTION) {
      reveals.forEach(function (el) { el.classList.add('active'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.dataset.delay, 10) || 0;
        if (delay > 0) {
          setTimeout(function () { el.classList.add('active'); }, delay);
        } else {
          el.classList.add('active');
        }
        observer.unobserve(el);
      });
    }, { threshold: 0.1 });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* ── 5. FAQ ACCORDION ──────────────────────────────────── */

  function initFaqAccordion() {
    var questions = qsa('.faq-question');
    if (!questions.length) return;

    questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parent = btn.closest('.faq-item');
        if (!parent) return;
        var isActive = parent.classList.contains('active');
        qsa('.faq-item.active').forEach(function (item) { item.classList.remove('active'); });
        if (!isActive) parent.classList.add('active');
      });
    });
  }

  /* ── 6. ACTIVE NAV TRACKING ────────────────────────────── */

  function initActiveNavTracking() {
    var navLinks = qsa('.navbar a[href^="#"]');
    if (!navLinks.length) return;

    var linkMap = {};
    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').replace('#', '');
      if (!linkMap[id]) linkMap[id] = [];
      linkMap[id].push(link);
    });

    var sections = SECTION_IDS.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (!sections.length) return;

    function setActive(sectionId) {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      if (linkMap[sectionId]) linkMap[sectionId].forEach(function (l) { l.classList.add('active'); });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ── 7. LAZY LOADING ───────────────────────────────────── */

  function initLazyImages() {
    var images = qsa('img[data-src]');
    if (!images.length) return;

    if (!('IntersectionObserver' in window)) {
      images.forEach(function (img) { loadImage(img); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '200px 0px', threshold: 0 });

    images.forEach(function (img) { observer.observe(img); });
  }

  function loadImage(img) {
    var src = img.dataset.src;
    if (!src) return;
    img.addEventListener('load', function () { img.classList.add('loaded'); }, { once: true });
    img.addEventListener('error', function () { img.classList.add('loaded'); }, { once: true });
    img.src = src;
    img.removeAttribute('data-src');
  }

  /* ── 8. WHATSAPP CTA ───────────────────────────────────── */

  function openWhatsApp() {
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + WHATSAPP_MESSAGE, '_blank', 'noopener,noreferrer');
  }

  function initWhatsApp() {
    qsa('.whatsapp-trigger').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openWhatsApp();
      });
    });
  }

  /* ── 9. COUNTER ANIMATION ──────────────────────────────── */

  function initCounterAnimation() {
    var counters = qsa('.stat-number[data-target]');
    if (!counters.length) return;
    var animated = false;

    function animateCounter(el) {
      var target = parseInt(el.dataset.target, 10);
      if (isNaN(target) || target <= 0) { el.textContent = '0+'; return; }
      var duration = Math.min(2000, Math.max(1000, target * 10));
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + '+';
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + '+';
        }
      }

      if (PREFERS_REDUCED_MOTION) { el.textContent = target + '+'; return; }
      requestAnimationFrame(step);
    }

    var aboutSection = document.getElementById('about');
    var observeTarget = aboutSection || counters[0].closest('section') || counters[0];

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(function (c) { animateCounter(c); });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(observeTarget);
  }

  /* ── 10. INIT ──────────────────────────────────────────── */

  function init() {
    initStickyNav();
    initSmoothScroll();
    initMobileNav();
    initScrollReveal();
    initFaqAccordion();
    initActiveNavTracking();
    initLazyImages();
    initWhatsApp();
    initCounterAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
