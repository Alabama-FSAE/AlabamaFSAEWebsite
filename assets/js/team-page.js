async function renderTeam() {
  const response = await fetch("data/team.json");
  const team = await response.json();
  const roster = document.getElementById("teamRoster");
  let memberNumber = 0;
  roster.innerHTML = team.groups.map((group, groupIndex) => {
    const members = group.members.map(member => {
      memberNumber += 1;
      const initials = member.name.split(" ").map(word => word[0]).join("");
      const photo = member.photo
        ? `<img src="${encodeURI(member.photo)}" alt="${member.name}" width="800" height="1000" loading="lazy">`
        : `<b>${initials}</b>`;
      return `<article class="member"><div class="member-photo${member.photo ? " has-photo" : ""}" data-number="${String(memberNumber).padStart(2, "0")}">${photo}</div><div class="member-copy"><strong>${member.name}</strong><small>${member.role}</small></div></article>`;
    }).join("");
    return `<section class="roster-tier"><div class="tier-head"><span>${String(groupIndex + 1).padStart(2, "0")}</span><h3>${group.title}</h3></div><div class="member-list${group.title === "Management" ? " managers" : group.members.length === 2 ? " two" : ""}">${members}</div></section>`;
  }).join("");

  const faculty = team.facultySponsor;
  if (faculty.photo) {
    const facultyPhoto = document.querySelector(".faculty-photo");
    facultyPhoto.classList.add("has-photo");
    facultyPhoto.removeAttribute("role");
    facultyPhoto.removeAttribute("aria-label");
    facultyPhoto.innerHTML = `<img src="${encodeURI(faculty.photo)}" alt="${faculty.name}" width="800" height="1000" loading="lazy">`;
  }
  document.getElementById("facultyName").innerHTML = faculty.name.replace(" ", "<br>");
  document.getElementById("facultyTitle").textContent = faculty.title;
  document.getElementById("facultyEducation").innerHTML = faculty.education.replaceAll("\n", "<br>");
  document.getElementById("facultyResearch").innerHTML = faculty.research.replaceAll("\n", "<br>");
}

renderTeam().catch(error => console.error("Team information could not be loaded.", error));
