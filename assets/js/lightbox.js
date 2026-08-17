/* ===================== LIGHTBOX GALERI FOTO =====================
   Klik gambar apa pun di dalam kartu galeri (slider produk, kotak
   gambar tunggal, atau grid statis) -> terbuka fullscreen dengan:
     - Zoom (scroll/pinch, atau klik/tap dua kali)
     - Geser gambar saat sedang di-zoom (drag / touch)
     - Navigasi ke gambar lain dalam grup yang sama (panah, swipe,
       tombol panah keyboard)
     - Tombol tutup, klik area luar, atau tombol Esc

   Pakai event delegation di document, jadi tetap berfungsi untuk
   gambar yang baru dirender oleh script lain (slider produk, logo
   grid, dsb) sesudah file ini dimuat. Cukup include sekali di
   halaman mana pun yang punya galeri gambar.
   ================================================================== */
(function () {
  var SELECTOR_CANDIDATES = '.media-slide img, .slider-card-imgbox img, .gallery-item-img img';
  var MAX_ZOOM = 4;
  var MIN_ZOOM = 1;
  var ZOOM_STEP = 0.5;
  var DOUBLE_TAP_ZOOM = 2.2;

  var overlay, imgEl, counterEl, prevBtn, nextBtn, closeBtn, stage;
  var group = [];
  var index = 0;
  var scale = 1;
  var translateX = 0;
  var translateY = 0;
  var isOpen = false;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>' +
      '<button type="button" class="lightbox-arrow lightbox-prev" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<div class="lightbox-stage">' +
        '<img class="lightbox-img" alt="">' +
      '</div>' +
      '<button type="button" class="lightbox-arrow lightbox-next" aria-label="Selanjutnya"><i class="fa-solid fa-chevron-right"></i></button>' +
      '<div class="lightbox-counter"></div>' +
      '<div class="lightbox-hint">Scroll / cubit untuk zoom &nbsp;•&nbsp; Geser untuk pindah gambar</div>';
    document.body.appendChild(overlay);

    stage = overlay.querySelector('.lightbox-stage');
    imgEl = overlay.querySelector('.lightbox-img');
    counterEl = overlay.querySelector('.lightbox-counter');
    prevBtn = overlay.querySelector('.lightbox-prev');
    nextBtn = overlay.querySelector('.lightbox-next');
    closeBtn = overlay.querySelector('.lightbox-close');

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target === stage) close();
    });

    imgEl.addEventListener('dblclick', function (e) {
      toggleZoom(e);
    });

    imgEl.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setZoom(scale + delta, e.clientX, e.clientY);
    }, { passive: false });

    initDragAndTouch();
  }

  /* ===== Kumpulkan grup gambar berdasarkan konteks kartu ===== */
  function findGroup(clickedImg) {
    var slidesWrap = clickedImg.closest('.media-slider-slides');
    if (slidesWrap) {
      return Array.prototype.slice.call(slidesWrap.querySelectorAll('img'));
    }
    var gridParent = clickedImg.closest('.gallery-item-img');
    if (gridParent && gridParent.parentElement) {
      return Array.prototype.slice.call(
        gridParent.parentElement.querySelectorAll('.gallery-item-img img')
      );
    }
    return [clickedImg];
  }

  function open(clickedImg) {
    if (!overlay) buildOverlay();
    group = findGroup(clickedImg);
    index = group.indexOf(clickedImg);
    if (index < 0) index = 0;

    isOpen = true;
    overlay.classList.add('open');
    document.body.classList.add('lightbox-lock');
    render();
  }

  function close() {
    isOpen = false;
    overlay.classList.remove('open');
    document.body.classList.remove('lightbox-lock');
    resetZoom();
  }

  function render() {
    var src = group[index].currentSrc || group[index].src;
    imgEl.src = src;
    imgEl.alt = group[index].alt || '';
    resetZoom();

    var multi = group.length > 1;
    prevBtn.style.display = multi ? '' : 'none';
    nextBtn.style.display = multi ? '' : 'none';
    counterEl.style.display = multi ? '' : 'none';
    counterEl.textContent = (index + 1) + ' / ' + group.length;
  }

  function go(dir) {
    if (group.length <= 1) return;
    index = (index + dir + group.length) % group.length;
    render();
  }

  /* ===== Zoom ===== */
  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
    imgEl.classList.remove('zoomed');
  }

  function setZoom(next, clientX, clientY) {
    var clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    if (clamped === scale) return;

    if (clamped === MIN_ZOOM) {
      translateX = 0;
      translateY = 0;
    } else if (clientX != null && clientY != null) {
      var rect = imgEl.getBoundingClientRect();
      var offsetX = clientX - (rect.left + rect.width / 2);
      var offsetY = clientY - (rect.top + rect.height / 2);
      var ratio = clamped / scale;
      translateX = (translateX - offsetX) * ratio + offsetX;
      translateY = (translateY - offsetY) * ratio + offsetY;
    }

    scale = clamped;
    imgEl.classList.toggle('zoomed', scale > 1);
    applyTransform();
  }

  function toggleZoom(e) {
    if (scale > 1) {
      setZoom(1);
    } else {
      setZoom(DOUBLE_TAP_ZOOM, e.clientX, e.clientY);
    }
  }

  function applyTransform() {
    imgEl.style.transform = 'translate(' + translateX + 'px,' + translateY + 'px) scale(' + scale + ')';
  }

  /* ===== Drag (saat zoom) + swipe (saat tidak zoom) + pinch ===== */
  function initDragAndTouch() {
    var dragging = false;
    var startX = 0, startY = 0, startTX = 0, startTY = 0;
    var swipeStartX = 0, swipeStartY = 0, swipeActive = false;
    var pinchStartDist = 0, pinchStartScale = 1;

    imgEl.addEventListener('mousedown', function (e) {
      if (scale <= 1) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startTX = translateX; startTY = translateY;
      imgEl.classList.add('dragging');
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      translateX = startTX + (e.clientX - startX);
      translateY = startTY + (e.clientY - startY);
      applyTransform();
    });
    window.addEventListener('mouseup', function () {
      dragging = false;
      imgEl.classList.remove('dragging');
    });

    imgEl.addEventListener('touchstart', function (e) {
      if (e.touches.length === 2) {
        pinchStartDist = touchDist(e.touches);
        pinchStartScale = scale;
      } else if (e.touches.length === 1) {
        if (scale > 1) {
          dragging = true;
          startX = e.touches[0].clientX; startY = e.touches[0].clientY;
          startTX = translateX; startTY = translateY;
        } else {
          swipeActive = true;
          swipeStartX = e.touches[0].clientX;
          swipeStartY = e.touches[0].clientY;
        }
      }
    }, { passive: true });

    imgEl.addEventListener('touchmove', function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var dist = touchDist(e.touches);
        var next = pinchStartScale * (dist / pinchStartDist);
        var midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        var midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        setZoom(next, midX, midY);
      } else if (dragging) {
        translateX = startTX + (e.touches[0].clientX - startX);
        translateY = startTY + (e.touches[0].clientY - startY);
        applyTransform();
      } else if (swipeActive) {
        var dx = e.touches[0].clientX - swipeStartX;
        var dy = e.touches[0].clientY - swipeStartY;
        if (Math.abs(dy) > Math.abs(dx)) swipeActive = false;
      }
    }, { passive: false });

    imgEl.addEventListener('touchend', function (e) {
      if (swipeActive) {
        var endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : swipeStartX;
        var dx = endX - swipeStartX;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }
      dragging = false;
      swipeActive = false;
    });

    function touchDist(touches) {
      var dx = touches[0].clientX - touches[1].clientX;
      var dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  /* ===== Keyboard ===== */
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
    else if (e.key === '+') setZoom(scale + ZOOM_STEP);
    else if (e.key === '-') setZoom(scale - ZOOM_STEP);
  });

  /* ===== Delegasi klik: tangkap gambar galeri, termasuk yang
     dirender belakangan oleh script lain ===== */
  document.addEventListener('click', function (e) {
    var img = e.target.closest(SELECTOR_CANDIDATES);
    if (!img) return;
    e.preventDefault();
    open(img);
  });
})();
