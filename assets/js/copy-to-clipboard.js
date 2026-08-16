/* ===================== COPY TO CLIPBOARD ===================== */
/* Klik kartu kontak (Email, WhatsApp, LinkedIn, Portfolio, Location)
   untuk otomatis menyalin isinya ke clipboard, dengan feedback
   visual singkat. */
(function () {
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function getTranslatedCopiedText() {
    var lang = localStorage.getItem('site-lang') || 'id';
    var common = (window.I18N_COMMON && window.I18N_COMMON[lang]) || {};
    var page = (window.I18N_PAGE && window.I18N_PAGE[lang]) || {};
    return page['cinfo.copied'] || common['cinfo.copied'] || 'Tersalin!';
  }

  function handleCopy(card) {
    var valueEl = card.querySelector('p');
    var hintEl = card.querySelector('.copy-hint-text');
    if (!valueEl) return;

    var currentValue = valueEl.textContent.trim();
    var currentHint = hintEl ? hintEl.textContent : '';

    copyText(currentValue).then(function () {
      card.classList.add('copied');
      if (hintEl) hintEl.textContent = getTranslatedCopiedText();

      clearTimeout(card._copyResetTimer);
      card._copyResetTimer = setTimeout(function () {
        card.classList.remove('copied');
        if (hintEl) hintEl.textContent = currentHint;
      }, 1600);
    }).catch(function () {
      /* Gagal menyalin (mis. izin browser) - abaikan secara diam-diam */
    });
  }

  function init() {
    var cards = document.querySelectorAll('.cinfo-card.copyable');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        handleCopy(card);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCopy(card);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
