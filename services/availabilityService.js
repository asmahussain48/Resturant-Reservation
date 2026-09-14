const RestaurantTable = require("../models/RestaurantTable");
const Reservation = require("../models/Reservation");
const { getRestaurantSettings } = require("./settingsService");

function generateTimeSlots(openingTime, closingTime, duration) {
  const slots = [];

  const [openingHour, openingMinute] = openingTime.split(":").map(Number);
  const [closingHour, closingMinute] = closingTime.split(":").map(Number);
  let currentMinutes = openingHour * 60 + openingMinute;
  const closingMinutes = closingHour * 60 + closingMinute;
  const durationMinutes = Number(duration) * 60;

  while (currentMinutes + durationMinutes <= closingMinutes) {
    const hour = Math.floor(currentMinutes / 60);
    const minute = currentMinutes % 60;

    slots.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );

    currentMinutes += durationMinutes;
  }

  return slots;
}

async function getAvailableTables(reservationDate, startTime, numberOfPeople) {
  const suitableTables = await RestaurantTable.find({
    capacity: {
      $gte: numberOfPeople,
    },

    isActive: true,
  });

  const reservations = await Reservation.find({
    reservationDate,

    startTime,

    status: {
      $in: ["pending", "confirmed"],
    },
  });

  const bookedTableIds = reservations.map((reservation) =>
    reservation.table.toString(),
  );

  const availableTables = suitableTables.filter(
    (table) => !bookedTableIds.includes(table._id.toString()),
  );

  return availableTables;
}

async function getAvailableSlots() {
  const settings = await getRestaurantSettings();

  if (!settings) {
    throw new Error("Restaurant settings not found");
  }

  const slots = generateTimeSlots(
    settings.openingTime,

    settings.closingTime,

    settings.slotDuration,
  );

  return slots;
}

module.exports = {
  getAvailableTables,

  getAvailableSlots,

  generateTimeSlots,
};
