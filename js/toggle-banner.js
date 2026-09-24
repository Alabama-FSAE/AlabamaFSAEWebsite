/* ==========================================================================
   Crimson Racing — Toggle banner (About: FSAE/Our Team, Sponsors: Sponsors/Sponsor Us)
   Reusable: any .toggle-banner whose buttons carry [data-target] pointing at
   a matching [data-panel] element.
   ========================================================================== */
(function () {
  function init() {
    document.querySelectorAll('.toggle-banner').forEach(function (banner) {
      var sides = Array.prototype.slice.call(banner.querySelectorAll('.toggle-banner__side'));
      sides.forEach(function (side) {
        side.addEventListener('click', function () {
          var targetId = side.getAttribute('data-target');
          sides.forEach(function (s) { s.setAttribute('aria-pressed', String(s === side)); });
          document.querySelectorAll('.toggle-panel').forEach(function (panel) {
            panel.classList.toggle('is-active', panel.id === targetId);
          });
          if (history.replaceState) {
            history.replaceState(null, '', '#' + targetId);
          }
        });
      });

      // Deep-link support: ?#panel-id opens straight to that side
      var hash = window.location.hash.replace('#', '');
      if (hash) {
        var match = sides.find(function (s) { return s.getAttribute('data-target') === hash; });
        if (match) match.click();
      }
    });
  }

  if (document.querySelector('[data-include]')) {
    document.addEventListener('partials:loaded', init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
