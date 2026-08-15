/* ===================== I18N ENGINE ===================== */
/* Bahasa disimpan di localStorage supaya konsisten antar halaman.
   Setiap halaman punya file kamus sendiri (i18n-<page>.js) yang mengisi
   window.I18N_PAGE. Elemen yang perlu diterjemahkan diberi atribut
   data-i18n="key" (untuk innerHTML) atau data-i18n-attr="attr:key"
   (untuk atribut seperti placeholder/title/aria-label). */
(function () {
  var STORAGE_KEY = 'site-lang';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'id';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function buildDict(lang) {
    var common = (window.I18N_COMMON && window.I18N_COMMON[lang]) || {};
    var page = (window.I18N_PAGE && window.I18N_PAGE[lang]) || {};
    var dict = {};
    for (var k in common) dict[k] = common[k];
    for (var k2 in page) dict[k2] = page[k2];
    return dict;
  }

  function applyLang(lang) {
    var dict = buildDict(lang);

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var pairs = el.getAttribute('data-i18n-attr').split('|');
      pairs.forEach(function (pair) {
        var parts = pair.split(':');
        var attr = parts[0];
        var key = parts[1];
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });

    if (dict['_title']) document.title = dict['_title'];
    if (dict['_metaDesc']) {
      var m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute('content', dict['_metaDesc']);
      var og = document.querySelector('meta[property="og:description"]');
      if (og) og.setAttribute('content', dict['_metaDesc']);
    }
    if (dict['_ogTitle']) {
      var ogt = document.querySelector('meta[property="og:title"]');
      if (ogt) ogt.setAttribute('content', dict['_ogTitle']);
    }

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function initLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        setLang(lang);
        applyLang(lang);
      });
    });
    applyLang(getLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangSwitcher);
  } else {
    initLangSwitcher();
  }
})();
