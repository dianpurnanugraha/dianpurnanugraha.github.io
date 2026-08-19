// Menyamakan tinggi kolom kiri (Form + Sosmed) dan kolom kanan (Respons + FAQ)
// pada halaman Contact, HANYA sekali saat load/resize (bukan saat FAQ dibuka/tutup),
// supaya kaki card Sosmed & FAQ sejajar tanpa card Form ikut melebar saat accordion FAQ dibuka.
(function () {
  function alignContactColumns() {
    var columns = document.querySelectorAll('.contact-columns > .contact-col');
    var formPanel = document.getElementById('toc-form');
    if (columns.length < 2 || !formPanel) return;

    // Reset dulu supaya pengukuran selalu dari tinggi asli/natural.
    formPanel.style.minHeight = '';

    // Hanya berlaku di layout 2 kolom (desktop/tablet lebar).
    if (window.matchMedia('(max-width: 980px)').matches) return;

    var leftHeight = columns[0].offsetHeight;
    var rightHeight = columns[1].offsetHeight;
    var diff = rightHeight - leftHeight;

    if (diff > 0) {
      var currentHeight = formPanel.offsetHeight;
      formPanel.style.minHeight = (currentHeight + diff) + 'px';
    }
  }

  document.addEventListener('DOMContentLoaded', alignContactColumns);
  window.addEventListener('load', alignContactColumns);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(alignContactColumns, 150);
  });
})();
