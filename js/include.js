/* ==========================================================================
   Crimson Racing — Include pattern
   Loads the shared header/footer partials into any element with
   [data-include]. Requires the page to be served over http(s) — opening an
   HTML file directly (file://) will not work due to browser fetch security.
   See README.md for how to run a local server.
   ========================================================================== */
(function () {
  var includeTargets = document.querySelectorAll('[data-include]');
  var pending = includeTargets.length;

  if (pending === 0) {
    document.dispatchEvent(new CustomEvent('partials:loaded'));
    return;
  }

  includeTargets.forEach(function (el) {
    var path = el.getAttribute('data-include');
    fetch(path)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + path + ' (' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        el.outerHTML = html;
      })
      .catch(function (err) {
        console.error(err);
        el.innerHTML = '<p style="padding:1rem;color:#9E1B32;">Could not load ' + path + '. Are you running a local server? See README.md.</p>';
      })
      .finally(function () {
        pending -= 1;
        if (pending === 0) {
          document.dispatchEvent(new CustomEvent('partials:loaded'));
        }
      });
  });
})();
