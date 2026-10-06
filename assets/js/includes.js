async function loadInclude(selector, path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  const html = await response.text();
  const target = document.querySelector(selector);
  if (target) target.outerHTML = html;
}

async function loadSiteChrome() {
  try {
    await Promise.all([
      loadInclude("#site-header", "includes/header.html"),
      loadInclude("#site-footer", "includes/footer.html")
    ]);
    await initializeNavigation();
  } catch (error) {
    console.error("Shared page elements could not be loaded.", error);
  }
}

loadSiteChrome();
