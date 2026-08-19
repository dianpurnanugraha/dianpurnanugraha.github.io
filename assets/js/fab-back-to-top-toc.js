/* ===================== FLOATING ACTION BUTTON =====================
   Gabungan "Kembali ke Atas" + "Daftar Isi" jadi SATU tombol.

   - Tap singkat        -> scroll ke atas
   - Tekan & tahan ~0.4s -> panel daftar isi slide-up dari tombol ini

   File ini MENGGANTIKAN back-to-top.js, toc.js, dan project-toc.js.
   Cukup include file ini saja di setiap halaman. Mode daftar isi
   terdeteksi otomatis:
     - Jika ada elemen [data-toc]                 -> mode "sections"
     - Jika ada .filter-btn[data-filter] + #toc-grid-section -> mode "filters"
     - Jika tidak ada keduanya -> tombol berfungsi sebagai
       back-to-top biasa (tanpa daftar isi / tanpa efek tahan).
   ==================================================================== */
(function () {
  var SHOW_AFTER = 320;     // px scroll sebelum tombol muncul
  var LONG_PRESS_MS = 400;  // durasi tahan sebelum panel terbuka

  function getLang() { return localStorage.getItem('site-lang') || 'id'; }
  function t(key, fallback) {
    var lang = getLang();
    var common = (window.I18N_COMMON && window.I18N_COMMON[lang]) || {};
    return common[key] !== undefined ? common[key] : fallback;
  }

  function init() {
    var sections = document.querySelectorAll('[data-toc]');
    var filterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    var gridSection = document.getElementById('toc-grid-section');

    var mode = null;
    if (sections.length) {
      mode = 'sections';
    } else if (filterButtons.length && gridSection) {
      mode = 'filters';
    }

    /* ===== Tombol utama ===== */
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fab-button';
    btn.setAttribute(
      'aria-label',
      mode ? t('toc.ariaLabelMode', 'Kembali ke atas (tap), buka daftar isi (tahan)') : t('toc.ariaLabelSimple', 'Kembali ke atas')
    );
    btn.innerHTML =
      '<span class="fab-ring"></span>' +
      '<i class="fa-solid fa-arrow-up fab-icon-up"></i>' +
      '<i class="fa-solid fa-list-ul fab-icon-toc"></i>';
    document.body.appendChild(btn);

    /* ===== Panel daftar isi (hanya dibuat kalau ada mode) ===== */
    var panel = null;
    var list = null;
    var tocLinks = [];

    if (mode) {
      panel = document.createElement('div');
      panel.className = 'toc-panel';

      var title = document.createElement('div');
      title.className = 'toc-panel-title';
      title.innerHTML = '<i class="fa-solid fa-list-ul"></i> <span class="toc-panel-title-text">' + t('toc.title', 'Daftar Isi') + '</span>';
      panel.appendChild(title);

      list = document.createElement('ul');
      list.className = 'toc-list';
      panel.appendChild(list);
      document.body.appendChild(panel);

      if (mode === 'sections') {
        sections.forEach(function (sec, idx) {
          if (!sec.id) sec.id = 'toc-auto-' + idx;

          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + sec.id;
          a.textContent = sec.getAttribute('data-toc');

          a.addEventListener('click', function (e) {
            e.preventDefault();
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', '#' + sec.id);
            closePanel();
          });

          li.appendChild(a);
          list.appendChild(li);
          tocLinks.push({ sec: sec, link: a });
        });

        if ('IntersectionObserver' in window) {
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              var item = tocLinks.filter(function (t) { return t.sec === entry.target; })[0];
              if (!item) return;
              if (entry.isIntersecting) {
                list.querySelectorAll('a').forEach(function (l) { l.classList.remove('active'); });
                item.link.classList.add('active');
              }
            });
          }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

          sections.forEach(function (sec) { observer.observe(sec); });
        }
      } else if (mode === 'filters') {
        filterButtons.forEach(function (filterBtn) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#';
          a.innerHTML = filterBtn.innerHTML;
          if (filterBtn.classList.contains('active')) a.classList.add('active');

          a.addEventListener('click', function (e) {
            e.preventDefault();
            filterBtn.click();
            gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closePanel();
          });

          li.appendChild(a);
          list.appendChild(li);
          tocLinks.push({ filterBtn: filterBtn, link: a });
        });

        function syncActiveState() {
          tocLinks.forEach(function (item) {
            if (item.filterBtn.classList.contains('active')) {
              item.link.classList.add('active');
            } else {
              item.link.classList.remove('active');
            }
          });
        }

        filterButtons.forEach(function (filterBtn) {
          filterBtn.addEventListener('click', syncActiveState);
        });
      }
    }

    function openPanel() {
      if (!panel) return;
      panel.classList.add('open');
      btn.classList.add('open');
    }
    function closePanel() {
      if (!panel) return;
      panel.classList.remove('open');
      btn.classList.remove('open');
    }
    function togglePanel() {
      if (!panel) return;
      if (panel.classList.contains('open')) closePanel();
      else openPanel();
    }

    /* ===== Hint "Tahan untuk daftar isi" -> muncul setiap kali
       halaman dibuka/di-refresh, supaya pengunjung tahu tombol
       ini bisa ditahan, bukan cuma di-tap. ===== */
    var hint = null;

    if (mode) {
      hint = document.createElement('div');
      hint.className = 'fab-hint';
      hint.textContent = t('toc.hint', 'Tahan untuk daftar isi');
      document.body.appendChild(hint);
    }

    function showHintOnce() {
      if (!hint) return;
      hint.classList.add('show');
      setTimeout(hideHint, 4000);
    }
    function hideHint() {
      if (!hint) return;
      hint.classList.remove('show');
    }

    /* ===== Tampil/sembunyi tombol saat scroll ===== */
    function toggleVisibility() {
      var wasShown = btn.classList.contains('show');
      if (window.scrollY > SHOW_AFTER) {
        if (!wasShown) {
          btn.classList.add('show');
          showHintOnce();
        }
      } else {
        btn.classList.remove('show');
        closePanel();
        hideHint();
      }
    }
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    /* ===== Deteksi tap singkat vs tekan & tahan ===== */
    var pressTimer = null;
    var longPressFired = false;

    function startPress() {
      longPressFired = false;
      hideHint();
      if (!mode) return; // tanpa daftar isi -> tidak perlu efek tahan
      btn.classList.add('charging');
      pressTimer = setTimeout(function () {
        longPressFired = true;
        btn.classList.remove('charging');
        togglePanel();
        if (navigator.vibrate) navigator.vibrate(12);
      }, LONG_PRESS_MS);
    }

    function cancelPress() {
      clearTimeout(pressTimer);
      btn.classList.remove('charging');
    }

    function endPress() {
      clearTimeout(pressTimer);
      btn.classList.remove('charging');
      if (longPressFired) {
        longPressFired = false;
        return; // sudah ditangani oleh timer (buka panel)
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      closePanel();
    }

    btn.addEventListener('pointerdown', startPress);
    btn.addEventListener('pointerup', endPress);
    btn.addEventListener('pointerleave', cancelPress);
    btn.addEventListener('pointercancel', cancelPress);
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    /* Dukungan keyboard (Enter/Space) -> selalu scroll ke atas.
       MouseEvent.detail === 0 menandakan klik dari keyboard, bukan
       pointer, jadi tidak akan bentrok dengan pointerdown/up di atas. */
    btn.addEventListener('click', function (e) {
      if (e.detail === 0) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        closePanel();
      }
    });

    /* Klik di luar tombol/panel -> tutup panel */
    document.addEventListener('click', function (e) {
      if (panel && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        closePanel();
      }
    });

    /* ===== Perbarui teks saat bahasa situs diganti (tombol ID/EN) ===== */
    document.querySelectorAll('.lang-btn').forEach(function (langBtn) {
      langBtn.addEventListener('click', function () {
        btn.setAttribute(
          'aria-label',
          mode ? t('toc.ariaLabelMode', 'Kembali ke atas (tap), buka daftar isi (tahan)') : t('toc.ariaLabelSimple', 'Kembali ke atas')
        );
        if (panel) {
          var titleText = panel.querySelector('.toc-panel-title-text');
          if (titleText) titleText.textContent = t('toc.title', 'Daftar Isi');
        }
        if (hint) hint.textContent = t('toc.hint', 'Tahan untuk daftar isi');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
