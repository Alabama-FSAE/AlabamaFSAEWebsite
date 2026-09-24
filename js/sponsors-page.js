/* ==========================================================================
   Crimson Racing — Sponsors page renderer
   Reads data/sponsors.json and renders the tiered logo wall into
   #sponsor-tiers. Add/remove sponsors freely in the JSON — this renders
   whatever tiers/sponsors are there, no HTML edits required.
   ========================================================================== */
(function () {
  function placeholder(caption) {
    var icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M8 5l1.3-2h5.4L16 5"/></svg>';
    return '<div class="placeholder">' + icon + '<span class="placeholder__caption">' + caption + '</span></div>';
  }

  function render(data) {
    var tiersEl = document.getElementById('sponsor-tiers');
    if (!tiersEl) return;
    tiersEl.innerHTML = data.tiers.map(function (tier) {
      return '<div class="tier-block">' +
        '<h3 class="tier-block__title">' + tier.name + '</h3>' +
        '<div class="logo-wall">' +
          tier.sponsors.map(function (s) {
            return '<a href="' + s.url + '" target="_blank" rel="noopener">' + placeholder(s.name) + '</a>';
          }).join('') +
        '</div>' +
      '</div>';
    }).join('');
  }

  function boot() {
    fetch('/data/sponsors.json')
      .then(function (res) { return res.json(); })
      .then(render)
      .catch(function (err) { console.error('Could not load sponsor data', err); });
  }

  if (document.querySelector('[data-include]')) {
    document.addEventListener('partials:loaded', boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
