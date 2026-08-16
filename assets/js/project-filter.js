document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');
  if (!buttons.length || !cards.length) return;

  /* ===== AUTO COUNT PER KATEGORI =====
     Menghitung jumlah .project-card per data-category (dan total),
     lalu menampilkannya sebagai badge di sebelah label tombol filter.
     Kalau kamu menambah project baru di HTML, badge angkanya otomatis
     ikut bertambah tanpa perlu diedit manual. */
  var counts = { all: cards.length };
  cards.forEach(function (card) {
    var cat = card.getAttribute('data-category');
    if (!cat) return;
    counts[cat] = (counts[cat] || 0) + 1;
  });

  document.querySelectorAll('.filter-count[data-count-for]').forEach(function (badge) {
    var key = badge.getAttribute('data-count-for');
    badge.textContent = '(' + (counts[key] || 0) + ')';
  });

  /* ===== FILTER KLIK ===== */
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');

      cards.forEach(function (card) {
        var match = cat === 'all' || card.getAttribute('data-category') === cat;
        card.style.display = match ? '' : 'none';
      });
    });
  });
});
