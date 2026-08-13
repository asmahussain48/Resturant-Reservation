const tableForm = document.getElementById("tableForm");
const tablesContainer = document.getElementById("tablesContainer");
const loadingTables = document.getElementById("loadingTables");
const emptyTables = document.getElementById("emptyTables");
const formError = document.getElementById("formError");

function openForm() {
  tableForm.classList.remove("hidden");
  tableForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function closeForm() {
  tableForm.classList.add("hidden");
  formError.classList.add("hidden");
  document.getElementById("capacity").value = "";
  document.getElementById("location").value = "";
}

function showToast(message, success = true) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.className = `fixed right-5 bottom-5 z-50 text-white px-5 py-4 rounded-2xl shadow-2xl ${
    success ? "bg-green-700" : "bg-red-600"
  }`;

  setTimeout(() => toast.classList.add("hidden"), 3000);
}

function updateSummary(tables) {
  const activeTables = tables.filter((table) => table.isActive).length;
  const totalSeats = tables.reduce((total, table) => total + table.capacity, 0);

  document.getElementById("totalTables").textContent = tables.length;
  document.getElementById("activeTables").textContent = activeTables;
  document.getElementById("inactiveTables").textContent = tables.length - activeTables;
  document.getElementById("totalSeats").textContent = totalSeats;
}

function createTableCard(table) {
  const card = document.createElement("article");
  const statusStyle = table.isActive
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-red-50 text-red-600 border-red-200";

  card.className =
    "bg-white border border-[#ECE3D8] rounded-3xl p-6 hover:-translate-y-1 hover:shadow-xl transition duration-300";

  card.innerHTML = `
    <div class="flex items-start justify-between gap-4">
      <div class="w-12 h-12 rounded-2xl bg-[#F4ECE2] text-[#8B5E34] flex items-center justify-center font-bold">
        ${table.tableNumber}
      </div>
      <span class="border px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}">
        ${table.isActive ? "Active" : "Inactive"}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-3 mt-6">
      <div class="bg-[#FAF7F2] rounded-xl p-3">
        <p class="text-xs uppercase tracking-wider text-gray-400">Capacity</p>
        <p class="font-semibold mt-1">${table.capacity} guests</p>
      </div>
      <div class="bg-[#FAF7F2] rounded-xl p-3">
        <p class="text-xs uppercase tracking-wider text-gray-400">Location</p>
        <p class="font-semibold mt-1 truncate" title="${table.location}">${table.location}</p>
      </div>
    </div>

    <button type="button"
      class="status-button w-full mt-5 border border-[#DED3C6] px-5 py-3 rounded-full font-medium hover:bg-[#2C2118] hover:text-white hover:border-[#2C2118] transition">
      ${table.isActive ? "Mark as Inactive" : "Mark as Active"}
    </button>
  `;

  card.querySelector(".status-button").addEventListener("click", () => {
    changeStatus(table._id, !table.isActive);
  });

  return card;
}

async function loadTables() {
  try {
    const response = await fetch("/admin/api/tables");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load tables");
    }

    loadingTables.classList.add("hidden");
    tablesContainer.innerHTML = "";
    updateSummary(data.tables);

    if (data.tables.length === 0) {
      emptyTables.classList.remove("hidden");
      tablesContainer.classList.add("hidden");
      return;
    }

    emptyTables.classList.add("hidden");
    tablesContainer.classList.remove("hidden");

    data.tables.forEach((table) => {
      tablesContainer.appendChild(createTableCard(table));
    });
  } catch (error) {
    loadingTables.textContent = error.message;
    loadingTables.classList.remove("hidden");
    showToast(error.message, false);
  }
}

async function addTable() {
  const capacity = document.getElementById("capacity").value;
  const location = document.getElementById("location").value;
  const saveButton = document.getElementById("saveTableButton");

  if (!capacity || !location) {
    formError.textContent = "Please select both capacity and location.";
    formError.classList.remove("hidden");
    return;
  }

  formError.classList.add("hidden");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const response = await fetch("/admin/api/tables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ capacity, location }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to add table");
    }

    closeForm();
    showToast(`Table ${data.table.tableNumber} added successfully`);
    await loadTables();
  } catch (error) {
    formError.textContent = error.message;
    formError.classList.remove("hidden");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = "Save Table";
  }
}

async function changeStatus(id, isActive) {
  try {
    const response = await fetch(`/admin/api/tables/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update table");
    }

    showToast(data.message);
    await loadTables();
  } catch (error) {
    showToast(error.message, false);
  }
}

document.getElementById("addTableButton").addEventListener("click", openForm);
document.getElementById("closeFormButton").addEventListener("click", closeForm);
document.getElementById("cancelButton").addEventListener("click", closeForm);
document.getElementById("saveTableButton").addEventListener("click", addTable);

loadTables();
