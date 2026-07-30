let restaurantOpen = true;

async function loadSettings() {
  const response = await fetch("/admin/api/settings");

  const data = await response.json();

  const settings = data.settings;

  document.getElementById("openingTime").value = settings.openingTime;

  document.getElementById("closingTime").value = settings.closingTime;

  document.getElementById("slotDuration").value = settings.slotDuration;

  restaurantOpen = settings.isOpen;

  updateButton();
}

function updateButton() {
  const button = document.getElementById("statusButton");

  if (restaurantOpen) {
    button.innerHTML = "Restaurant Open";

    button.className = "mt-3 px-6 py-3 rounded-full bg-green-600 text-white";
  } else {
    button.innerHTML = "Restaurant Closed";

    button.className = "mt-3 px-6 py-3 rounded-full bg-red-600 text-white";
  }
}

async function saveSettings() {
  await fetch("/admin/api/settings", {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      openingTime: document.getElementById("openingTime").value,

      closingTime: document.getElementById("closingTime").value,

      slotDuration: Number(document.getElementById("slotDuration").value),
    }),
  });

  alert("Settings Updated");
}

async function toggleStatus() {
  restaurantOpen = !restaurantOpen;

  await fetch("/admin/api/settings/status", {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      isOpen: restaurantOpen,
    }),
  });

  updateButton();
}

loadSettings();
