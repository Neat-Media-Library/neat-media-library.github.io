/* ───────────────────────────────────────────────────
   Neat – Internationalization (i18n)
   ─────────────────────────────────────────────────── */
(function () {
  'use strict';

  const SUPPORTED_LANGS = [
    'en', 'es', 'de', 'fr', 'it', 'ja', 'ko',
    'nl', 'ru', 'sr', 'tr', 'uk', 'zh-Hans', 'zh-Hant', 'cs',
  ];

  const LANG_NAMES = {
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    fr: 'Français',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    nl: 'Nederlands',
    ru: 'Русский',
    sr: 'Српски',
    tr: 'Türkçe',
    uk: 'Українська',
    'zh-Hans': '简体中文',
    'zh-Hant': '繁體中文',
    cs: 'Čeština',
  };

  const STORAGE_KEY = 'neat-lang';
  const cache = {};

  /* ── Helpers ──────────────────────────────────── */

  const isSupported = (code) => SUPPORTED_LANGS.includes(code);

  /** Return short display label, e.g. "EN", "ZH-HANS" */
  const shortLabel = (code) => code.toUpperCase();

  /** Look up a translation key (flat key like "hero.title") */
  const resolve = (obj, key) => obj[key];

  /* ── Language detection ──────────────────────── */

  const detectLang = () => {
    // 1. URL param  ?lang=xx
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && isSupported(urlLang)) return urlLang;

    // 2. localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isSupported(stored)) return stored;

    // 3. navigator.language (try full tag first, then base)
    const nav = navigator.language || '';
    if (isSupported(nav)) return nav;
    const base = nav.split('-')[0];
    if (isSupported(base)) return base;

    // 4. Fallback
    return 'en';
  };

  /* ── Translation loading ─────────────────────── */

  const fetchTranslations = async (lang) => {
    if (cache[lang]) return cache[lang];

    try {
      const res = await fetch(`locales/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      cache[lang] = data;
      return data;
    } catch (err) {
      console.warn(`[i18n] Could not load locales/${lang}.json –`, err);
      return null;
    }
  };

  /* ── DOM replacement ─────────────────────────── */

  const applyTranslations = (translations) => {
    if (!translations) return;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = resolve(translations, key);
      if (value !== undefined) el.textContent = value;
    });
  };

  /* ── Language selector ───────────────────────── */

  const buildDropdown = (activeLang) => {
    const dropdown = document.getElementById('lang-dropdown');
    if (!dropdown) return;

    dropdown.innerHTML = '';

    SUPPORTED_LANGS.forEach((code) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'lang-selector__option';
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', code === activeLang ? 'true' : 'false');
      option.dataset.lang = code;
      option.textContent = LANG_NAMES[code];

      if (code === activeLang) option.classList.add('lang-selector__option--active');

      option.addEventListener('click', () => switchLanguage(code));
      dropdown.appendChild(option);
    });
  };

  const updateLangLabel = (code) => {
    const label = document.getElementById('lang-label');
    if (label) label.textContent = shortLabel(code);
  };

  /* ── Dropdown toggle ─────────────────────────── */

  const initDropdownToggle = () => {
    const btn = document.getElementById('lang-btn');
    const dropdown = document.getElementById('lang-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('lang-selector__dropdown--open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#lang-selector')) {
        dropdown.classList.remove('lang-selector__dropdown--open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  };

  /* ── Switch language ─────────────────────────── */

  const switchLanguage = async (code) => {
    if (!isSupported(code)) return;

    const translations = await fetchTranslations(code);
    applyTranslations(translations);

    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
    updateLangLabel(code);
    buildDropdown(code);

    // Close dropdown after selection
    const dropdown = document.getElementById('lang-dropdown');
    const btn = document.getElementById('lang-btn');
    if (dropdown) dropdown.classList.remove('lang-selector__dropdown--open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  };

  /* ── Init ─────────────────────────────────────── */

  const init = async () => {
    const lang = detectLang();

    document.documentElement.lang = lang;
    updateLangLabel(lang);
    buildDropdown(lang);
    initDropdownToggle();

    // Always fetch & apply translations (including EN for switching back)
    const translations = await fetchTranslations(lang);
    applyTranslations(translations);
  };

  document.addEventListener('DOMContentLoaded', init);
})();
