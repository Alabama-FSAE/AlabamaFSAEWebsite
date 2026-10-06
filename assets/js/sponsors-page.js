async function renderSponsors() {
  const response = await fetch("data/sponsors.json");
  const sponsors = await response.json();
  document.querySelectorAll("[data-sponsor-tier]").forEach(grid => {
    const tier = grid.dataset.sponsorTier;
    grid.innerHTML = sponsors.filter(sponsor => sponsor.tier === tier).map(sponsor => {
      const content = sponsor.logo
        ? `<img src="${sponsor.logo}" alt="${sponsor.name}">`
        : `<div><b>${sponsor.name}</b><small>Logo artwork needed</small></div>`;
      return sponsor.website
        ? `<a class="logo-card known" href="${sponsor.website}" target="_blank" rel="noopener">${content}</a>`
        : `<div class="logo-card${sponsor.name !== "Sponsor logo" ? " known" : ""}">${content}</div>`;
    }).join("");
  });
}

renderSponsors().catch(error => console.error("Sponsors could not be loaded.", error));
