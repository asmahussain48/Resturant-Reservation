let allMenuItems = [];
let itemToDelete = null;

const menuContainer = document.getElementById("menuContainer");
const loadingMenu = document.getElementById("loadingMenu");
const emptyMenu = document.getElementById("emptyMenu");
const itemModal = document.getElementById("itemModal");
const deleteModal = document.getElementById("deleteModal");
const itemForm = document.getElementById("itemForm");
const formError = document.getElementById("formError");

function showToast(message, success = true) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `fixed right-5 bottom-5 z-[120] text-white px-5 py-4 rounded-2xl shadow-2xl ${
    success ? "bg-green-700" : "bg-red-600"
  }`;

  setTimeout(() => toast.classList.add("hidden"), 3000);
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = String(value ?? "");
  return element.innerHTML;
}

function updateSummary() {
  const available = allMenuItems.filter((item) => item.isAvailable).length;
  const categories = new Set(allMenuItems.map((item) => item.category).filter(Boolean));

  document.getElementById("totalItems").textContent = allMenuItems.length;
  document.getElementById("availableItems").textContent = available;
  document.getElementById("unavailableItems").textContent = allMenuItems.length - available;
  document.getElementById("categoryCount").textContent = categories.size;
}

function updateCategoryFilter() {
  const filter = document.getElementById("categoryFilter");
  const selectedValue = filter.value;
  const categories = [...new Set(allMenuItems.map((item) => item.category).filter(Boolean))].sort();

  filter.innerHTML = '<option value="All">All categories</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filter.appendChild(option);
  });

  if (categories.includes(selectedValue)) {
    filter.value = selectedValue;
  }
}

function createMenuCard(item) {
  const card = document.createElement("article");
  const safeName = item.name || "Unnamed menu item";
  const safeDescription = item.description || "No description available.";
  const safeCategory = item.category || "Uncategorized";
  const displayName = escapeHtml(safeName);
  const displayDescription = escapeHtml(safeDescription);
  const displayCategory = escapeHtml(safeCategory);
  const statusStyle = item.isAvailable
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-red-50 text-red-600 border-red-200";

  card.className =
    "bg-white border border-[#ECE3D8] rounded-3xl p-6 flex flex-col hover:-translate-y-1 hover:shadow-xl transition duration-300";

  card.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <span class="bg-[#F4ECE2] text-[#8B5E34] text-xs font-semibold px-3 py-2 rounded-full">${displayCategory}</span>
      <span class="border px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}">
        ${item.isAvailable ? "Available" : "Unavailable"}
      </span>
    </div>

    <h3 class="font-serif text-2xl font-bold mt-5">${displayName}</h3>
    <p class="text-sm text-gray-500 leading-6 mt-2 flex-1">${displayDescription}</p>

    <div class="flex items-end justify-between border-t border-[#F0E7DD] mt-6 pt-5">
      <div>
        <p class="text-xs uppercase tracking-wider text-gray-400">Price</p>
        <p class="text-2xl font-bold text-[#8B5E34] mt-1">Rs ${Number(item.price || 0).toLocaleString()}</p>
      </div>
      <button type="button" class="edit-button border border-[#DED3C6] px-5 py-2 rounded-full font-medium hover:bg-[#2C2118] hover:text-white transition">Edit</button>
    </div>

    <div class="grid grid-cols-2 gap-3 mt-3">
      <button type="button" class="status-button bg-[#F4ECE2] text-[#8B5E34] px-4 py-2 rounded-full font-medium hover:bg-[#8B5E34] hover:text-white transition">
        ${item.isAvailable ? "Make Unavailable" : "Make Available"}
      </button>
      <button type="button" class="delete-button text-red-600 px-4 py-2 rounded-full font-medium hover:bg-red-50 transition">Delete</button>
    </div>
  `;

  card.querySelector(".edit-button").addEventListener("click", () => openEditModal(item));
  card.querySelector(".status-button").addEventListener("click", () => toggleStatus(item));
  card.querySelector(".delete-button").addEventListener("click", () => openDeleteModal(item));

  return card;
}

function renderMenu() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const status = document.getElementById("statusFilter").value;

  const filteredItems = allMenuItems.filter((item) => {
    const itemText = `${item.name || ""} ${item.description || ""}`.toLowerCase();
    const matchesSearch = itemText.includes(search);
    const matchesCategory = category === "All" || item.category === category;
    const matchesStatus =
      status === "All" ||
      (status === "Available" && item.isAvailable) ||
      (status === "Unavailable" && !item.isAvailable);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  menuContainer.innerHTML = "";
  document.getElementById("resultCount").textContent = `${filteredItems.length} item${filteredItems.length === 1 ? "" : "s"} shown`;

  if (filteredItems.length === 0) {
    menuContainer.classList.add("hidden");
    emptyMenu.classList.remove("hidden");
    return;
  }

  emptyMenu.classList.add("hidden");
  menuContainer.classList.remove("hidden");
  filteredItems.forEach((item) => menuContainer.appendChild(createMenuCard(item)));
}

async function loadMenu() {
  try {
    const response = await fetch("/admin/api/menu");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load menu items");
    }

    allMenuItems = data.menu;
    loadingMenu.classList.add("hidden");
    updateSummary();
    updateCategoryFilter();
    renderMenu();
  } catch (error) {
    loadingMenu.textContent = error.message;
    showToast(error.message, false);
  }
}

function resetForm() {
  itemForm.reset();
  document.getElementById("itemId").value = "";
  document.getElementById("itemAvailable").checked = true;
  formError.classList.add("hidden");
}

function openAddModal() {
  resetForm();
  document.getElementById("modalLabel").textContent = "New Menu Item";
  document.getElementById("modalTitle").textContent = "Add Menu Item";
  document.getElementById("saveItemButton").textContent = "Add Item";
  openModal();
}

function openEditModal(item) {
  resetForm();
  document.getElementById("itemId").value = item._id;
  document.getElementById("itemName").value = item.name || "";
  document.getElementById("itemDescription").value = item.description || "";
  document.getElementById("itemCategory").value = item.category || "";
  document.getElementById("itemPrice").value = item.price ?? "";
  document.getElementById("itemAvailable").checked = Boolean(item.isAvailable);
  document.getElementById("modalLabel").textContent = "Edit Menu Item";
  document.getElementById("modalTitle").textContent = item.name || "Unnamed menu item";
  document.getElementById("saveItemButton").textContent = "Save Changes";
  openModal();
}

function openModal() {
  itemModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  setTimeout(() => document.getElementById("itemName").focus(), 50);
}

function closeModal() {
  itemModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

async function saveItem(event) {
  event.preventDefault();

  const id = document.getElementById("itemId").value;
  const item = {
    name: document.getElementById("itemName").value.trim(),
    description: document.getElementById("itemDescription").value.trim(),
    category: document.getElementById("itemCategory").value,
    price: Number(document.getElementById("itemPrice").value),
    isAvailable: document.getElementById("itemAvailable").checked,
  };

  if (!item.name || !item.description || !item.category || document.getElementById("itemPrice").value === "") {
    formError.textContent = "Please complete all menu item fields.";
    formError.classList.remove("hidden");
    return;
  }

  const saveButton = document.getElementById("saveItemButton");
  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  try {
    const response = await fetch(id ? `/admin/api/menu/${id}` : "/admin/api/menu", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save menu item");
    }

    closeModal();
    showToast(data.message);
    await loadMenu();
  } catch (error) {
    formError.textContent = error.message;
    formError.classList.remove("hidden");
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = id ? "Save Changes" : "Add Item";
  }
}

async function toggleStatus(item) {
  try {
    const response = await fetch(`/admin/api/menu/${item._id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !item.isAvailable }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update availability");
    }

    showToast(data.message);
    await loadMenu();
  } catch (error) {
    showToast(error.message, false);
  }
}

function openDeleteModal(item) {
  itemToDelete = item;
  document.getElementById("deleteItemName").textContent = item.name || "this unnamed item";
  deleteModal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeDeleteModal() {
  itemToDelete = null;
  deleteModal.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

async function deleteItem() {
  if (!itemToDelete) return;

  const button = document.getElementById("confirmDeleteButton");
  button.disabled = true;
  button.textContent = "Deleting...";

  try {
    const response = await fetch(`/admin/api/menu/${itemToDelete._id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete menu item");
    }

    closeDeleteModal();
    showToast(data.message);
    await loadMenu();
  } catch (error) {
    showToast(error.message, false);
  } finally {
    button.disabled = false;
    button.textContent = "Delete Item";
  }
}

document.getElementById("openAddModalButton").addEventListener("click", openAddModal);
document.getElementById("closeModalButton").addEventListener("click", closeModal);
document.getElementById("cancelModalButton").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);
document.getElementById("cancelDeleteButton").addEventListener("click", closeDeleteModal);
document.getElementById("confirmDeleteButton").addEventListener("click", deleteItem);
document.getElementById("searchInput").addEventListener("input", renderMenu);
document.getElementById("categoryFilter").addEventListener("change", renderMenu);
document.getElementById("statusFilter").addEventListener("change", renderMenu);
itemForm.addEventListener("submit", saveItem);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!deleteModal.classList.contains("hidden")) closeDeleteModal();
    else if (!itemModal.classList.contains("hidden")) closeModal();
  }
});

loadMenu();
