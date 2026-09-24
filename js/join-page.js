/* ==========================================================================
   Crimson Racing — Join Us page renderer
   Reuses data/team.json's subteam list (name + shortDescription) so the
   quick blurbs here can't drift out of sync with the Team pages. Renders
   into #join-subteam-grid.
   ========================================================================== */
(function () {
  function render(data) {
    var gridEl = document.getElementById('join-subteam-grid');
    if (!gridEl) return;
    gridEl.innerHTML = data.subteams.map(function (s) {
      return '<div class="subteam-card">' +
        '<h3>' + s.name + '</h3>' +
        '<p>' + s.shortDescription + '</p>' +
        '<a class="subteam-card__link" href="/team/' + s.id + '.html">Learn more &rarr;</a>' +
      '</div>';
    }).join('');
  }

  function boot() {
    fetch('/data/team.json')
      .then(function (res) { return res.json(); })
      .then(render)
      .catch(function (err) { console.error('Could not load team data', err); });
  }

  if (document.querySelector('[data-include]')) {
    document.addEventListener('partials:loaded', boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
