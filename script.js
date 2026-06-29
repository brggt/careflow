const weekStart = "Monday";

const schedule = [
  {
    day: "Monday",
    morning: "Open",
    afternoon: "Open",
    night: "Open",
  },
  {
    day: "Tuesday",
    morning: "Open",
    afternoon: "Open",
    night: "Open",
  },
  {
    day: "Wednesday",
    morning: "Open",
    afternoon: "Open",
    night: "Open",
  },
  {
    day: "Thursday",
    morning: "Open",
    afternoon: "Open",
    night: "Open",
  },
  {
    day: "Friday",
    morning: "Open",
    afternoon: "Open",
    night: "Open",
  },
  {
    day: "Saturday",
    morning: "Open",
    afternoon: "Open",
    night: "Open",
  },
  {
    day: "Sunday",
    morning: "Open",
    afternoon: "Open",
    night: "Open",
  },
];

const scheduleSection = document.querySelector("#schedule");

schedule.forEach(function (day) {
  const dayCard = document.createElement("div");

  dayCard.classList.add("day-card");

  dayCard.innerHTML = `
  <h3>${day.day}</h3>

  <div class="shift-row">
    <span class="shift-name">Morning</span>
    <span class="caregiver ${day.morning === "Open" ? "open-shift" : ""}">
      ${day.morning}
    </span>
  </div>

  <div class="shift-row">
    <span class="shift-name">Afternoon</span>
    <span class="caregiver ${day.afternoon === "Open" ? "open-shift" : ""}">
      ${day.afternoon}
    </span>
  </div>

  <div class="shift-row">
    <span class="shift-name">Night</span>
    <span class="caregiver ${day.night === "Open" ? "open-shift" : ""}">
      ${day.night}
    </span>
  </div>
  `;

  scheduleSection.append(dayCard);
});
