/* ==========================================================================
   Crimson Racing — Team page renderer
   Handles two cases from one data file (data/team.json):
   1. team.html — the overview snapshot (management + subteam grid)
   2. team/<subteam-id>.html — an individual subteam subpage
   ========================================================================== */
(function () {
  function photoPlaceholder(caption) {
    var icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/><path d="M8 5l1.3-2h5.4L16 5"/></svg>';
    return '<div class="placeholder">' + icon + '<span class="placeholder__caption">' + caption + '</span></div>';
  }

  function renderOverview(data) {
    var mgmtEl = document.getElementById('management-grid');
    if (mgmtEl) {
      mgmtEl.innerHTML = data.management.map(function (m) {
        return '<div class="person-card">' +
          '<div class="person-card__photo">' + photoPlaceholder(m.role) + '</div>' +
          '<div class="person-card__name">' + m.name + '</div>' +
          '<div class="person-card__role">' + m.role + '</div>' +
        '</div>';
      }).join('');
    }

    var subteamsEl = document.getElementById('subteam-grid');
    if (subteamsEl) {
      subteamsEl.innerHTML = data.subteams.map(function (s) {
        return '<div class="subteam-card">' +
          '<h3>' + s.name + '</h3>' +
          '<p>' + s.shortDescription + ' — Lead: ' + s.leadName + '</p>' +
          '<a class="subteam-card__link" href="/team/' + s.id + '.html">View subteam &rarr;</a>' +
        '</div>';
      }).join('');
    }
  }

  function renderSubteam(data, subteamId) {
    var subteam = data.subteams.find(function (s) { return s.id === subteamId; });
    if (!subteam) {
      console.error('Subteam id "' + subteamId + '" not found in team.json');
      return;
    }
    document.title = subteam.name + ' — Crimson Racing Team';

    var titleEl = document.getElementById('subteam-title');
    if (titleEl) titleEl.textContent = subteam.name;

    var leadEl = document.getElementById('subteam-lead');
    if (leadEl) {
      leadEl.innerHTML =
        '<div class="person-card__photo" style="width:120px;">' + photoPlaceholder(subteam.name + ' Lead') + '</div>' +
        '<div><div class="person-card__name">' + subteam.leadName + '</div><div class="person-card__role">' + subteam.name + ' Lead</div></div>';
    }

    var missionEl = document.getElementById('subteam-mission');
    if (missionEl) missionEl.textContent = subteam.mission;

    var rolesEl = document.getElementById('subteam-roles');
    if (rolesEl) {
      rolesEl.innerHTML = subteam.roles.map(function (r) {
        return '<div class="role-list__item"><h3>' + r.title + '</h3><p>' + r.description + '</p></div>';
      }).join('');
    }
  }

  function boot() {
    fetch('/data/team.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var subteamId = document.body.getAttribute('data-subteam-id');
        if (subteamId) {
          renderSubteam(data, subteamId);
        } else {
          renderOverview(data);
        }
      })
      .catch(function (err) { console.error('Could not load team data', err); });
  }

  if (document.querySelector('[data-include]')) {
    document.addEventListener('partials:loaded', boot);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
