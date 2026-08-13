const Reservation = require("../models/Reservation");
const RestaurantTable = require("../models/RestaurantTable");
const User = require("../models/User");

function toDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

async function getDashboard(req, res) {
  try {
    const today = toDateKey(new Date());

    const todayReservations = await Reservation.countDocuments({
      reservationDate: today,
    });

    const upcomingReservations = await Reservation.countDocuments({
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    const totalTables = await RestaurantTable.countDocuments({
      isActive: true,
    });

    const occupiedTables = await Reservation.countDocuments({
      reservationDate: today,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    const todayGuests = await Reservation.aggregate([
      {
        $match: {
          reservationDate: today,
        },
      },

      {
        $group: {
          _id: null,
          total: {
            $sum: "$numberOfPeople",
          },
        },
      },
    ]);

    const cancelledReservations = await Reservation.countDocuments({
      status: "cancelled",
    });

    res.json({
      success: true,

      data: {
        todayReservations,

        upcomingReservations,

        availableTables: totalTables - occupiedTables,

        occupiedTables,

        todayGuests: todayGuests[0]?.total || 0,

        cancelledReservations,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
}

module.exports = {
  getDashboard,
};
