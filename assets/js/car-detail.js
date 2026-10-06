async function renderCarDetail() {
  const response = await fetch("data/cars.json");
  const cars = await response.json();
  const requested = new URLSearchParams(location.search).get("car") || "cr22";
  const index = Math.max(0, cars.findIndex(car => car.id === requested));
  const car = cars[index];
  const number = car.name.replace("CR", "");

  document.title = `${car.name} | Crimson Racing`;
  document.getElementById("carHero").style.backgroundImage = `url('${car.image}')`;
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
  previous.href = index > 0 ? href(cars[index - 1]) : "#";
  previous.style.visibility = index === 0 ? "hidden" : "visible";
  next.href = index < cars.length - 1 ? href(cars[index + 1]) : "#";
  next.style.visibility = index === cars.length - 1 ? "hidden" : "visible";

  document.getElementById("heroStats").innerHTML = car.results.slice(0, 4).map(result =>
    `<div><strong>${result.placement}</strong><span>${result.event}</span></div>`
  ).join("");
  document.getElementById("resultsList").innerHTML = car.results.map((result, i) =>
    `<div class="timing-row"><span class="pos">${String(i + 1).padStart(2, "0")}</span><b>${result.event}</b><strong>${result.placement}</strong></div>`
  ).join("");
  document.getElementById("leadersList").innerHTML = car.leadership.map((person, i) =>
    `<article class="leader${i < 3 ? " manager" : ""}"><b>${person.name}</b><span>${person.role}</span></article>`
  ).join("");
  document.getElementById("specVisual").style.backgroundImage = `url('${car.image}')`;
  document.getElementById("specList").innerHTML = Object.entries(car.specifications).map(([name, value]) =>
    `<div class="spec-card"><span>${name}</span><strong>${value}</strong><small>Technical data to be added</small></div>`
  ).join("");

  const stage = document.getElementById("galleryStage");
  const thumbs = document.getElementById("thumbs");
  stage.style.backgroundImage = `url('${car.gallery[0]}')`;
  thumbs.innerHTML = car.gallery.map((image, i) =>
    `<button class="thumb${i === 0 ? " active" : ""}" data-image="${image}" aria-label="Show archive image ${i + 1}" style="background-image:url('${image}')"></button>`
  ).join("");
  thumbs.querySelectorAll(".thumb").forEach(button => button.addEventListener("click", () => {
    stage.style.backgroundImage = `url('${button.dataset.image}')`;
    thumbs.querySelectorAll(".thumb").forEach(item => item.classList.toggle("active", item === button));
  }));
}

renderCarDetail().catch(error => console.error("Car details could not be loaded.", error));
