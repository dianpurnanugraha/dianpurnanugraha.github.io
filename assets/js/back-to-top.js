/* ===================== BACK TO TOP BUTTON ===================== */
/* Tombol otomatis muncul saat halaman di-scroll ke bawah, dan
   membawa pembaca kembali ke atas secara instan saat diklik. */
(function () {
  var SHOW_AFTER = 320; // px scroll sebelum tombol muncul

  function init() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Kembali ke atas');
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btn);

    function toggleVisibility() {
      if (window.scrollY > SHOW_AFTER) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
