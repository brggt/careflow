function renderCaregiverList() {
  caregiverList.innerHTML = "";

  caregivers.forEach(function (caregiverName, index) {
    const caregiverItem = document.createElement("li");
    caregiverItem.classList.add("caregiver-list-item");

    caregiverItem.innerHTML = `
      <span>${caregiverName} — Max ${
        caregiverMaxHours[caregiverName] || 50
      } hrs</span>

      <div class="caregiver-list-buttons">
        <button class="edit-caregiver-button" type="button">Edit Name</button>
        <button class="edit-max-hours-button" type="button">Edit Max</button>
        <button class="remove-caregiver-button" type="button">Remove</button>
      </div>
    `;

    const editButton = caregiverItem.querySelector(".edit-caregiver-button");
    const editMaxHoursButton = caregiverItem.querySelector(
      ".edit-max-hours-button",
    );
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

      caregiverMaxHours[trimmedName] = caregiverMaxHours[caregiverName] || 50;
      delete caregiverMaxHours[caregiverName];

      Object.keys(scheduleAssignments).forEach(function (assignmentKey) {
        if (scheduleAssignments[assignmentKey] === caregiverName) {
          scheduleAssignments[assignmentKey] = trimmedName;
        }
      });

      saveData();
      renderCaregiverList();
      renderSchedule();
    });

    editMaxHoursButton.addEventListener("click", function () {
      const currentMaxHours = caregiverMaxHours[caregiverName] || 50;

      const updatedMaxHours = prompt(
        `Set max weekly hours for ${caregiverName}:`,
        currentMaxHours,
      );

      if (updatedMaxHours === null) {
        return;
      }

      const maxHoursNumber = Number(updatedMaxHours);

      if (!maxHoursNumber || maxHoursNumber <= 0) {
        alert("Please enter a valid number.");
        return;
      }

      caregiverMaxHours[caregiverName] = maxHoursNumber;

      saveData();
      renderCaregiverList();
      renderSchedule();
    });

    removeButton.addEventListener("click", function () {
      caregivers.splice(index, 1);
      delete caregiverMaxHours[caregiverName];

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
