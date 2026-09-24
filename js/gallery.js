/* ==========================================================================
   Crimson Racing — Gallery behaviors
   ========================================================================== */
window.CrimsonGallery = (function () {

  // ---- Rotating hero gallery (car pages) ----
  // Auto-advances, but always gives the visitor manual control (arrows/dots)
  // and pauses on hover/focus — auto-rotating content shouldn't be inescapable.
  function initHero(container) {
    var slides = Array.prototype.slice.call(container.querySelectorAll('.hero-gallery__slide'));
    var dots = Array.prototype.slice.call(container.querySelectorAll('.hero-gallery__dot'));
    var prevBtn = container.querySelector('.hero-gallery__arrow--prev');
    var nextBtn = container.querySelector('.hero-gallery__arrow--next');
    var index = 0;
    var timer = null;
    var AUTO_MS = 4500;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle('is-active', si === index); });
      dots.forEach(function (d, di) { d.toggleAttribute('aria-current', di === index); if (di === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    }

    function start() {
      if (reduceMotion || slides.length < 2) return;
      stop();
      timer = window.setInterval(function () { show(index + 1); }, AUTO_MS);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); start(); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { show(i); start(); }); });

    container.addEventListener('mouseenter', stop);
    container.addEventListener('mouseleave', start);
    container.addEventListener('focusin', stop);
    container.addEventListener('focusout', start);

    show(0);
    start();
  }

  // ---- Gallery page: year tabs + category filter ----
  function initGalleryPage(data) {
    var yearTabsEl = document.getElementById('gallery-year-tabs');
    var filtersEl = document.getElementById('gallery-filters');
    var gridEl = document.getElementById('gallery-grid');
    if (!yearTabsEl || !gridEl) return;

    var years = data.years.map(function (y) { return y.year; });
    var activeYear = years[0];
    var activeCategory = 'all';

    function categoriesForYear(year) {
      var yearData = data.years.find(function (y) { return y.year === year; });
      var cats = {};
      yearData.items.forEach(function (item) { cats[item.category] = true; });
      return Object.keys(cats);
    }

    function renderTabs() {
      yearTabsEl.innerHTML = years.map(function (y) {
        return '<button aria-selected="' + (y === activeYear) + '" data-year="' + y + '">' + y + '</button>';
      }).join('');
    }

    function renderFilters() {
      var cats = ['all'].concat(categoriesForYear(activeYear));
      filtersEl.innerHTML = cats.map(function (c) {
        var label = c === 'all' ? 'All' : c;
        return '<button aria-pressed="' + (c === activeCategory) + '" data-category="' + c + '">' + label + '</button>';
      }).join('');
    }

    function renderGrid() {
      var yearData = data.years.find(function (y) { return y.year === activeYear; });
      var items = yearData.items.filter(function (item) {
        return activeCategory === 'all' || item.category === activeCategory;
      });
      gridEl.innerHTML = items.map(function (item) {
        var icon = item.type === 'video'
          ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M8 5l1.3-2h5.4L16 5"/></svg>';
        return '<div class="placeholder">' + icon + '<span class="placeholder__caption">' + item.caption + '</span></div>';
      }).join('') || '<p class="text-muted">No items in this category yet.</p>';
    }

    yearTabsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-year]');
      if (!btn) return;
      activeYear = Number(btn.getAttribute('data-year'));
      activeCategory = 'all';
      renderTabs(); renderFilters(); renderGrid();
    });

    filtersEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-category]');
      if (!btn) return;
      activeCategory = btn.getAttribute('data-category');
      renderFilters(); renderGrid();
    });

    renderTabs(); renderFilters(); renderGrid();
  }

  return { initHero: initHero, initGalleryPage: initGalleryPage };
})();
