/* ==========================================================================
   Crimson Racing — Loading screen animation
   Plays every time the home page loads. Fixed-duration, eased animation
   (not tied to real network load time — see project README for why).
   ========================================================================== */
(function () {
  var screen = document.getElementById('loading-screen');
  if (!screen) return;

  var car = screen.querySelector('.loader-car');
  var lines = Array.prototype.slice.call(screen.querySelectorAll('.loader-speedlines span'));
  var logo = screen.querySelector('.loader-logo');
  var skipBtn = screen.querySelector('.loader-skip');
  var stage = screen.querySelector('.loader-stage');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 1400; // ms — fixed, deliberately not tied to real load progress
  var MAX_LINE_LENGTH = 46; // px
  var carWidth = 84;

  document.body.style.overflow = 'hidden';

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function finish() {
    document.body.style.overflow = '';
    screen.classList.add('is-hidden');
    window.setTimeout(function () {
      screen.style.display = 'none';
    }, 420);
  }

  if (reduceMotion) {
    finish();
    return;
  }

  var startTime = null;
  var prevEased = 0;

  function frame(now) {
    if (startTime === null) startTime = now;
    var elapsed = now - startTime;
    var t = Math.min(elapsed / DURATION, 1);
    var eased = easeInOutCubic(t);

    var stageWidth = stage.clientWidth;
    var x = eased * (stageWidth + carWidth) - carWidth;
    car.style.transform = 'translateX(' + x + 'px)';

    // Instantaneous "speed" approximated as the change in eased position
    // this frame — trailing speed lines use the same easing curve as the car.
    var velocity = eased - prevEased;
    prevEased = eased;
    var normalizedSpeed = Math.min(velocity * 40, 1); // scale factor tuned for a ~60fps frame delta
    lines.forEach(function (line, i) {
      var factor = 1 - i * 0.22; // each successive line a bit shorter
      line.style.width = Math.max(normalizedSpeed * MAX_LINE_LENGTH * factor, 0) + 'px';
      line.style.transform = 'translateX(' + (x - 10 - i * 6) + 'px)';
    });

    // Logo fades/wipes in left-to-right as the car passes the midpoint
    var revealStart = 0.32, revealEnd = 0.68;
    var revealT = Math.min(Math.max((t - revealStart) / (revealEnd - revealStart), 0), 1);
    logo.style.clipPath = 'inset(0 ' + (100 - revealT * 100) + '% 0 0)';

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      lines.forEach(function (line) { line.style.width = '0px'; });
      window.setTimeout(finish, 200);
    }
  }

  requestAnimationFrame(frame);

  if (skipBtn) {
    skipBtn.addEventListener('click', finish);
  }
})();
