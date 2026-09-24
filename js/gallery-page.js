/* ==========================================================================
   Crimson Racing — Gallery page boot
   Fetches data/gallery.json and hands it to CrimsonGallery.initGalleryPage()
   (see js/gallery.js), which owns the year-tab + category-filter behavior.
   ========================================================================== */
(function () {
  function boot() {
    fetch('/data/gallery.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (window.CrimsonGallery) window.CrimsonGallery.initGalleryPage(data);
      })
      .catch(function (err) { console.error('Could not load gallery data', err); });
  }

  if (document.querySelector('[data-include]')) {
    document.addEventListener('partials:loaded', boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
