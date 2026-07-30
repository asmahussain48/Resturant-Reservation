async function loadReservations() {
    const response = await fetch("/admin/api/reservations");

    const data = await response.json();

    const table = document.getElementById("reservationTable");

    table.innerHTML = "";

    data.reservations.forEach((reservation) => {
        table.innerHTML += `
    
    
    <tr class="border-b">
    
    
    <td class="p-4">
    
    ${reservation.customerName}
    
    </td>
    
    
    
    <td class="p-4">
    
    ${reservation.phone}
    
    </td>
    
    
    
    <td class="p-4">
    
    ${reservation.reservationDate}
    
    </td>
    
    
    
    <td class="p-4">
    
    ${reservation.startTime}
    -
    ${reservation.endTime}
    
    </td>
    
    
    
    <td class="p-4">
    
    Table ${reservation.table.tableNumber}
    
    <br>
    
    <span class="text-gray-500">
    
    ${reservation.table.location}
    
    </span>
    
    </td>
    
    
    
    <td class="p-4">
    
    ${reservation.numberOfPeople}
    
    </td>
    
    
    
    <td class="p-4">
    
    
    <select
    id="status-${reservation._id}"
    class="border rounded-lg px-3 py-2">
    
    
    <option ${reservation.status === "pending" ? "selected" : ""}>
    pending
    </option>
    
    
    <option ${reservation.status === "confirmed" ? "selected" : ""}>
    confirmed
    </option>
    
    
    <option ${reservation.status === "completed" ? "selected" : ""}>
    completed
    </option>
    
    
    <option ${reservation.status === "cancelled" ? "selected" : ""}>
    cancelled
    </option>
    
    
    <option ${reservation.status === "no-show" ? "selected" : ""}>
    no-show
    </option>
    
    
    </select>
    
    
    </td>
    
    
    
    
    <td class="p-4">
    
    
    <button
    
    onclick="updateStatus('${reservation._id}')"
    
    class="
    bg-[#8B5E34]
    text-white
    px-4
    py-2
    rounded-full
    ">
    
    
    Update
    
    
    </button>
    
    
    </td>
    
    
    
    </tr>
    
    
    `;
    });
}

async function updateStatus(id) {
    const status = document.getElementById(`status-${id}`).value;

    const response = await fetch(`/admin/api/reservations/${id}/status`, {
        method: "PATCH",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            status,
        }),
    });

    const data = await response.json();

    alert(data.message);

    loadReservations();
}

loadReservations();
