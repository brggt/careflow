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
let caregivers = [];
let scheduleAssignments = {};

function saveData() {
  localStorage.setItem("kindshiftCustomShifts", JSON.stringify(customShifts));
  localStorage.setItem("kindshiftCaregivers", JSON.stringify(caregivers));
  localStorage.setItem(
    "kindshiftAssignments",
    JSON.stringify(scheduleAssignments),
  );
}

function loadData() {
  const savedCustomShifts = localStorage.getItem("kindshiftCustomShifts");
  const savedCaregivers = localStorage.getItem("kindshiftCaregivers");
  const savedAssignments = localStorage.getItem("kindshiftAssignments");

  if (savedCustomShifts) {
    customShifts = JSON.parse(savedCustomShifts);
  }

  if (savedCaregivers) {
    caregivers = JSON.parse(savedCaregivers);
  }

  if (savedAssignments) {
    scheduleAssignments = JSON.parse(savedAssignments);
  }
}

const scheduleSection = document.querySelector("#schedule");

const customShiftInput = document.querySelector("#custom-shift-name");
const addShiftButton = document.querySelector("#add-shift-button");
const shiftList = document.querySelector("#shift-list");

const caregiverInput = document.querySelector("#caregiver-name");
const addCaregiverButton = document.querySelector("#add-caregiver-button");
const caregiverList = document.querySelector("#caregiver-list");

const weekStartSelect = document.querySelector("#week-start");
const weekLabel = document.querySelector("#week-label");
const shiftStyleSelect = document.querySelector("#shift-style");
const customShiftSection = document.querySelector("#custom-shift-section");

function getOrderedWeekDays(startDay) {
  const startIndex = allWeekDays.indexOf(startDay);
  const firstPart = allWeekDays.slice(startIndex);
  const secondPart = allWeekDays.slice(0, startIndex);

  return firstPart.concat(secondPart);
}

function getActiveShifts() {
  const selectedShiftStyle = shiftStyleSelect.value;

  if (selectedShiftStyle === "one") {
    return ["Full Day"];
  }

  if (selectedShiftStyle === "two") {
    return ["Day", "Night"];
  }

  if (selectedShiftStyle === "three") {
    return ["Morning", "Afternoon", "Night"];
  }

  return customShifts;
}

function updateCustomShiftVisibility() {
  if (shiftStyleSelect.value === "custom") {
    customShiftSection.classList.remove("hidden");
  } else {
    customShiftSection.classList.add("hidden");
  }
}

function renderShiftList() {
  shiftList.innerHTML = "";

  customShifts.forEach(function (shiftName, index) {
    const shiftItem = document.createElement("li");
    shiftItem.classList.add("shift-list-item");

    shiftItem.innerHTML = `
      <span>${shiftName}</span>

      <div class="shift-list-buttons">
        <button class="move-shift-button move-up-button" type="button">↑</button>
        <button class="move-shift-button move-down-button" type="button">↓</button>
        <button class="remove-shift-button" type="button">Remove</button>
      </div>
    `;

    const moveUpButton = shiftItem.querySelector(".move-up-button");
    const moveDownButton = shiftItem.querySelector(".move-down-button");
    const removeButton = shiftItem.querySelector(".remove-shift-button");

    moveUpButton.addEventListener("click", function () {
      if (index === 0) {
        return;
      }

      const currentShift = customShifts[index];
      customShifts[index] = customShifts[index - 1];
      customShifts[index - 1] = currentShift;

      saveData();

      renderShiftList();
      renderSchedule();
    });

    moveDownButton.addEventListener("click", function () {
      if (index === customShifts.length - 1) {
        return;
      }

      const currentShift = customShifts[index];
      customShifts[index] = customShifts[index + 1];
      customShifts[index + 1] = currentShift;

      saveData();

      renderShiftList();
      renderSchedule();
    });

    removeButton.addEventListener("click", function () {
      customShifts.splice(index, 1);

      saveData();

      renderShiftList();
      renderSchedule();
    });

    shiftList.append(shiftItem);
  });
}

function renderCaregiverList() {
  caregiverList.innerHTML = "";

  caregivers.forEach(function (caregiverName) {
    const caregiverItem = document.createElement("li");
    caregiverItem.textContent = caregiverName;
    caregiverList.append(caregiverItem);
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
      const assignmentKey = `${dayName}-${shiftName}`;
      const assignedCaregiver = scheduleAssignments[assignmentKey] || "Open";

      let caregiverOptions = `<option value="Open">Open</option>`;

      caregivers.forEach(function (caregiverName) {
        const selected = caregiverName === assignedCaregiver ? "selected" : "";

        caregiverOptions += `
          <option value="${caregiverName}" ${selected}>${caregiverName}</option>
        `;
      });

      shiftRows += `
        <div class="shift-row">
          <span class="shift-name">${shiftName}</span>

          <select 
            class="assignment-select" 
            data-day="${dayName}" 
            data-shift="${shiftName}"
          >
            ${caregiverOptions}
          </select>
        </div>
      `;
    });

    dayCard.innerHTML = `
      <h3>${dayName}</h3>
      ${shiftRows}
    `;

    scheduleSection.append(dayCard);
  });

  const assignmentSelects = document.querySelectorAll(".assignment-select");

  assignmentSelects.forEach(function (select) {
    select.addEventListener("change", function () {
      const dayName = select.dataset.day;
      const shiftName = select.dataset.shift;
      const assignmentKey = `${dayName}-${shiftName}`;

      scheduleAssignments[assignmentKey] = select.value;

      saveData();
    });
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

  saveData();

  renderShiftList();
  renderSchedule();
});

addCaregiverButton.addEventListener("click", function () {
  const newCaregiverName = caregiverInput.value.trim();

  if (newCaregiverName === "") {
    return;
  }

  const isDuplicate = caregivers.some(function (caregiverName) {
    return caregiverName.toLowerCase() === newCaregiverName.toLowerCase();
  });

  if (isDuplicate) {
    caregiverInput.value = "";
    return;
  }

  caregivers.push(newCaregiverName);
  caregiverInput.value = "";

  saveData();

  renderCaregiverList();
  renderSchedule();
});

weekStartSelect.addEventListener("change", function () {
  renderSchedule();
});

shiftStyleSelect.addEventListener("change", function () {
  updateCustomShiftVisibility();
  renderSchedule();
});

updateCustomShiftVisibility();
renderShiftList();
renderCaregiverList();
renderSchedule();
