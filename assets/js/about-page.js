const tabs = [document.getElementById("teamTab"), document.getElementById("fsaeTab")];
const panels = [document.getElementById("teamPanel"), document.getElementById("fsaePanel")];
const track = document.querySelector(".card-track");

tabs.forEach((tab, index) => tab.addEventListener("click", () => {
  tabs.forEach((item, itemIndex) => {
    const active = itemIndex === index;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", String(active));
    panels[itemIndex].setAttribute("aria-hidden", String(!active));
    panels[itemIndex].inert = !active;
  });
  track.classList.toggle("show-fsae", index === 1);
}));
