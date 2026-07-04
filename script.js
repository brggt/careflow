const allWeekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

let customShifts = ["Morning", "Afternoon", "Night"];

const scheduleSection = document.querySelector("#schedule");
const customShiftInput = document.querySelector("#custom-shift-name");
const addShiftButton = document.querySelector("#add-shift-button");
const shiftList = document.querySelector("#shift-list");
const weekStartSelect = document.querySelector("#week-start");
const weekLabel = document.querySelector("#week-label");
const shiftStyleSelect = document.querySelector("#shift-style");

function getOrderedWeekDays(startDay) {
  const startIndex = allWeekDays.indexOf(startDay);
  const firstPart = allWeekDays.slice(startIndex);
  const secondPart = allWeekDays.slice(0, startIndex);

  return firstPart.concat(secondPart);
}

function getActiveShifts() {
  const selectedShiftStyle = shiftStyleSelect.value;

  if (selectedShiftStyle === "three") {
    return ["Morning", "Afternoon", "Night"];
  }

  if (selectedShiftStyle === "two") {
    return ["Day", "Night"];
  }

  return customShifts;
}

function renderShiftList() {
  shiftList.innerHTML = "";

  customShifts.forEach(function (shiftName, index) {
    const shiftItem = document.createElement("li");
    shiftItem.classList.add("shift-list-item");

    shiftItem.innerHTML = `
      <span>${shiftName}</span>
      <button class="remove-shift-button" type="button">Remove</button>
    `;

    const removeButton = shiftItem.querySelector(".remove-shift-button");

    removeButton.addEventListener("click", function () {
      customShifts.splice(index, 1);
      renderShiftList();
      renderSchedule();
    });

    shiftList.append(shiftItem);
  });
}

function renderSchedule() {
  scheduleSection.innerHTML = "";

  const selectedStartDay = weekStartSelect.value;
  const orderedWeekDays = getOrderedWeekDays(selectedStartDay);
  const lastDay = orderedWeekDays[orderedWeekDays.length - 1];
  const activeShifts = getActiveShifts();

  weekLabel.textContent = `${selectedStartDay} - ${lastDay}`;

  orderedWeekDays.forEach(function (dayName) {
    const dayCard = document.createElement("div");
    dayCard.classList.add("day-card");

    let shiftRows = "";

    activeShifts.forEach(function (shiftName) {
      shiftRows += `
        <div class="shift-row">
          <span class="shift-name">${shiftName}</span>
          <span class="caregiver open-shift">Open</span>
        </div>
      `;
    });

    dayCard.innerHTML = `
      <h3>${dayName}</h3>
      ${shiftRows}
    `;

    scheduleSection.append(dayCard);
  });
}

addShiftButton.addEventListener("click", function () {
  const newShiftName = customShiftInput.value.trim();

  if (newShiftName === "") {
    return;
  }

  const isDuplicate = customShifts.some(function (shiftName) {
    return shiftName.toLowerCase() === newShiftName.toLowerCase();
  });

  if (isDuplicate) {
    customShiftInput.value = "";
    return;
  }

  customShifts.push(newShiftName);
  customShiftInput.value = "";

  renderShiftList();
  renderSchedule();
});

weekStartSelect.addEventListener("change", function () {
  renderSchedule();
});

shiftStyleSelect.addEventListener("change", function () {
  renderSchedule();
});

renderShiftList();
renderSchedule();
