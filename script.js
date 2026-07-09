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
let shiftTimeOverrides = {};

let activeTimeEdit = {
  mode: "date",
  dayKey: "",
  shift: null,
};

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

const coveragePercentElement = document.querySelector("#coverage-percent");
const coverageProgressFill = document.querySelector("#coverage-progress-fill");

const toastOpenShiftsCount = document.querySelector("#toast-open-shifts-count");
const availableShiftsBody = document.querySelector(".available-shifts-body");
const availableShiftsToast = document.querySelector(".available-shifts-toast");
const minimizeAvailableShiftsButton = document.querySelector(
  "#minimize-available-shifts-button",
);

const editTimeModal = document.querySelector("#edit-time-modal");
const editTimeTitle = document.querySelector("#edit-time-title");
const editTimeSubtitle = document.querySelector("#edit-time-subtitle");

const editStartHourSelect = document.querySelector("#edit-start-hour");
const editStartMinuteSelect = document.querySelector("#edit-start-minute");
const editStartPeriodSelect = document.querySelector("#edit-start-period");

const editEndHourSelect = document.querySelector("#edit-end-hour");
const editEndMinuteSelect = document.querySelector("#edit-end-minute");
const editEndPeriodSelect = document.querySelector("#edit-end-period");

const closeEditTimeButton = document.querySelector("#close-edit-time-button");
const cancelEditTimeButton = document.querySelector("#cancel-edit-time-button");
const saveEditTimeButton = document.querySelector("#save-edit-time-button");

let availableShiftsScrollInterval;

function getSavedItem(newKey, oldKey) {
  return localStorage.getItem(newKey) || localStorage.getItem(oldKey);
}

function saveData() {
  localStorage.setItem("curavelaCustomShifts", JSON.stringify(customShifts));
  localStorage.setItem("curavelaCaregivers", JSON.stringify(caregivers));
  localStorage.setItem(
    "curavelaAssignments",
    JSON.stringify(scheduleAssignments),
  );
  localStorage.setItem("curavelaScheduleNote", scheduleNote);
  localStorage.setItem("curavelaShiftTimes", JSON.stringify(shiftTimes));
  localStorage.setItem(
    "curavelaShiftTimeOverrides",
    JSON.stringify(shiftTimeOverrides),
  );

  localStorage.setItem("curavelaScheduleView", scheduleViewSelect.value);
  localStorage.setItem("curavelaShiftStyle", shiftStyleSelect.value);
  localStorage.setItem("curavelaWeekStart", weekStartSelect.value);
  localStorage.setItem("curavelaMonth", monthPicker.value);
  localStorage.setItem("curavelaWeekStartDate", weekStartDateInput.value);
}

function loadData() {
  const savedCustomShifts = getSavedItem(
    "curavelaCustomShifts",
    "kindshiftCustomShifts",
  );
  const savedCaregivers = getSavedItem(
    "curavelaCaregivers",
    "kindshiftCaregivers",
  );
  const savedAssignments = getSavedItem(
    "curavelaAssignments",
    "kindshiftAssignments",
  );
  const savedScheduleNote = getSavedItem(
    "curavelaScheduleNote",
    "kindshiftScheduleNote",
  );
  const savedShiftTimes = getSavedItem(
    "curavelaShiftTimes",
    "kindshiftShiftTimes",
  );
  const savedShiftTimeOverrides = getSavedItem(
    "curavelaShiftTimeOverrides",
    "kindshiftShiftTimeOverrides",
  );

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

  if (savedShiftTimeOverrides) {
    shiftTimeOverrides = JSON.parse(savedShiftTimeOverrides);
  }

  const savedScheduleView = getSavedItem(
    "curavelaScheduleView",
    "kindshiftScheduleView",
  );
  const savedShiftStyle = getSavedItem(
    "curavelaShiftStyle",
    "kindshiftShiftStyle",
  );
  const savedWeekStart = getSavedItem(
    "curavelaWeekStart",
    "kindshiftWeekStart",
  );
  const savedMonth = getSavedItem("curavelaMonth", "kindshiftMonth");
  const savedWeekStartDate = getSavedItem(
    "curavelaWeekStartDate",
    "kindshiftWeekStartDate",
  );

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

function getAppDayIndex(date) {
  const jsDayIndex = date.getDay();

  if (jsDayIndex === 0) {
    return 6;
  }

  return jsDayIndex - 1;
}

function getOrderedWeekDays() {
  const startIndex = allWeekDays.indexOf(weekStartSelect.value);
  const firstPart = allWeekDays.slice(startIndex);
  const secondPart = allWeekDays.slice(0, startIndex);

  return firstPart.concat(secondPart);
}

function getDaysInSelectedWeek() {
  const selectedDate = weekStartDateInput.value || getTodayDateValue();
  const [year, month, day] = selectedDate.split("-").map(Number);
  const chosenDate = new Date(year, month - 1, day);

  const selectedStartDayIndex = allWeekDays.indexOf(weekStartSelect.value);
  const chosenDayIndex = getAppDayIndex(chosenDate);

  let daysToSubtract = chosenDayIndex - selectedStartDayIndex;

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
      date: currentDate,
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
      date: date,
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

function updateAvailableShiftsMinimizedState() {
  if (!availableShiftsToast || !minimizeAvailableShiftsButton) {
    return;
  }

  const isMinimized =
    localStorage.getItem("kindshiftAvailableShiftsMinimized") === "true";

  availableShiftsToast.classList.toggle("is-minimized", isMinimized);
  minimizeAvailableShiftsButton.textContent = isMinimized ? "+" : "−";
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

function getShiftOverrideKey(dayKey, shiftName) {
  return `${dayKey}__${shiftName}`;
}

function getShiftForDay(dayKey, shift) {
  const overrideKey = getShiftOverrideKey(dayKey, shift.name);
  const override = shiftTimeOverrides[overrideKey];

  if (override) {
    return {
      ...shift,
      start: override.start,
      end: override.end,
      hasOverride: true,
    };
  }

  return {
    ...shift,
    hasOverride: false,
  };
}

function isValidTimeValue(timeValue) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeValue);
}

function fillPrettyTimeSelects() {
  const hourSelects = [editStartHourSelect, editEndHourSelect];
  const minuteSelects = [editStartMinuteSelect, editEndMinuteSelect];

  hourSelects.forEach(function (select) {
    select.innerHTML = "";

    for (let hour = 1; hour <= 12; hour++) {
      const option = document.createElement("option");
      option.value = String(hour).padStart(2, "0");
      option.textContent = String(hour).padStart(2, "0");
      select.append(option);
    }
  });

  minuteSelects.forEach(function (select) {
    select.innerHTML = "";

    for (let minute = 0; minute < 60; minute++) {
      const option = document.createElement("option");
      option.value = String(minute).padStart(2, "0");
      option.textContent = String(minute).padStart(2, "0");
      select.append(option);
    }
  });
}

function convert24HourToPrettyTime(timeValue) {
  const [hourText, minute] = timeValue.split(":");
  let hour = Number(hourText);
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;

  if (hour === 0) {
    hour = 12;
  }

  return {
    hour: String(hour).padStart(2, "0"),
    minute: minute,
    period: period,
  };
}

function convertPrettyTimeTo24Hour(hourValue, minuteValue, periodValue) {
  let hour = Number(hourValue);

  if (periodValue === "AM" && hour === 12) {
    hour = 0;
  }

  if (periodValue === "PM" && hour !== 12) {
    hour += 12;
  }

  return `${String(hour).padStart(2, "0")}:${minuteValue}`;
}

function setPrettyStartTime(timeValue) {
  const prettyTime = convert24HourToPrettyTime(timeValue);

  editStartHourSelect.value = prettyTime.hour;
  editStartMinuteSelect.value = prettyTime.minute;
  editStartPeriodSelect.value = prettyTime.period;
}

function setPrettyEndTime(timeValue) {
  const prettyTime = convert24HourToPrettyTime(timeValue);

  editEndHourSelect.value = prettyTime.hour;
  editEndMinuteSelect.value = prettyTime.minute;
  editEndPeriodSelect.value = prettyTime.period;
}

function getPrettyStartTime() {
  return convertPrettyTimeTo24Hour(
    editStartHourSelect.value,
    editStartMinuteSelect.value,
    editStartPeriodSelect.value,
  );
}

function getPrettyEndTime() {
  return convertPrettyTimeTo24Hour(
    editEndHourSelect.value,
    editEndMinuteSelect.value,
    editEndPeriodSelect.value,
  );
}

function formatDateKeyForDisplay(dayKey) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function editShiftTimeForDate(dayKey, shift) {
  const shiftForDay = getShiftForDay(dayKey, shift);

  activeTimeEdit = {
    mode: "date",
    dayKey: dayKey,
    shift: shift,
  };

  editTimeTitle.textContent = `Edit ${shift.name}`;
  editTimeSubtitle.textContent = `${formatDateKeyForDisplay(
    dayKey,
  )} · this change only affects this date.`;

  setPrettyStartTime(shiftForDay.start);
  setPrettyEndTime(shiftForDay.end);
  syncAllPrettySelects();

  editTimeModal.classList.remove("hidden");
}

function editDefaultShiftTime(shift) {
  activeTimeEdit = {
    mode: "default",
    dayKey: "",
    shift: shift,
  };

  editTimeTitle.textContent = `Edit default ${shift.name}`;
  editTimeSubtitle.textContent = `This changes ${shift.name} everywhere, except dates with custom time.`;

  setPrettyStartTime(shift.start);
  setPrettyEndTime(shift.end);
  syncAllPrettySelects();

  editTimeModal.classList.remove("hidden");
}

function closeEditTimeModal() {
  editTimeModal.classList.add("hidden");

  activeTimeEdit = {
    mode: "date",
    dayKey: "",
    shift: null,
  };
}

function saveEditedShiftTime() {
  if (!activeTimeEdit.shift) {
    return;
  }

  const newStart = getPrettyStartTime();
  const newEnd = getPrettyEndTime();

  if (!isValidTimeValue(newStart) || !isValidTimeValue(newEnd)) {
    alert("Please choose a valid start and end time.");
    return;
  }

  if (activeTimeEdit.mode === "default") {
    const shiftName = activeTimeEdit.shift.name;

    if (!shiftTimes[shiftName]) {
      shiftTimes[shiftName] = {
        start: newStart,
        end: newEnd,
      };
    }

    shiftTimes[shiftName].start = newStart;
    shiftTimes[shiftName].end = newEnd;

    saveData();
    closeEditTimeModal();
    renderShiftTimeList();
    renderSchedule();

    return;
  }

  const overrideKey = getShiftOverrideKey(
    activeTimeEdit.dayKey,
    activeTimeEdit.shift.name,
  );

  shiftTimeOverrides[overrideKey] = {
    start: newStart,
    end: newEnd,
  };

  saveData();
  closeEditTimeModal();
  renderSchedule();
}

function resetShiftTimeForDate(dayKey, shiftName) {
  const overrideKey = getShiftOverrideKey(dayKey, shiftName);

  delete shiftTimeOverrides[overrideKey];

  saveData();
  renderSchedule();
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
      getShiftConfig("Night", "19:00", "07:00"),
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

      Object.keys(shiftTimeOverrides).forEach(function (overrideKey) {
        if (overrideKey.endsWith(`__${removedShiftName}`)) {
          delete shiftTimeOverrides[overrideKey];
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
    shiftTimeRow.classList.add("clean-shift-time-row");

    const shiftHours = getShiftHours(shift);

    shiftTimeRow.innerHTML = `
      <div>
        <strong>${shift.name}</strong>
        <span class="clean-shift-time-text">
          ${formatTime(shift.start)} - ${formatTime(shift.end)}
          · ${formatHours(shiftHours)}
        </span>
      </div>

      <button
        class="edit-default-time-button"
        type="button"
        data-shift="${shift.name}"
      >
        Edit default
      </button>
    `;

    shiftTimeList.append(shiftTimeRow);
  });

  const editDefaultTimeButtons = document.querySelectorAll(
    ".edit-default-time-button",
  );

  editDefaultTimeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const shiftName = button.dataset.shift;

      const shift = activeShifts.find(function (activeShift) {
        return activeShift.name === shiftName;
      });

      if (!shift) {
        return;
      }

      editDefaultShiftTime(shift);
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

      <div class="caregiver-list-buttons">
        <button class="edit-caregiver-button" type="button">Edit</button>
        <button class="remove-caregiver-button" type="button">Remove</button>
      </div>
    `;

    const editButton = caregiverItem.querySelector(".edit-caregiver-button");
    const removeButton = caregiverItem.querySelector(
      ".remove-caregiver-button",
    );

    editButton.addEventListener("click", function () {
      const updatedName = prompt("Edit caregiver name:", caregiverName);

      if (updatedName === null) {
        return;
      }

      const trimmedName = updatedName.trim();

      if (trimmedName === "") {
        return;
      }

      const isDuplicate = caregivers.some(
        function (existingName, existingIndex) {
          return (
            existingIndex !== index &&
            existingName.toLowerCase() === trimmedName.toLowerCase()
          );
        },
      );

      if (isDuplicate) {
        alert("That caregiver name already exists.");
        return;
      }

      caregivers[index] = trimmedName;

      Object.keys(scheduleAssignments).forEach(function (assignmentKey) {
        if (scheduleAssignments[assignmentKey] === caregiverName) {
          scheduleAssignments[assignmentKey] = trimmedName;
        }
      });

      saveData();
      renderCaregiverList();
      renderSchedule();
    });

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

function startAvailableShiftsAutoScroll() {
  clearInterval(availableShiftsScrollInterval);

  if (!availableShiftsBody) {
    return;
  }

  availableShiftsBody.scrollTop = 0;

  availableShiftsScrollInterval = setInterval(function () {
    const maxScroll =
      availableShiftsBody.scrollHeight - availableShiftsBody.clientHeight;

    if (maxScroll <= 0) {
      return;
    }

    if (availableShiftsBody.scrollTop >= maxScroll) {
      availableShiftsBody.scrollTop = 0;
    } else {
      availableShiftsBody.scrollTop += 1;
    }
  }, 70);
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
      const shiftForDay = getShiftForDay(day.key, shift);
      const shiftHours = getShiftHours(shiftForDay);
      const assignmentKey = `${day.key}-${shift.name}`;
      const assignedCaregiver = scheduleAssignments[assignmentKey] || "Open";

      totalHoursNeeded += shiftHours;

      if (assignedCaregiver === "Open") {
        openHours += shiftHours;
        openShiftsCount += 1;

        const availableShiftItem = document.createElement("li");
        availableShiftItem.textContent = `${day.label} — ${
          shift.name
        } (${formatTime(shiftForDay.start)} - ${formatTime(
          shiftForDay.end,
        )}, ${formatHours(shiftHours)})`;
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

  if (toastOpenShiftsCount) {
    toastOpenShiftsCount.textContent = openShiftsCount;
  }

  if (coveragePercentElement && coverageProgressFill) {
    let coveragePercent = 0;

    if (totalHoursNeeded > 0) {
      coveragePercent = Math.round(
        (totalHoursCovered / totalHoursNeeded) * 100,
      );
    }

    coveragePercentElement.textContent = `${coveragePercent}%`;
    coverageProgressFill.style.width = `${coveragePercent}%`;
  }

  caregiverHoursList.innerHTML = "";

  if (caregivers.length === 0) {
    const emptyCaregiverItem = document.createElement("li");
    emptyCaregiverItem.textContent = "No caregivers added yet.";
    caregiverHoursList.append(emptyCaregiverItem);
  } else {
    caregivers.forEach(function (caregiverName) {
      const caregiverHoursItem = document.createElement("li");
      caregiverHoursItem.textContent = `${caregiverName}: ${formatHours(
        caregiverHours[caregiverName] || 0,
      )}`;
      caregiverHoursList.append(caregiverHoursItem);
    });
  }

  if (openShiftsCount === 0) {
    const noOpenShiftsItem = document.createElement("li");
    noOpenShiftsItem.textContent = "No available shifts.";
    availableShiftsList.append(noOpenShiftsItem);
  }

  startAvailableShiftsAutoScroll();
}

function buildCaregiverOptions(assignedCaregiver) {
  let caregiverOptions = `<option value="Open">Open</option>`;

  caregivers.forEach(function (caregiverName) {
    const selected = caregiverName === assignedCaregiver ? "selected" : "";

    caregiverOptions += `
      <option value="${caregiverName}" ${selected}>${caregiverName}</option>
    `;
  });

  return caregiverOptions;
}

function renderWeeklySchedule(scheduleDays, activeShifts, selectedView) {
  scheduleSection.className = "";
  scheduleSection.classList.add("weekly-schedule-list");

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
      const shiftForDay = getShiftForDay(day.key, shift);
      const shiftHours = getShiftHours(shiftForDay);
      const caregiverOptions = buildCaregiverOptions(assignedCaregiver);

      const overrideBadge = shiftForDay.hasOverride
        ? `<span class="time-override-badge">Custom time</span>`
        : "";

      const resetButton = shiftForDay.hasOverride
        ? `
          <button
            class="reset-time-button"
            type="button"
            data-day="${day.key}"
            data-shift="${shift.name}"
          >
            Reset
          </button>
        `
        : "";

      shiftRows += `
        <div class="shift-row">
          <div>
            <span class="shift-name">${shift.name}</span>
            <span class="shift-time">
              ${formatTime(shiftForDay.start)} - ${formatTime(shiftForDay.end)}
              · ${formatHours(shiftHours)}
            </span>
            ${overrideBadge}
          </div>

          <div class="shift-actions">
            <select
              class="assignment-select"
              data-day="${day.key}"
              data-shift="${shift.name}"
            >
              ${caregiverOptions}
            </select>

            <button
              class="edit-time-button"
              type="button"
              data-day="${day.key}"
              data-shift="${shift.name}"
            >
              Edit time
            </button>

            ${resetButton}
          </div>
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

    dayCard.addEventListener("click", function (event) {
      const clickedInsideControl = event.target.closest(
        "select, button, input, textarea, .pretty-select",
      );

      if (clickedInsideControl) {
        return;
      }

      weekStartDateInput.value = day.key;

      saveData();
      renderSchedule();
    });

    scheduleSection.append(dayCard);
  });
}

function renderMonthlySchedule(scheduleDays, activeShifts) {
  scheduleSection.className = "";
  scheduleSection.classList.add("monthly-schedule-grid");

  const orderedWeekDays = getOrderedWeekDays();

  orderedWeekDays.forEach(function (dayName) {
    const weekdayHeader = document.createElement("div");
    weekdayHeader.classList.add("month-weekday-header");
    weekdayHeader.textContent = dayName.slice(0, 3);
    scheduleSection.append(weekdayHeader);
  });

  if (scheduleDays.length > 0) {
    const firstDate = scheduleDays[0].date;
    const firstDayIndex = getAppDayIndex(firstDate);
    const selectedStartIndex = allWeekDays.indexOf(weekStartSelect.value);

    let blankDays = firstDayIndex - selectedStartIndex;

    if (blankDays < 0) {
      blankDays += 7;
    }

    for (let i = 0; i < blankDays; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.classList.add("month-empty-day");
      scheduleSection.append(emptyDay);
    }
  }

  scheduleDays.forEach(function (day) {
    const dayCard = document.createElement("div");
    dayCard.classList.add("month-day-card");

    const dayNumber = day.date.getDate();
    const weekdayShort = day.date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    let shiftRows = "";

    activeShifts.forEach(function (shift) {
      const assignmentKey = `${day.key}-${shift.name}`;
      const assignedCaregiver = scheduleAssignments[assignmentKey] || "Open";
      const caregiverOptions = buildCaregiverOptions(assignedCaregiver);
      const shiftForDay = getShiftForDay(day.key, shift);
      const shiftHours = getShiftHours(shiftForDay);

      const resetButton = shiftForDay.hasOverride
        ? `
          <button
            class="reset-time-button month-reset-button"
            type="button"
            data-day="${day.key}"
            data-shift="${shift.name}"
          >
            Reset
          </button>
        `
        : "";

      shiftRows += `
        <div class="month-shift-row ${
          shiftForDay.hasOverride ? "month-shift-custom" : ""
        }">
          <div class="month-shift-info">
            <span class="month-shift-name">${shift.name}</span>
            <span class="month-shift-time">${formatHours(shiftHours)}</span>
          </div>

          <select
            class="assignment-select month-assignment-select"
            data-day="${day.key}"
            data-shift="${shift.name}"
          >
            ${caregiverOptions}
          </select>

          <button
            class="edit-time-button month-time-button"
            type="button"
            data-day="${day.key}"
            data-shift="${shift.name}"
          >
            Time
          </button>

          ${resetButton}
        </div>
      `;
    });

    dayCard.innerHTML = `
      <div class="month-day-header">
        <span class="month-date-number">${dayNumber}</span>
        <span class="month-weekday">${weekdayShort}</span>
      </div>

      <div class="month-shifts">
        ${shiftRows}
      </div>
    `;

    scheduleSection.append(dayCard);
  });
}

function attachAssignmentListeners(scheduleDays, activeShifts) {
  const assignmentSelects = document.querySelectorAll(".assignment-select");

  assignmentSelects.forEach(function (select) {
    select.addEventListener("change", function () {
      const dayName = select.dataset.day;
      const shiftName = select.dataset.shift;
      const assignmentKey = `${dayName}-${shiftName}`;

      scheduleAssignments[assignmentKey] = select.value;

      saveData();
      renderCoverageSummary(scheduleDays, activeShifts);
      syncAllPrettySelects();
    });
  });
}

function attachShiftTimeButtonListeners() {
  const editTimeButtons = document.querySelectorAll(".edit-time-button");
  const resetTimeButtons = document.querySelectorAll(".reset-time-button");

  editTimeButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();

      const dayKey = button.dataset.day;
      const shiftName = button.dataset.shift;

      const activeShifts = getActiveShifts();
      const shift = activeShifts.find(function (activeShift) {
        return activeShift.name === shiftName;
      });

      if (!shift) {
        return;
      }

      editShiftTimeForDate(dayKey, shift);
    });
  });

  resetTimeButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();

      const dayKey = button.dataset.day;
      const shiftName = button.dataset.shift;

      resetShiftTimeForDate(dayKey, shiftName);
    });
  });
}

function closeAllPrettySelects() {
  document
    .querySelectorAll(".pretty-select.is-open")
    .forEach(function (wrapper) {
      wrapper.classList.remove("is-open");
    });
}

function syncPrettySelectButton(select) {
  const wrapper = select.nextElementSibling;

  if (!wrapper || !wrapper.classList.contains("pretty-select")) {
    return;
  }

  const label = wrapper.querySelector(".pretty-select-label");
  const selectedOption = select.options[select.selectedIndex];

  if (label && selectedOption) {
    label.textContent = selectedOption.textContent;
  }

  wrapper.querySelectorAll(".pretty-select-option").forEach(function (button) {
    button.classList.toggle(
      "is-selected",
      button.dataset.value === select.value,
    );
  });
}

function rebuildPrettySelectOptions(select) {
  const wrapper = select.nextElementSibling;

  if (!wrapper || !wrapper.classList.contains("pretty-select")) {
    return;
  }

  const menu = wrapper.querySelector(".pretty-select-menu");
  menu.innerHTML = "";

  Array.from(select.options).forEach(function (option) {
    const optionButton = document.createElement("button");
    optionButton.type = "button";
    optionButton.classList.add("pretty-select-option");
    optionButton.dataset.value = option.value;
    optionButton.textContent = option.textContent;

    if (option.value === select.value) {
      optionButton.classList.add("is-selected");
    }

    optionButton.addEventListener("click", function (event) {
      event.stopPropagation();

      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));

      closeAllPrettySelects();
      syncPrettySelectButton(select);
    });

    menu.append(optionButton);
  });
}

function enhanceSelect(select) {
  if (select.dataset.prettySelect === "true") {
    rebuildPrettySelectOptions(select);
    syncPrettySelectButton(select);
    return;
  }

  select.dataset.prettySelect = "true";
  select.classList.add("native-hidden-select");

  const wrapper = document.createElement("div");
  wrapper.classList.add("pretty-select");

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("pretty-select-button");
  button.innerHTML = `
    <span class="pretty-select-label"></span>
    <span class="pretty-select-arrow">⌄</span>
  `;

  const menu = document.createElement("div");
  menu.classList.add("pretty-select-menu");

  wrapper.append(button);
  wrapper.append(menu);
  select.after(wrapper);

  button.addEventListener("click", function (event) {
    event.stopPropagation();

    const isOpen = wrapper.classList.contains("is-open");

    closeAllPrettySelects();

    if (!isOpen) {
      wrapper.classList.add("is-open");
    }
  });

  select.addEventListener("change", function () {
    syncPrettySelectButton(select);
  });

  rebuildPrettySelectOptions(select);
  syncPrettySelectButton(select);
}

function enhanceAllSelects() {
  document.querySelectorAll("select").forEach(function (select) {
    enhanceSelect(select);
  });
}

function syncAllPrettySelects() {
  document.querySelectorAll("select").forEach(function (select) {
    syncPrettySelectButton(select);
  });
}

function renderSchedule() {
  scheduleSection.innerHTML = "";

  const activeShifts = getActiveShifts();
  const selectedView = scheduleViewSelect.value;

  let scheduleDays = [];

  if (selectedView === "monthly") {
    scheduleTitle.textContent = "Monthly Schedule";

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

    renderMonthlySchedule(scheduleDays, activeShifts);
  } else {
    scheduleTitle.textContent = "Weekly Schedule";

    scheduleDays = getDaysInSelectedWeek();

    const firstDay = scheduleDays[0].label;
    const lastDay = scheduleDays[scheduleDays.length - 1].label;

    weekLabel.textContent = `${firstDay} - ${lastDay}`;

    renderWeeklySchedule(scheduleDays, activeShifts, selectedView);
  }

  attachAssignmentListeners(scheduleDays, activeShifts);
  attachShiftTimeButtonListeners();
  renderCoverageSummary(scheduleDays, activeShifts);
  enhanceAllSelects();
}

function addCaregiver() {
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

customShiftInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addShiftButton.click();
  }
});

addCaregiverButton.addEventListener("click", function () {
  addCaregiver();
});

caregiverInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addCaregiver();
  }
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

minimizeAvailableShiftsButton.addEventListener("click", function () {
  const isCurrentlyMinimized =
    availableShiftsToast.classList.contains("is-minimized");

  localStorage.setItem(
    "kindshiftAvailableShiftsMinimized",
    String(!isCurrentlyMinimized),
  );

  updateAvailableShiftsMinimizedState();
});

closeEditTimeButton.addEventListener("click", function () {
  closeEditTimeModal();
});

cancelEditTimeButton.addEventListener("click", function () {
  closeEditTimeModal();
});

saveEditTimeButton.addEventListener("click", function () {
  saveEditedShiftTime();
});

editTimeModal.addEventListener("click", function (event) {
  if (event.target === editTimeModal) {
    closeEditTimeModal();
  }
});

document.addEventListener("click", function (event) {
  if (!event.target.closest(".pretty-select")) {
    closeAllPrettySelects();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeAllPrettySelects();

    if (!editTimeModal.classList.contains("hidden")) {
      closeEditTimeModal();
    }
  }
});

fillPrettyTimeSelects();
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
updateAvailableShiftsMinimizedState();
renderShiftList();
renderCaregiverList();
renderShiftTimeList();
renderSchedule();
enhanceAllSelects();
