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
let scheduleNote = "";

let shiftTimes = {
  "Full Day": { start: "00:00", end: "00:00" },
  Day: { start: "07:00", end: "19:00" },
  Night: { start: "19:00", end: "07:00" },
  Morning: { start: "06:30", end: "13:00" },
  Afternoon: { start: "13:00", end: "19:00" },
};

const scheduleSection = document.querySelector("#schedule");

const customShiftInput = document.querySelector("#custom-shift-name");
const addShiftButton = document.querySelector("#add-shift-button");
const shiftList = document.querySelector("#shift-list");
const customShiftSection = document.querySelector("#custom-shift-section");

const caregiverInput = document.querySelector("#caregiver-name");
const addCaregiverButton = document.querySelector("#add-caregiver-button");
const caregiverList = document.querySelector("#caregiver-list");

const weekStartSelect = document.querySelector("#week-start");
const weekLabel = document.querySelector("#week-label");
const shiftStyleSelect = document.querySelector("#shift-style");

const scheduleViewSelect = document.querySelector("#schedule-view");
const monthPicker = document.querySelector("#month-picker");
const monthPickerSection = document.querySelector("#month-picker-section");

const weekStartDateInput = document.querySelector("#week-start-date");
const weekPickerSection = document.querySelector("#week-picker-section");

const scheduleNoteInput = document.querySelector("#schedule-note");
const clearScheduleButton = document.querySelector("#clear-schedule-button");

const scheduleTitle = document.querySelector("#schedule-title");

const shiftTimeList = document.querySelector("#shift-time-list");

const totalHoursNeededElement = document.querySelector("#total-hours-needed");
const totalHoursCoveredElement = document.querySelector("#total-hours-covered");
const openHoursElement = document.querySelector("#open-hours");
const openShiftsCountElement = document.querySelector("#open-shifts-count");
const caregiverHoursList = document.querySelector("#caregiver-hours-list");
const availableShiftsList = document.querySelector("#available-shifts-list");

function saveData() {
  localStorage.setItem("kindshiftCustomShifts", JSON.stringify(customShifts));
  localStorage.setItem("kindshiftCaregivers", JSON.stringify(caregivers));
  localStorage.setItem(
    "kindshiftAssignments",
    JSON.stringify(scheduleAssignments),
  );
  localStorage.setItem("kindshiftScheduleNote", scheduleNote);
  localStorage.setItem("kindshiftShiftTimes", JSON.stringify(shiftTimes));

  localStorage.setItem("kindshiftScheduleView", scheduleViewSelect.value);
  localStorage.setItem("kindshiftShiftStyle", shiftStyleSelect.value);
  localStorage.setItem("kindshiftWeekStart", weekStartSelect.value);
  localStorage.setItem("kindshiftMonth", monthPicker.value);
  localStorage.setItem("kindshiftWeekStartDate", weekStartDateInput.value);
}

function loadData() {
  const savedCustomShifts = localStorage.getItem("kindshiftCustomShifts");
  const savedCaregivers = localStorage.getItem("kindshiftCaregivers");
  const savedAssignments = localStorage.getItem("kindshiftAssignments");
  const savedScheduleNote = localStorage.getItem("kindshiftScheduleNote");
  const savedShiftTimes = localStorage.getItem("kindshiftShiftTimes");

  if (savedCustomShifts) {
    customShifts = JSON.parse(savedCustomShifts);
  }

  if (savedCaregivers) {
    caregivers = JSON.parse(savedCaregivers);
  }

  if (savedAssignments) {
    scheduleAssignments = JSON.parse(savedAssignments);
  }

  if (savedScheduleNote) {
    scheduleNote = savedScheduleNote;
  }

  if (savedShiftTimes) {
    shiftTimes = {
      ...shiftTimes,
      ...JSON.parse(savedShiftTimes),
    };
  }

  const savedScheduleView = localStorage.getItem("kindshiftScheduleView");
  const savedShiftStyle = localStorage.getItem("kindshiftShiftStyle");
  const savedWeekStart = localStorage.getItem("kindshiftWeekStart");
  const savedMonth = localStorage.getItem("kindshiftMonth");
  const savedWeekStartDate = localStorage.getItem("kindshiftWeekStartDate");

  if (savedScheduleView) {
    scheduleViewSelect.value = savedScheduleView;
  }

  if (savedShiftStyle) {
    shiftStyleSelect.value = savedShiftStyle;
  }

  if (savedWeekStart) {
    weekStartSelect.value = savedWeekStart;
  }

  if (savedMonth) {
    monthPicker.value = savedMonth;
  }

  if (savedWeekStartDate) {
    weekStartDateInput.value = savedWeekStartDate;
  }
}

function getTodayDateValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayMonthValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDaysInSelectedWeek() {
  const selectedDate = weekStartDateInput.value || getTodayDateValue();
  const [year, month, day] = selectedDate.split("-").map(Number);

  const chosenDate = new Date(year, month - 1, day);

  const selectedStartDay = weekStartSelect.value;
  const selectedStartDayIndex = allWeekDays.indexOf(selectedStartDay);

  const jsDayIndex = chosenDate.getDay();
  const jsToAppDayIndex = jsDayIndex === 0 ? 6 : jsDayIndex - 1;

  let daysToSubtract = jsToAppDayIndex - selectedStartDayIndex;

  if (daysToSubtract < 0) {
    daysToSubtract += 7;
  }

  const startDate = new Date(chosenDate);
  startDate.setDate(chosenDate.getDate() - daysToSubtract);

  const days = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    days.push({
      label: currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      key: getDateKey(currentDate),
    });
  }

  return days;
}

function getDaysInSelectedMonth() {
  const selectedMonth = monthPicker.value || getTodayMonthValue();
  const [year, month] = selectedMonth.split("-").map(Number);

  const days = [];
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  for (let dayNumber = 1; dayNumber <= lastDayOfMonth; dayNumber++) {
    const date = new Date(year, month - 1, dayNumber);

    days.push({
      label: date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      key: getDateKey(date),
    });
  }

  return days;
}

function updatePickerVisibility() {
  if (scheduleViewSelect.value === "monthly") {
    monthPickerSection.classList.remove("hidden");
    weekPickerSection.classList.add("hidden");
  } else {
    monthPickerSection.classList.add("hidden");
    weekPickerSection.classList.remove("hidden");
  }
}

function updateCustomShiftVisibility() {
  if (shiftStyleSelect.value === "custom") {
    customShiftSection.classList.remove("hidden");
  } else {
    customShiftSection.classList.add("hidden");
  }
}

function getShiftConfig(shiftName, defaultStart, defaultEnd) {
  if (!shiftTimes[shiftName]) {
    shiftTimes[shiftName] = {
      start: defaultStart,
      end: defaultEnd,
    };
  }

  return {
    name: shiftName,
    start: shiftTimes[shiftName].start,
    end: shiftTimes[shiftName].end,
  };
}

function getActiveShifts() {
  const selectedShiftStyle = shiftStyleSelect.value;

  if (selectedShiftStyle === "one") {
    return [getShiftConfig("Full Day", "00:00", "00:00")];
  }

  if (selectedShiftStyle === "two") {
    return [
      getShiftConfig("Day", "07:00", "19:00"),
      getShiftConfig("Night", "19:00", "07:00"),
    ];
  }

  if (selectedShiftStyle === "three") {
    return [
      getShiftConfig("Morning", "06:30", "13:00"),
      getShiftConfig("Afternoon", "13:00", "19:00"),
      getShiftConfig("Night", "19:00", "06:30"),
    ];
  }

  return customShifts.map(function (shiftName) {
    return getShiftConfig(shiftName, "09:00", "17:00");
  });
}

function formatTime(timeValue) {
  const [hourText, minuteText] = timeValue.split(":");
  const hour = Number(hourText);
  const minute = minuteText;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${displayHour}:${minute} ${period}`;
}

function getShiftHours(shift) {
  const [startHour, startMinute] = shift.start.split(":").map(Number);
  const [endHour, endMinute] = shift.end.split(":").map(Number);

  const startMinutes = startHour * 60 + startMinute;
  let endMinutes = endHour * 60 + endMinute;

  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  const totalMinutes = endMinutes - startMinutes;

  return totalMinutes / 60;
}

function formatHours(hours) {
  if (Number.isInteger(hours)) {
    return `${hours} hrs`;
  }

  return `${hours.toFixed(1)} hrs`;
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
      renderShiftTimeList();
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
      renderShiftTimeList();
      renderSchedule();
    });

    removeButton.addEventListener("click", function () {
      const removedShiftName = customShifts[index];

      customShifts.splice(index, 1);
      delete shiftTimes[removedShiftName];

      Object.keys(scheduleAssignments).forEach(function (assignmentKey) {
        if (assignmentKey.endsWith(`-${removedShiftName}`)) {
          delete scheduleAssignments[assignmentKey];
        }
      });

      saveData();
      renderShiftList();
      renderShiftTimeList();
      renderSchedule();
    });

    shiftList.append(shiftItem);
  });
}

function renderShiftTimeList() {
  shiftTimeList.innerHTML = "";

  const activeShifts = getActiveShifts();

  activeShifts.forEach(function (shift) {
    const shiftTimeRow = document.createElement("div");
    shiftTimeRow.classList.add("shift-time-row");

    shiftTimeRow.innerHTML = `
      <strong>${shift.name}</strong>

      <input
        class="shift-start-time"
        type="time"
        value="${shift.start}"
        data-shift="${shift.name}"
        data-time-type="start"
      />

      <input
        class="shift-end-time"
        type="time"
        value="${shift.end}"
        data-shift="${shift.name}"
        data-time-type="end"
      />
    `;

    shiftTimeList.append(shiftTimeRow);
  });

  const timeInputs = document.querySelectorAll(".shift-time-row input");

  timeInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      const shiftName = input.dataset.shift;
      const timeType = input.dataset.timeType;

      if (!shiftTimes[shiftName]) {
        shiftTimes[shiftName] = {
          start: "09:00",
          end: "17:00",
        };
      }

      shiftTimes[shiftName][timeType] = input.value;

      saveData();
      renderSchedule();
    });
  });
}

function renderCaregiverList() {
  caregiverList.innerHTML = "";

  caregivers.forEach(function (caregiverName, index) {
    const caregiverItem = document.createElement("li");
    caregiverItem.classList.add("caregiver-list-item");

    caregiverItem.innerHTML = `
      <span>${caregiverName}</span>
      <button class="remove-caregiver-button" type="button">Remove</button>
    `;

    const removeButton = caregiverItem.querySelector(
      ".remove-caregiver-button",
    );

    removeButton.addEventListener("click", function () {
      caregivers.splice(index, 1);

      Object.keys(scheduleAssignments).forEach(function (assignmentKey) {
        if (scheduleAssignments[assignmentKey] === caregiverName) {
          scheduleAssignments[assignmentKey] = "Open";
        }
      });

      saveData();
      renderCaregiverList();
      renderSchedule();
    });

    caregiverList.append(caregiverItem);
  });
}

function getScheduleDaysForCurrentView() {
  if (scheduleViewSelect.value === "monthly") {
    return getDaysInSelectedMonth();
  }

  return getDaysInSelectedWeek();
}

function renderCoverageSummary(scheduleDays, activeShifts) {
  let totalHoursNeeded = 0;
  let totalHoursCovered = 0;
  let openHours = 0;
  let openShiftsCount = 0;

  const caregiverHours = {};

  caregivers.forEach(function (caregiverName) {
    caregiverHours[caregiverName] = 0;
  });

  availableShiftsList.innerHTML = "";

  scheduleDays.forEach(function (day) {
    activeShifts.forEach(function (shift) {
      const shiftHours = getShiftHours(shift);
      const assignmentKey = `${day.key}-${shift.name}`;
      const assignedCaregiver = scheduleAssignments[assignmentKey] || "Open";

      totalHoursNeeded += shiftHours;

      if (assignedCaregiver === "Open") {
        openHours += shiftHours;
        openShiftsCount += 1;

        const availableShiftItem = document.createElement("li");
        availableShiftItem.textContent = `${day.label} — ${shift.name} (${formatTime(shift.start)} - ${formatTime(shift.end)}, ${formatHours(shiftHours)})`;
        availableShiftsList.append(availableShiftItem);
      } else {
        totalHoursCovered += shiftHours;

        if (!caregiverHours[assignedCaregiver]) {
          caregiverHours[assignedCaregiver] = 0;
        }

        caregiverHours[assignedCaregiver] += shiftHours;
      }
    });
  });

  totalHoursNeededElement.textContent = formatHours(totalHoursNeeded);
  totalHoursCoveredElement.textContent = formatHours(totalHoursCovered);
  openHoursElement.textContent = formatHours(openHours);
  openShiftsCountElement.textContent = openShiftsCount;

  caregiverHoursList.innerHTML = "";

  if (caregivers.length === 0) {
    const emptyCaregiverItem = document.createElement("li");
    emptyCaregiverItem.textContent = "No caregivers added yet.";
    caregiverHoursList.append(emptyCaregiverItem);
  } else {
    caregivers.forEach(function (caregiverName) {
      const caregiverHoursItem = document.createElement("li");
      caregiverHoursItem.textContent = `${caregiverName}: ${formatHours(caregiverHours[caregiverName] || 0)}`;
      caregiverHoursList.append(caregiverHoursItem);
    });
  }

  if (openShiftsCount === 0) {
    const noOpenShiftsItem = document.createElement("li");
    noOpenShiftsItem.textContent = "No available shifts.";
    availableShiftsList.append(noOpenShiftsItem);
  }
}

function renderSchedule() {
  scheduleSection.innerHTML = "";

  const activeShifts = getActiveShifts();
  const selectedView = scheduleViewSelect.value;

  let scheduleDays = [];

  if (selectedView === "monthly") {
    if (scheduleTitle) {
      scheduleTitle.textContent = "Monthly Schedule";
    }

    scheduleDays = getDaysInSelectedMonth();

    const selectedMonth = monthPicker.value || getTodayMonthValue();
    const [year, month] = selectedMonth.split("-").map(Number);

    weekLabel.textContent = new Date(year, month - 1).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      },
    );
  } else {
    if (scheduleTitle) {
      scheduleTitle.textContent = "Weekly Schedule";
    }

    scheduleDays = getDaysInSelectedWeek();

    const firstDay = scheduleDays[0].label;
    const lastDay = scheduleDays[scheduleDays.length - 1].label;

    weekLabel.textContent = `${firstDay} - ${lastDay}`;
  }

  const selectedDateKey = weekStartDateInput.value || getTodayDateValue();

  scheduleDays.forEach(function (day) {
    const dayCard = document.createElement("div");
    dayCard.classList.add("day-card");

    if (selectedView === "weekly" && day.key === selectedDateKey) {
      dayCard.classList.add("selected-date-card");
    }

    let shiftRows = "";

    activeShifts.forEach(function (shift) {
      const assignmentKey = `${day.key}-${shift.name}`;
      const assignedCaregiver = scheduleAssignments[assignmentKey] || "Open";
      const shiftHours = getShiftHours(shift);

      let caregiverOptions = `<option value="Open">Open</option>`;

      caregivers.forEach(function (caregiverName) {
        const selected = caregiverName === assignedCaregiver ? "selected" : "";

        caregiverOptions += `
          <option value="${caregiverName}" ${selected}>${caregiverName}</option>
        `;
      });

      shiftRows += `
        <div class="shift-row">
          <div>
            <span class="shift-name">${shift.name}</span>
            <span class="shift-time">
              ${formatTime(shift.start)} - ${formatTime(shift.end)}
              · ${formatHours(shiftHours)}
            </span>
          </div>

          <select
            class="assignment-select"
            data-day="${day.key}"
            data-shift="${shift.name}"
          >
            ${caregiverOptions}
          </select>
        </div>
      `;
    });

    const selectedBadge =
      selectedView === "weekly" && day.key === selectedDateKey
        ? `<span class="selected-badge">Selected date</span>`
        : "";

    dayCard.innerHTML = `
      <div class="day-card-header">
        <h3>${day.label}</h3>
        ${selectedBadge}
      </div>

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
      renderCoverageSummary(scheduleDays, activeShifts);
    });
  });

  renderCoverageSummary(scheduleDays, activeShifts);
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

  shiftTimes[newShiftName] = {
    start: "09:00",
    end: "17:00",
  };

  customShiftInput.value = "";

  saveData();
  renderShiftList();
  renderShiftTimeList();
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
  saveData();
  renderSchedule();
});

shiftStyleSelect.addEventListener("change", function () {
  updateCustomShiftVisibility();
  renderShiftTimeList();
  saveData();
  renderSchedule();
});

scheduleViewSelect.addEventListener("change", function () {
  updatePickerVisibility();
  saveData();
  renderSchedule();
});

monthPicker.addEventListener("change", function () {
  saveData();
  renderSchedule();
});

weekStartDateInput.addEventListener("change", function () {
  saveData();
  renderSchedule();
});

scheduleNoteInput.addEventListener("input", function () {
  scheduleNote = scheduleNoteInput.value;
  saveData();
});

clearScheduleButton.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear the schedule?")) {
    scheduleAssignments = {};
    saveData();
    renderSchedule();
  }
});

loadData();

if (monthPicker.value === "") {
  monthPicker.value = getTodayMonthValue();
}

if (weekStartDateInput.value === "") {
  weekStartDateInput.value = getTodayDateValue();
}

scheduleNoteInput.value = scheduleNote;

updateCustomShiftVisibility();
updatePickerVisibility();
renderShiftList();
renderCaregiverList();
renderShiftTimeList();
renderSchedule();
