async function initializeNavigation() {
  const path = location.pathname.split("/").pop() || "index.html";
  let section = "home";
  if (path === "about.html") section = "about";
  if (["cars.html", "car.html", "cr25.html"].includes(path)) section = "cars";
  if (path === "team.html") section = "team";
  if (["sponsors.html", "sponsor-us.html"].includes(path)) section = "sponsors";
  document.querySelector(`[data-nav="${section}"]`)?.setAttribute("aria-current", "page");

  const menuButton = document.getElementById("menuButton");
  const links = document.getElementById("navLinks");
  menuButton?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", open);
    menuButton.textContent = open ? "×" : "☰";
  });

  try {
    const response = await fetch("data/cars.json");
    const cars = await response.json();
    const current = new URLSearchParams(location.search).get("car");
    const carMenu = document.getElementById("carsMenu");
    carMenu.innerHTML = cars.map(car =>
      `<a href="car.html?car=${car.id}"${current === car.id ? ' aria-current="page"' : ""}>${car.name}</a>`
    ).join("");
  } catch (error) {
    console.error("Car navigation could not be loaded.", error);
  }
}
