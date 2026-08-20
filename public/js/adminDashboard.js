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

async function loadWeeklyReservationsChart() {
  try {
    const response = await fetch("/admin/dashboard/reservations-weekly");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load reservation chart");
    }

    const labels = result.data.map((item) =>
      new Date(`${item.date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    );

    const reservations = result.data.map((item) => item.reservations);
    const canvas = document.getElementById("weeklyReservationsChart");

    const total = reservations.reduce((sum, value) => sum + value, 0);
    const peak = Math.max(...reservations, 0);
    document.getElementById("weeklyTotal").textContent = total;
    document.getElementById("weeklyAverage").textContent = (
      total / Math.max(reservations.length, 1)
    ).toFixed(1);
    document.getElementById("weeklyPeak").textContent = peak;

    new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Reservations",
            data: reservations,
            backgroundColor: (context) =>
              context.raw === peak ? "#8B5E34" : "rgba(139, 94, 52, 0.28)",
            hoverBackgroundColor: "#6F451F",
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 44,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 650, easing: "easeOutQuart" },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: "#211A15",
            titleFont: { size: 12, weight: "600" },
            bodyFont: { size: 13, weight: "600" },
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (context) =>
                `${context.parsed.y} reservation${context.parsed.y === 1 ? "" : "s"}`,
            },
          },
        },
        scales: {
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: { color: "#78716C", font: { size: 12, weight: "500" } },
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(peak + 1, 3),
            border: { display: false },
            grid: { color: "rgba(120, 113, 108, 0.12)" },
            ticks: {
              precision: 0,
              stepSize: 1,
              color: "#A8A29E",
              font: { size: 11 },
              padding: 10,
            },
          },
        },
      },
    });
  } catch (error) {
    showError(error.message);
  }
}

const statusColors = {
  confirmed: "#2F855A",
  pending: "#D6A36A",
  cancelled: "#C65D4B",
};

const doughnutCenterText = {
  id: "doughnutCenterText",
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    const total = chart.data.datasets[0].data.reduce(
      (sum, value) => sum + value,
      0,
    );
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#A8A29E";
    ctx.font = "600 11px Inter, sans-serif";
    ctx.fillText("TOTAL", centerX, centerY - 13);
    ctx.fillStyle = "#211A15";
    ctx.font = "700 28px Inter, sans-serif";
    ctx.fillText(total, centerX, centerY + 13);
    ctx.restore();
  },
};

async function loadReservationStatusChart() {
  try {
    const response = await fetch("/admin/dashboard/reservation-status");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load reservation statuses");
    }

    const labels = result.data.map(
      (item) => item.status.charAt(0).toUpperCase() + item.status.slice(1),
    );
    const totals = result.data.map((item) => item.total);
    const colors = result.data.map((item) => statusColors[item.status]);
    const grandTotal = totals.reduce((sum, value) => sum + value, 0);

    document.getElementById("statusLegend").innerHTML = result.data
      .map((item) => {
        const label = item.status.charAt(0).toUpperCase() + item.status.slice(1);
        const percentage = grandTotal
          ? Math.round((item.total / grandTotal) * 100)
          : 0;

        return `
          <div class="flex items-center justify-between rounded-2xl border border-[#EEE7DE] px-4 py-3.5">
            <div class="flex items-center gap-3">
              <span class="h-3 w-3 rounded-full" style="background:${statusColors[item.status]}"></span>
              <div>
                <p class="text-sm font-semibold text-[#211A15]">${label}</p>
                <p class="mt-0.5 text-xs text-gray-400">${percentage}% of tracked reservations</p>
              </div>
            </div>
            <p class="text-2xl font-bold text-[#211A15]">${item.total}</p>
          </div>`;
      })
      .join("");

    new Chart(document.getElementById("reservationStatusChart"), {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: totals,
            backgroundColor: colors,
            borderColor: "#FFFFFF",
            borderWidth: 5,
            hoverBorderWidth: 5,
            hoverOffset: 5,
          },
        ],
      },
      plugins: [doughnutCenterText],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        animation: { duration: 650, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: true,
            usePointStyle: true,
            backgroundColor: "#211A15",
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (context) =>
                ` ${context.label}: ${context.parsed} reservation${context.parsed === 1 ? "" : "s"}`,
            },
          },
        },
      },
    });
  } catch (error) {
    document.getElementById("statusLegend").innerHTML =
      '<p class="rounded-2xl bg-red-50 p-4 text-sm text-red-700">Status data could not be loaded.</p>';
    showError(error.message);
  }
}

async function loadPeakHoursChart() {
  try {
    const response = await fetch("/admin/dashboard/peak-hours");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load peak reservation hours");
    }

    const hourlyData = result.data
      .map((item) => {
        const rawHour = item.hour24 ?? item._id;
        const hour24 = Number.parseInt(rawHour, 10);
        const suffix = hour24 >= 12 ? "PM" : "AM";
        const displayHour = hour24 % 12 || 12;

        return {
          hour: item.hour || `${displayHour} ${suffix}`,
          hour24,
          reservations: Number(item.reservations ?? item.count ?? 0),
        };
      })
      .filter(
        (item) =>
          Number.isFinite(item.hour24) && Number.isFinite(item.reservations),
      );

    if (hourlyData.length === 0) {
      document.getElementById("peakHoursChartContainer").classList.add("hidden");
      document.getElementById("peakHoursEmpty").classList.remove("hidden");
      document.getElementById("peakHoursEmpty").classList.add("flex");
      document.getElementById("busiestHour").textContent = "No data";
      return;
    }

    const peak = hourlyData.reduce((busiest, item) =>
      item.reservations > busiest.reservations ? item : busiest,
    );

    document.getElementById("busiestHour").textContent = peak.hour;
    document.getElementById("busiestHourCount").textContent =
      `${peak.reservations} booking${peak.reservations === 1 ? "" : "s"}`;

    new Chart(document.getElementById("peakHoursChart"), {
      type: "bar",
      data: {
        labels: hourlyData.map((item) => item.hour),
        datasets: [
          {
            label: "Reservations",
            data: hourlyData.map((item) => item.reservations),
            backgroundColor: hourlyData.map((item) =>
              item.hour24 === peak.hour24
                ? "#8B5E34"
                : "rgba(139, 94, 52, 0.28)",
            ),
            hoverBackgroundColor: "#6F451F",
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 48,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 650, easing: "easeOutQuart" },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            displayColors: false,
            backgroundColor: "#211A15",
            titleFont: { size: 12, weight: "600" },
            bodyFont: { size: 13, weight: "600" },
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (context) =>
                `${context.parsed.y} reservation${context.parsed.y === 1 ? "" : "s"}`,
            },
          },
        },
        scales: {
          x: {
            border: { display: false },
            grid: { display: false },
            ticks: {
              color: "#78716C",
              font: { size: 12, weight: "500" },
              maxRotation: 0,
              autoSkip: true,
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(peak.reservations + 2, 5),
            border: { display: false },
            grid: { color: "rgba(120, 113, 108, 0.12)" },
            title: {
              display: true,
              text: "Reservations",
              color: "#A8A29E",
              font: { size: 11, weight: "600" },
            },
            ticks: {
              precision: 0,
              color: "#A8A29E",
              font: { size: 11 },
              padding: 10,
            },
          },
        },
      },
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
loadWeeklyReservationsChart();
loadReservationStatusChart();
loadPeakHoursChart();
