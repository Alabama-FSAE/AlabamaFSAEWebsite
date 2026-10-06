async function initializeCarArchive() {
  const response = await fetch("data/cars.json");
  const cars = await response.json();
  const carList = document.getElementById("carList");
  const carSteps = document.getElementById("carSteps");
  carList.innerHTML = cars.map((car, index) => `
    <div class="car-row${index === 0 ? " active" : ""}" data-index="${index}">
      <button class="row-select" type="button" aria-label="Show ${car.name}">
        <span class="car-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="car-name">${car.name}<span class="car-year">${car.year}</span></span>
      </button>
      <a class="row-arrow" href="car.html?car=${car.id}" aria-label="View ${car.name} details">
        <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
      </a>
    </div>`).join("");
  carSteps.innerHTML = cars.map((car, index) => `<div class="car-step" data-index="${index}"></div>`).join("");
  const rows = [...document.querySelectorAll(".car-row")];
  const steps = [...document.querySelectorAll(".car-step")];
  const image = document.getElementById("stageImage");
  const title = document.getElementById("stageTitle");
  const year = document.getElementById("stageYear");
  const kicker = document.getElementById("stageKicker");
  const position = document.getElementById("stagePosition");
  const count = document.getElementById("railCount");
  let active = -1;
  let timer;

  cars.forEach(car => {
    const preload = new Image();
    preload.src = car.image;
  });

  function showCar(index, animate = true) {
    if (index === active) return;
    active = index;
    const car = cars[index];
    const number = String(index + 1).padStart(2, "0");
    rows.forEach((row, i) => {
      row.classList.toggle("active", i === index);
      row.querySelector(".row-select").setAttribute("aria-pressed", i === index);
    });
    if (animate) {
      image.classList.add("switching");
      clearTimeout(timer);
      timer = setTimeout(() => {
        image.src = car.image;
        image.alt = car.name;
        image.classList.remove("switching");
      }, 150);
    } else {
      image.src = car.image;
      image.alt = car.name;
    }
    title.innerHTML = `CR<span>${car.name.replace("CR", "")}</span>`;
    year.textContent = car.name.replace("CR", "");
    kicker.textContent = `${number} // ${car.status}`;
    position.textContent = `${number} / ${cars.length}`;
    count.textContent = `${number} / ${cars.length}`;
    rows[index].scrollIntoView({block: "nearest", inline: "nearest"});
  }

  rows.forEach((row, index) => row.querySelector(".row-select").addEventListener("click", () => {
    const garage = document.getElementById("garage");
    window.scrollTo({top: garage.offsetTop + steps[index].offsetTop + 2, behavior: "smooth"});
    showCar(index);
  }));

  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) showCar(Number(visible.target.dataset.index));
  }, {rootMargin: "-42% 0px -42% 0px", threshold: [0, .1, .25, .5, 1]});
  steps.forEach(step => observer.observe(step));
  showCar(0, false);
}

initializeCarArchive().catch(error => console.error("Car archive could not be loaded.", error));
