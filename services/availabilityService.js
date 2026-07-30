const RestaurantTable = require("../models/RestaurantTable");
const Reservation = require("../models/Reservation");
const { getRestaurantSettings } = require("./settingsService");

function generateTimeSlots(openingTime, closingTime, duration) {
  const slots = [];

  let currentHour = Number(openingTime.split(":")[0]);

  const closingHour = Number(closingTime.split(":")[0]);

  while (currentHour + duration <= closingHour) {
    const formattedTime = `${currentHour.toString().padStart(2, "0")}:00`;

    slots.push(formattedTime);

    currentHour += duration;
  }

  return slots;
}

async function getAvailableTables(reservationDate, startTime, numberOfPeople) {
  console.log("getAvailableTables function called");
  const suitableTables = await RestaurantTable.find({
    capacity: {
      $gte: numberOfPeople,
    },

    isActive: true,
  });

  console.log("NUMBER OF PEOPLE:", numberOfPeople);

  console.log("SUITABLE TABLES:", suitableTables);

  const reservations = await Reservation.find({
    reservationDate,

    startTime,

    status: {
      $in: ["pending", "confirmed"],
    },
  });
  console.log("RESERVATIONS:", reservations);

  const bookedTableIds = reservations.map((reservation) =>
    reservation.table.toString(),
  );

  console.log("BOOKED TABLE IDS:", bookedTableIds);
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
};
