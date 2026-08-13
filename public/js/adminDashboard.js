function showError(message) {
  const errorBox = document.getElementById("dashboardError");
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
  setTimeout(() => errorBox.classList.add("hidden"), 4000);
}

async function loadDashboard() {
  try {
    const response = await fetch("/admin/dashboard");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load dashboard");
    }

    Object.entries(result.data).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) element.textContent = value;
    });
  } catch (error) {
    showError(error.message);
  }
}

document.getElementById("dashboardDate").textContent =
  `${new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })} · Today's restaurant summary.`;

loadDashboard();
