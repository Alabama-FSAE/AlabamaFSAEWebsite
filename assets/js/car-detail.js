const thumbnailFor = image => image.replace(/([^/]+)\.[^.]+$/, "thumbs/$1.jpg");

async function renderCarDetail() {
  const response = await fetch("data/cars.json");
  const cars = await response.json();
  const photosResponse = await fetch("data/car-photos.json");
  if (!photosResponse.ok) throw new Error("Car photos could not be loaded");
  const photosByCar = await photosResponse.json();
  const requested = new URLSearchParams(location.search).get("car") || "cr22";
  const index = Math.max(0, cars.findIndex(car => car.id === requested));
  const car = cars[index];
  const number = car.name.replace("CR", "");
  const photos = photosByCar[car.id] || [];
  const mainPhoto = photos[0];

  document.title = `${car.name} | Crimson Racing`;
  document.getElementById("carHero").style.backgroundImage = mainPhoto ? `url("${encodeURI(mainPhoto)}")` : "none";
  document.getElementById("heroMeta").textContent = `${car.year} // Competition`;
  document.getElementById("carTitle").innerHTML = `CR<span class="red">${number}</span>`;
  document.getElementById("navCar").textContent = car.name;
  document.getElementById("specMeta").textContent = `Engineering // ${car.name}`;
  document.getElementById("teamMeta").textContent = `The team // ${car.year}`;
  document.getElementById("facultyText").textContent = "Faculty Advisor: Paul Puzinauskas";
  document.getElementById("awardText").textContent = car.award;

  const href = item => `car.html?car=${item.id}`;
  const previous = document.getElementById("prevCar");
  const next = document.getElementById("nextCar");
  previous.href = index < cars.length - 1 ? href(cars[index + 1]) : "#";
  previous.style.visibility = index === cars.length - 1 ? "hidden" : "visible";
  next.href = index > 0 ? href(cars[index - 1]) : "#";
  next.style.visibility = index === 0 ? "hidden" : "visible";

  document.getElementById("resultsList").innerHTML = car.results.map(result =>
    `<div class="timing-row"><b>${result.event}</b><strong>${result.placement}</strong></div>`
  ).join("");
  document.getElementById("leadersList").innerHTML = car.leadership.map((person, i) =>
    `<article class="leader${i < 3 ? " manager" : ""}"><b>${person.name}</b><span>${person.role}</span></article>`
  ).join("");
  document.getElementById("specVisual").style.backgroundImage = mainPhoto ? `url("${encodeURI(mainPhoto)}")` : "none";
  document.getElementById("specList").innerHTML = Object.entries(car.specifications).map(([name, value]) =>
    `<div class="spec-card"><span>${name}</span><strong>${value}</strong><small>Technical data to be added</small></div>`
  ).join("");

  const stage = document.getElementById("galleryStage");
  const thumbs = document.getElementById("thumbs");
  const message = document.getElementById("galleryMessage");
  if (!photos.length) {
    stage.hidden = true;
    thumbs.hidden = true;
    message.textContent = "Photos for this car are coming soon.";
  } else {
    message.textContent = "Explore photos from this car’s archive.";
    const showPhoto = image => { stage.style.backgroundImage = `url("${encodeURI(image)}")`; };
    showPhoto(photos[0]);
    photos.forEach((image, index) => {
      const button = document.createElement("button");
      button.className = "thumb" + (index === 0 ? " active" : "");
      button.type = "button";
      button.setAttribute("aria-label", `Show ${car.name} photo ${index + 1}`);
      button.style.backgroundImage = `url("${encodeURI(thumbnailFor(image))}")`;
      button.addEventListener("click", () => {
        showPhoto(image);
        thumbs.querySelectorAll(".thumb").forEach(item => item.classList.toggle("active", item === button));
      });
      thumbs.append(button);
    });
  }
}

renderCarDetail().catch(error => console.error("Car details could not be loaded.", error));
