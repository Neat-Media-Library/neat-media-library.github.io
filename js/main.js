/* ───────────────────────────────────────────────────
   Neat – Animations & Interactions
   ─────────────────────────────────────────────────── */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Intersection Observer – Fade-in ─────────── */

  const initFadeIn = () => {
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add('fade-in--visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    targets.forEach((el) => observer.observe(el));
  };

  /* ── Smooth scroll for anchor links ──────────── */

  const initSmoothScroll = () => {
    if (prefersReducedMotion) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const nav = document.getElementById('nav');
      const offset = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  };

  /* ── Nav background on scroll ────────────────── */

  const initNavScroll = () => {
    const nav = document.getElementById('nav');
    if (!nav) return;

    const SCROLL_THRESHOLD = 50;

    const update = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', update, { passive: true });
    update(); // set initial state
  };

  /* ── Init ─────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    initFadeIn();
    initSmoothScroll();
    initNavScroll();
  });
})();
