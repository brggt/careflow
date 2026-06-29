const schedule = [
  {
    day: "Monday",
    shifts: [
      { name: "Morning", caregiver: "Open" },
      { name: "Afternoon", caregiver: "Open" },
      { name: "Night", caregiver: "Open" },
    ],
  },
  {
    day: "Tuesday",
    shifts: [
      { name: "Morning", caregiver: "Open" },
      { name: "Afternoon", caregiver: "Open" },
      { name: "Night", caregiver: "Open" },
    ],
  },
  {
    day: "Wednesday",
    shifts: [
      { name: "Morning", caregiver: "Open" },
      { name: "Afternoon", caregiver: "Open" },
      { name: "Night", caregiver: "Open" },
    ],
  },
  {
    day: "Thursday",
    shifts: [
      { name: "Morning", caregiver: "Open" },
      { name: "Afternoon", caregiver: "Open" },
      { name: "Night", caregiver: "Open" },
    ],
  },
  {
    day: "Friday",
    shifts: [
      { name: "Morning", caregiver: "Open" },
      { name: "Afternoon", caregiver: "Open" },
      { name: "Night", caregiver: "Open" },
    ],
  },
  {
    day: "Saturday",
    shifts: [
      { name: "Morning", caregiver: "Open" },
      { name: "Afternoon", caregiver: "Open" },
      { name: "Night", caregiver: "Open" },
    ],
  },
  {
    day: "Sunday",
    shifts: [
      { name: "Morning", caregiver: "Open" },
      { name: "Afternoon", caregiver: "Open" },
      { name: "Night", caregiver: "Open" },
    ],
  },
];

const scheduleSection = document.querySelector("#schedule");

schedule.forEach(function (day) {
  const dayCard = document.createElement("div");
  dayCard.classList.add("day-card");

  let shiftRows = "";

  day.shifts.forEach(function (shift) {
    shiftRows += `
      <div class="shift-row">
        <span class="shift-name">${shift.name}</span>
        <span class="caregiver ${shift.caregiver === "Open" ? "open-shift" : ""}">
          ${shift.caregiver}
        </span>
      </div>
    `;
  });

  dayCard.innerHTML = `
    <h3>${day.day}</h3>
    ${shiftRows}
  `;

  scheduleSection.append(dayCard);
});
