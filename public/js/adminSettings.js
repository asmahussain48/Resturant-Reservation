let restaurantOpen = true;
let savedSettings = null;

const settingsForm = document.getElementById("settingsForm");
const openingTimeInput = document.getElementById("openingTime");
const closingTimeInput = document.getElementById("closingTime");
const slotDurationInput = document.getElementById("slotDuration");
const formError = document.getElementById("formError");

function showToast(message, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `fixed right-5 bottom-5 z-50 text-white px-5 py-4 rounded-2xl shadow-2xl ${
    success ? "bg-green-700" : "bg-red-600"
  }`;

  setTimeout(() => toast.classList.add("hidden"), 3000);
}

function formatTime(time) {
  if (!time) return "--";

  const [hourText, minute] = time.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function calculateSlots(openingTime, closingTime, duration) {
  if (!openingTime || !closingTime || !duration) return 0;

  const openingHour = Number(openingTime.split(":")[0]);
  const closingHour = Number(closingTime.split(":")[0]);
  return Math.max(0, Math.floor((closingHour - openingHour) / duration));
}

function updateSummary() {
  const openingTime = openingTimeInput.value;
  const closingTime = closingTimeInput.value;
  const duration = Number(slotDurationInput.value);
  const slots = calculateSlots(openingTime, closingTime, duration);

  document.getElementById("openingSummary").textContent = formatTime(openingTime);
  document.getElementById("closingSummary").textContent = formatTime(closingTime);
  document.getElementById("slotsSummary").textContent = `${slots} slots`;

  if (openingTime && closingTime && openingTime < closingTime) {
    document.getElementById("schedulePreview").textContent =
      `Open from ${formatTime(openingTime)} to ${formatTime(closingTime)}, with ${duration}-hour reservations and approximately ${slots} booking slots each day.`;
  } else {
    document.getElementById("schedulePreview").textContent =
      "Closing time must be later than opening time.";
  }
}

function updateStatus() {
  const statusIcon = document.getElementById("statusIcon");
  const statusTitle = document.getElementById("statusTitle");
  const statusDescription = document.getElementById("statusDescription");
  const statusButton = document.getElementById("statusButton");

  if (restaurantOpen) {
    statusIcon.className =
      "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-green-500/15 text-green-400";
    statusTitle.textContent = "Restaurant Open";
    statusDescription.textContent = "Guests can make new reservations.";
    statusButton.textContent = "Close Restaurant";
  } else {
    statusIcon.className =
      "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-red-500/15 text-red-400";
    statusTitle.textContent = "Restaurant Closed";
    statusDescription.textContent = "New reservations are currently paused.";
    statusButton.textContent = "Open Restaurant";
  }
}

function getCurrentSettings() {
  return {
    openingTime: openingTimeInput.value,
    closingTime: closingTimeInput.value,
    slotDuration: Number(slotDurationInput.value),
  };
}

function trackChanges() {
  updateSummary();

  if (!savedSettings) return;

  const current = getCurrentSettings();
  const changed = JSON.stringify(current) !== JSON.stringify(savedSettings);
  document.getElementById("unsavedMessage").classList.toggle("hidden", !changed);
  document.getElementById("savedBadge").classList.add("hidden");
}

function fillForm(settings) {
  openingTimeInput.value = settings.openingTime;
  closingTimeInput.value = settings.closingTime;
  slotDurationInput.value = settings.slotDuration;
  restaurantOpen = settings.isOpen;
  savedSettings = getCurrentSettings();

  updateStatus();
  updateSummary();
  document.getElementById("unsavedMessage").classList.add("hidden");
}

async function loadSettings() {
  try {
    const response = await fetch("/admin/api/settings");
    const data = await response.json();

    if (!response.ok || !data.settings) {
      throw new Error(data.message || "Unable to load restaurant settings");
    }

    fillForm(data.settings);
    document.getElementById("loadingSettings").classList.add("hidden");
    document.getElementById("settingsContent").classList.remove("hidden");
  } catch (error) {
    document.getElementById("loadingSettings").textContent = error.message;
    showToast(error.message, false);
  }
}

async function saveSettings(event) {
  event.preventDefault();
  const settings = getCurrentSettings();

  if (!settings.openingTime || !settings.closingTime || !settings.slotDuration) {
    formError.textContent = "Please complete all operating-hour fields.";
    formError.classList.remove("hidden");
    return;
  }

  if (settings.openingTime >= settings.closingTime) {
    formError.textContent = "Closing time must be later than opening time.";
    formError.classList.remove("hidden");
    return;
  }

  formError.classList.add("hidden");
  const saveButton = document.getElementById("saveButton");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const response = await fetch("/admin/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save settings");
    }

    savedSettings = getCurrentSettings();
    document.getElementById("unsavedMessage").classList.add("hidden");
    document.getElementById("savedBadge").classList.remove("hidden");
    showToast(data.message);
  } catch (error) {
    formError.textContent = error.message;
    formError.classList.remove("hidden");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Changes";
  }
}

async function toggleStatus() {
  const statusButton = document.getElementById("statusButton");
  const newStatus = !restaurantOpen;
  statusButton.disabled = true;
  statusButton.textContent = "Updating...";

  try {
    const response = await fetch("/admin/api/settings/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOpen: newStatus }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update restaurant status");
    }

    restaurantOpen = data.settings.isOpen;
    updateStatus();
    showToast(data.message);
  } catch (error) {
    showToast(error.message, false);
    updateStatus();
  } finally {
    statusButton.disabled = false;
  }
}

function resetSettings() {
  if (!savedSettings) return;

  openingTimeInput.value = savedSettings.openingTime;
  closingTimeInput.value = savedSettings.closingTime;
  slotDurationInput.value = savedSettings.slotDuration;
  formError.classList.add("hidden");
  document.getElementById("unsavedMessage").classList.add("hidden");
  updateSummary();
}

settingsForm.addEventListener("submit", saveSettings);
document.getElementById("statusButton").addEventListener("click", toggleStatus);
document.getElementById("resetButton").addEventListener("click", resetSettings);
openingTimeInput.addEventListener("input", trackChanges);
closingTimeInput.addEventListener("input", trackChanges);
slotDurationInput.addEventListener("change", trackChanges);

loadSettings();
