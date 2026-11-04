const thumbnailFor = image => image.replace(/([^/]+)\.[^.]+$/, "thumbs/$1.jpg");

async function initializeCarArchive() {
  const response = await fetch("data/cars.json");
  if (!response.ok) throw new Error("Car archive could not be loaded");
  const cars = await response.json();
  const photosResponse = await fetch("data/car-photos.json");
  if (!photosResponse.ok) throw new Error("Car photos could not be loaded");
  const photosByCar = await photosResponse.json();
  const featured = cars.find(car => car.id === "cr26e");
  const archive = cars.filter(car => car !== featured).sort((a, b) => b.year - a.year);
  const featuredContainer = document.getElementById("featuredCar");
  const grid = document.getElementById("carGrid");


  if (featured) {
    const section = document.createElement("article");
    section.className = "featured";
    const featuredPhotos = photosByCar[featured.id] || [];
    const image = document.createElement(featuredPhotos.length ? "img" : "div");
    image.className = featuredPhotos.length ? "featured-image" : "featured-image featured-placeholder";
    if (featuredPhotos.length) {
      image.src = featuredPhotos[0];
      image.alt = featured.name;
    } else {
      image.textContent = featured.name;
      image.setAttribute("aria-hidden", "true");
    }
    const copy = document.createElement("div");
    copy.className = "featured-copy";
    const label = document.createElement("div");
    label.className = "mono red";
    label.textContent = "Current build // " + featured.year;
    const title = document.createElement("h2");
    title.textContent = featured.name;
    const description = document.createElement("p");
    description.textContent = "Meet Crimson Racing’s first electric vehicle and explore the team’s latest build.";
    const link = document.createElement("a");
    link.className = "btn featured-link";
    link.href = `car.html?car=${encodeURIComponent(featured.id)}`;
    link.textContent = "Explore " + featured.name + " →";
    copy.append(label, title, description, link);
    section.append(image, copy);
    featuredContainer.append(section);
  }

  archive.forEach(car => {
    const link = document.createElement("a");
    link.className = "car-card";
    link.href = `car.html?car=${encodeURIComponent(car.id)}`;
    link.setAttribute("aria-label", `View ${car.name} details`);
    let visual;
    const photos = photosByCar[car.id] || [];
    if (photos.length) {
      visual = document.createElement("img");
      visual.className = "car-photo";
      visual.src = thumbnailFor(photos[0]);
      visual.alt = "";
      visual.loading = "lazy";
    } else {
      visual = document.createElement("div");
      visual.className = "car-placeholder";
      visual.textContent = car.name;
      visual.setAttribute("aria-hidden", "true");
    }
    const body = document.createElement("div");
    body.className = "card-body";
    const details = document.createElement("div");
    const year = document.createElement("div");
    year.className = "mono";
    year.textContent = car.year;
    const title = document.createElement("h3");
    title.textContent = car.name;
    const arrow = document.createElement("span");
    arrow.className = "card-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    details.append(year, title);
    body.append(details, arrow);
    link.append(visual, body);
    grid.append(link);
  });
}

initializeCarArchive().catch(error => {
  console.error(error);
  document.getElementById("archiveError").hidden = false;
});
