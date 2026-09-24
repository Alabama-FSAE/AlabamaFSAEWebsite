/* ==========================================================================
   Crimson Racing — Vertical tabs (car spec sections)
   ========================================================================== */
(function () {
  function activate(tabs, panels, index) {
    tabs.forEach(function (tab, i) {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    panels.forEach(function (panel, i) {
      panel.classList.toggle('is-active', i === index);
    });
  }

  function init() {
    document.querySelectorAll('.vtabs').forEach(function (group) {
      var tabs = Array.prototype.slice.call(group.querySelectorAll('.vtabs__tab'));
      var panels = Array.prototype.slice.call(group.querySelectorAll('.vtabs__panel'));

      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { activate(tabs, panels, i); });
        tab.addEventListener('keydown', function (e) {
          var dir = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1
                  : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
          if (!dir) return;
          e.preventDefault();
          var next = (i + dir + tabs.length) % tabs.length;
          tabs[next].focus();
          activate(tabs, panels, next);
        });
      });
    });
  }

  if (document.querySelector('[data-include]')) {
    document.addEventListener('partials:loaded', init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
