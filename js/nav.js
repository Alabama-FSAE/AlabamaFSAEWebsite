/* ==========================================================================
   Crimson Racing — Nav behavior (mobile toggle + active link)
   Runs once the header/footer partials have been injected by include.js.
   ========================================================================== */
document.addEventListener('partials:loaded', function () {
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  var path = window.location.pathname;
  document.querySelectorAll('.primary-nav__link').forEach(function (link) {
    var section = link.getAttribute('data-nav-section');
    var href = link.getAttribute('href');
    var isMatch = section ? path.indexOf(section) === 0 : (path === href || (href === '/' && path === '/index.html'));
    if (isMatch) link.setAttribute('aria-current', 'page');
  });

  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
