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

  /* ── Mobile hamburger menu ───────────────────── */

  const initMobileMenu = () => {
    const hamburger = document.getElementById('nav-hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!hamburger || !menu) return;

    const toggle = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !menu.classList.contains('nav__mobile-menu--open');
      menu.classList.toggle('nav__mobile-menu--open', isOpen);
      hamburger.classList.toggle('nav__hamburger--active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    // Close on link click inside menu
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) toggle(false);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#mobile-menu') && !e.target.closest('#nav-hamburger')) {
        toggle(false);
      }
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
    initMobileMenu();
    initNavScroll();
  });
})();
