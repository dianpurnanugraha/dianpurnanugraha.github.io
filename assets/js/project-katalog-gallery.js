/* ===================== GALERI: project-katalog.html ===================== */
(function () {
  function getLang() {
    return localStorage.getItem('site-lang') || 'id';
  }

  function dict() {
    return (window.I18N_PAGE && window.I18N_PAGE[getLang()]) || {};
  }

  var CATALOGS = [
    {
      category: 'herbal',
      brand: 'Halal Care',
      title: { id: 'Katalog Produk Halal Care', en: 'Halal Care Product Catalog' },
      details: { id: '25 Halaman · Digital & Cetak', en: '25 Pages · Digital & Print' },
      cover: 'assets/img/katalog/halal-care-cover.webp',
      pdf: 'assets/files/katalog/katalog-produk-halal-care.pdf'
    }
  ];

  var CATEGORIES = ['all', 'herbal'];
  var LABELS = {
    id: { all: 'Semua', herbal: 'Katalog Produk Herbal' },
    en: { all: 'All', herbal: 'Herbal Product Catalogs' }
  };

  var currentCategory = 'all';
  var grid = document.getElementById('galleryGrid');
  var categoryEl = document.getElementById('katalogCategoryFilter');
  var paginateEl = document.getElementById('galleryPagination');
  var infoEl = document.getElementById('galleryPageInfo');

  if (!grid || !categoryEl || !paginateEl || !infoEl) return;

  function filteredCatalogs() {
    if (currentCategory === 'all') return CATALOGS;
    return CATALOGS.filter(function (catalog) {
      return catalog.category === currentCategory;
    });
  }

  function openPreview(catalog) {
    if (window.matchMedia('(max-width: 768px)').matches) {
      window.open(catalog.pdf, '_blank', 'noopener');
      return;
    }

    var d = dict();
    var overlay = document.createElement('div');
    overlay.className = 'catalog-pdf-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', d['catalog.preview'] || 'Preview Katalog');
    overlay.innerHTML =
      '<div class="catalog-pdf-dialog">' +
        '<div class="catalog-pdf-head">' +
          '<strong>' + (catalog.title[getLang()] || catalog.title.id) + '</strong>' +
          '<button type="button" class="catalog-pdf-close" aria-label="' + (d['catalog.close'] || 'Tutup') + '"><i class="fa-solid fa-xmark"></i></button>' +
        '</div>' +
        '<iframe src="' + catalog.pdf + '#view=FitH" title="' + (catalog.title[getLang()] || catalog.title.id) + '"></iframe>' +
      '</div>';

    function closeModal() {
      document.removeEventListener('keydown', onKeydown);
      overlay.remove();
      document.body.style.overflow = '';
    }

    function onKeydown(event) {
      if (event.key === 'Escape') closeModal();
    }

    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeModal();
    });
    overlay.querySelector('.catalog-pdf-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', onKeydown);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.catalog-pdf-close').focus();
  }

  function buildCard(catalog) {
    var lang = getLang();
    var d = dict();
    var card = document.createElement('article');
    card.className = 'slider-card catalog-card';
    card.innerHTML =
      '<div class="slider-card-imgbox catalog-cover">' +
        '<img src="' + catalog.cover + '" alt="' + (catalog.title[lang] || catalog.title.id) + '" loading="lazy">' +
      '</div>' +
      '<div class="shot-caption catalog-caption">' +
        '<span class="shot-tag">' + catalog.brand + '</span>' +
        '<span>' + (catalog.title[lang] || catalog.title.id) + '</span>' +
      '</div>' +
      '<p class="catalog-details">' + (catalog.details[lang] || catalog.details.id) + '</p>' +
      '<div class="catalog-actions">' +
        '<button type="button" class="catalog-action catalog-preview"><i class="fa-solid fa-eye"></i> <span>' + (d['catalog.preview'] || 'Preview Katalog') + '</span></button>' +
        '<a class="catalog-action" href="' + catalog.pdf + '" download><i class="fa-solid fa-download"></i> <span>' + (d['catalog.download'] || 'Unduh PDF') + '</span></a>' +
      '</div>';

    card.querySelector('.catalog-preview').addEventListener('click', function () {
      openPreview(catalog);
    });
    return card;
  }

  function renderFilters() {
    var labels = LABELS[getLang()] || LABELS.id;
    categoryEl.innerHTML = '';
    CATEGORIES.forEach(function (category) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-btn' + (category === currentCategory ? ' active' : '');
      button.textContent = labels[category];
      button.addEventListener('click', function () {
        currentCategory = category;
        renderFilters();
        renderCatalogs(true);
      });
      categoryEl.appendChild(button);
    });
  }

  function renderCatalogs(shouldScroll) {
    var catalogs = filteredCatalogs();
    grid.innerHTML = '';
    catalogs.forEach(function (catalog) {
      grid.appendChild(buildCard(catalog));
    });
    paginateEl.hidden = true;
    var template = dict()['gallery.pageInfo'] || '{count} katalog';
    infoEl.textContent = template.replace('{count}', catalogs.length);
    if (shouldScroll) {
      var filter = document.getElementById('katalogFilterGroup');
      var top = window.pageYOffset + filter.getBoundingClientRect().top - 66;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }

  renderFilters();
  renderCatalogs(false);

  document.querySelectorAll('.lang-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      setTimeout(function () {
        renderFilters();
        renderCatalogs(false);
      }, 0);
    });
  });
})();
