/* ==========================================================================
   Crimson Racing — Car page renderer
   Each car page (cars/<id>.html) is a lightweight shell with
   <body data-car-id="cr25">. This script fetches data/cars.json, finds the
   matching entry, and renders the strip / hero gallery / overview / tabs.
   To add a new car: see the "_readme" note at the top of data/cars.json.
   ========================================================================== */
(function () {
  var PHOTO_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M8 5l1.3-2h5.4L16 5"/></svg>';
  var VIDEO_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

  function placeholder(caption, type) {
    var icon = type === 'video' ? VIDEO_ICON : PHOTO_ICON;
    return '<div class="placeholder">' + icon + '<span class="placeholder__caption">' + caption + '</span></div>';
  }

  function specList(items) {
    if (!items || !items.length) return '<p class="text-muted" style="font-size:var(--text-sm)">No data yet.</p>';
    return '<dl class="spec-list">' + items.map(function (item) {
      return '<div class="spec-list__row"><dt>' + item.label + '</dt><dd>' + item.value + '</dd></div>';
    }).join('') + '</dl>';
  }

  function renderStrip(cars, currentId) {
    var strip = document.getElementById('car-strip');
    if (!strip) return;
    strip.innerHTML = cars.map(function (car) {
      var current = car.id === currentId;
      return '<a class="car-strip__item" href="/cars/' + car.year + '.html"' + (current ? ' aria-current="true"' : '') + '>' +
        '<div class="car-strip__thumb">' + placeholder(car.name) + '</div>' +
        '<div class="car-strip__meta"><span class="car-strip__name">' + car.name + '</span><span class="car-strip__year">' + car.year + '</span></div>' +
      '</a>';
    }).join('');
  }

  function renderHero(car) {
    var wrap = document.getElementById('hero-gallery');
    if (!wrap) return;
    var slides = ['Front 3/4', 'Rear 3/4', 'Side Profile', 'On Track'];
    wrap.innerHTML =
      '<div class="hero-gallery__slides">' +
        slides.map(function (label, i) {
          return '<div class="hero-gallery__slide' + (i === 0 ? ' is-active' : '') + '">' + placeholder(car.name + ' — ' + label) + '</div>';
        }).join('') +
      '</div>' +
      '<button class="hero-gallery__arrow hero-gallery__arrow--prev" aria-label="Previous photo">&#8249;</button>' +
      '<button class="hero-gallery__arrow hero-gallery__arrow--next" aria-label="Next photo">&#8250;</button>' +
      '<div class="hero-gallery__controls">' +
        slides.map(function (_, i) { return '<button class="hero-gallery__dot" aria-label="Slide ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '></button>'; }).join('') +
      '</div>';
    if (window.CrimsonGallery) window.CrimsonGallery.initHero(wrap);
  }

  function renderOverview(car) {
    var titleEl = document.getElementById('car-title');
    if (titleEl) titleEl.textContent = car.name + ' — ' + car.year;
    document.title = car.name + ' (' + car.year + ') — Crimson Racing';

    var philEl = document.getElementById('car-philosophy');
    if (philEl) philEl.textContent = car.designPhilosophy;

    var statsEl = document.getElementById('car-stats');
    if (statsEl) {
      statsEl.innerHTML = car.stats.map(function (s) {
        return '<div class="stat-card"><span class="stat-card__value">' + s.value + '</span><span class="stat-card__label">' + s.label + '</span></div>';
      }).join('');
    }

    var resultsEl = document.getElementById('car-results');
    if (resultsEl) {
      resultsEl.innerHTML =
        '<table class="results-table"><thead><tr><th>Event</th><th class="is-numeric">Score</th><th class="is-numeric">Max</th></tr></thead><tbody>' +
        car.results.map(function (r) {
          return '<tr><td>' + r.event + '</td><td class="is-numeric">' + r.score + '</td><td class="is-numeric">' + r.max + '</td></tr>';
        }).join('') +
        '</tbody></table>';
    }

    var rosterEl = document.getElementById('car-roster');
    if (rosterEl) {
      rosterEl.innerHTML = car.roster.map(function (p) {
        return '<li class="spec-list__row"><dt>' + p.role + '</dt><dd>' + p.name + '</dd></li>';
      }).join('');
    }

    // Performance & dimensions live in the overview, alongside results —
    // not as a separate tab (the confirmed tab list is 5: Powertrain,
    // Chassis & Suspension, Aero, Electrical, Notable/Other).
    var perfEl = document.getElementById('car-performance');
    if (perfEl) perfEl.innerHTML = specList(car.specs.performance);
  }

  function renderTabs(car) {
    var powertrainItems = car.powertrainType === 'electric' ? car.specs.powertrain_electric : car.specs.powertrain_combustion;
    var powertrainLabel = car.powertrainType === 'electric' ? 'Electric Powertrain' : 'Combustion Powertrain';

    var panels = {
      'panel-powertrain': '<p class="text-muted" style="font-size:var(--text-sm);margin-bottom:var(--space-3)">' + powertrainLabel + '</p>' + specList(powertrainItems) +
        '<div class="tab-photo-grid">' + placeholder(car.name + ' — Powertrain Detail') + placeholder(car.name + ' — Engine Bay') + '</div>',
      'panel-chassis': specList(car.specs.chassis) +
        '<div class="tab-photo-grid">' + placeholder(car.name + ' — Chassis') + placeholder(car.name + ' — Suspension Detail') + '</div>',
      'panel-aero': '<p style="font-size:var(--text-sm);margin-bottom:var(--space-4)">' + car.specs.aero.description + '</p>' + specList(car.specs.aero.elements) +
        '<div class="tab-photo-grid">' + placeholder(car.name + ' — Front Wing') + placeholder(car.name + ' — Undertray') + '</div>',
      'panel-electrical': '<p style="font-size:var(--text-sm);margin-bottom:var(--space-4)">' + car.specs.electrical.description + '</p>' + specList(car.specs.electrical.elements) +
        '<div class="tab-photo-grid">' + placeholder(car.name + ' — Wiring Harness') + placeholder(car.name + ' — Dash/DAQ') + '</div>',
      'panel-notable': car.specs.notable.map(function (n) {
        return '<div class="role-list__item"><h3>' + n.title + '</h3><p>' + n.description + '</p></div>';
      }).join('') +
        '<div class="tab-photo-grid">' + placeholder(car.name + ' — Notable Detail') + placeholder(car.name + ' — Team at Work') + '</div>'
    };

    Object.keys(panels).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = panels[id];
    });
  }

  function render(data) {
    var carId = document.body.getAttribute('data-car-id');
    var car = data.cars.find(function (c) { return c.id === carId; });
    if (!car) {
      console.error('Car id "' + carId + '" not found in cars.json');
      return;
    }
    renderStrip(data.cars, carId);
    renderHero(car);
    renderOverview(car);
    renderTabs(car);
  }

  function boot() {
    fetch('/data/cars.json')
      .then(function (res) { return res.json(); })
      .then(render)
      .catch(function (err) { console.error('Could not load car data', err); });
  }

  if (document.querySelector('[data-include]')) {
    document.addEventListener('partials:loaded', boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
