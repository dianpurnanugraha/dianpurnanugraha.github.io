/* ===================== READING PROGRESS BAR ===================== */
/* Bar tipis di paling atas layar yang mengisi sesuai persentase
   scroll halaman, memberi gambaran seberapa jauh pembaca sudah
   membaca konten. */
(function () {
  function init() {
    var track = document.createElement('div');
    track.className = 'reading-progress-track';
    var bar = document.createElement('div');
    bar.className = 'reading-progress-bar';
    track.appendChild(bar);
    document.body.insertBefore(track, document.body.firstChild);

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
