async function loadTables() {
  const response = await fetch("/admin/api/tables");

  const data = await response.json();

  const container = document.getElementById("tablesContainer");

  container.innerHTML = "";

  data.tables.forEach((table) => {
    container.innerHTML += `
    
    
    <div class="bg-white rounded-3xl p-6 shadow">
    
    
    <h2 class="text-2xl font-bold">
    
    Table ${table.tableNumber}
    
    </h2>
    
    
    
    <p class="mt-3 text-gray-500">
    
    Capacity:
    ${table.capacity}
    
    </p>
    
    
    
    <p class="text-gray-500">
    
    ${table.location}
    
    </p>
    
    
    
    
    <p class="mt-3">
    
    Status:
    
    <span class="
    ${table.isActive ? "text-green-600" : "text-red-600"}
    
    ">
    
    ${table.isActive ? "Active" : "Inactive"}
    
    </span>
    
    
    </p>
    
    
    
    
    <button
    
    onclick="changeStatus('${table._id}',${!table.isActive})"
    
    class="
    mt-5
    bg-[#8B5E34]
    text-white
    px-5
    py-2
    rounded-full
    ">
    
    Toggle Status
    
    </button>
    
    
    
    </div>
    
    
    `;
  });
}

async function addTable() {
  const tableNumber = document.getElementById("tableNumber").value;

  const capacity = document.getElementById("capacity").value;

  const location = document.getElementById("location").value;

  const response = await fetch("/admin/tables", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      tableNumber,
      capacity,
      location,
    }),
  });

  const data = await response.json();

  alert(data.message);

  if (data.success === true) {
    // clear inputs

    document.getElementById("tableNumber").value = "";

    document.getElementById("capacity").value = "";

    document.getElementById("location").value = "";

    // close form

    const form = document.getElementById("tableForm");

    form.classList.add("hidden");

    console.log("FORM CLOSED");
  }

  loadTables();
}

async function changeStatus(id, status) {
  await fetch(`/admin/tables/${id}/status`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      isActive: status,
    }),
  });

  loadTables();
}

function showForm() {
  document.getElementById("tableForm").classList.toggle("hidden");
}

loadTables();
