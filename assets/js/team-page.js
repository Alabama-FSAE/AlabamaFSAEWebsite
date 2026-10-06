async function renderTeam() {
  const response = await fetch("data/team.json");
  const team = await response.json();
  const roster = document.getElementById("teamRoster");
  let memberNumber = 0;
  roster.innerHTML = team.groups.map((group, groupIndex) => {
    const members = group.members.map(member => {
      memberNumber += 1;
      return `<article class="member"><div class="member-photo" data-number="${String(memberNumber).padStart(2, "0")}"><span><b>Headshot needed</b><span>${member.name}</span></span></div><div class="member-copy"><strong>${member.name}</strong><small>${member.role}</small></div></article>`;
    }).join("");
    return `<section class="roster-tier"><div class="tier-head"><span>${String(groupIndex + 1).padStart(2, "0")}</span><h3>${group.title}</h3></div><div class="member-list${group.members.length === 2 ? " two" : ""}">${members}</div></section>`;
  }).join("");

  const faculty = team.facultySponsor;
  document.getElementById("facultyName").innerHTML = faculty.name.replace(" ", "<br>");
  document.getElementById("facultyTitle").textContent = faculty.title;
  document.getElementById("facultyEducation").innerHTML = faculty.education.replaceAll("\n", "<br>");
  document.getElementById("facultyResearch").innerHTML = faculty.research.replaceAll("\n", "<br>");
}

renderTeam().catch(error => console.error("Team information could not be loaded.", error));
