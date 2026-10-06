const tabs = [document.getElementById("teamTab"), document.getElementById("fsaeTab")];
const panels = [document.getElementById("teamPanel"), document.getElementById("fsaePanel")];
tabs.forEach((tab, index) => tab.addEventListener("click", () => {
  tabs.forEach((item, itemIndex) => {
    const active = itemIndex === index;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", active);
    panels[itemIndex].hidden = !active;
  });
}));
