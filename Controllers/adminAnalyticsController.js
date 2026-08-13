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
    const activeStatuses = ["pending", "confirmed"];

    const [
      todayReservations,
      upcomingReservations,
      totalActiveTables,
      occupiedTableIds,
      guestTotals,
      cancelledReservations,
    ] = await Promise.all([
      Reservation.countDocuments({
        reservationDate: today,
        status: { $in: activeStatuses },
      }),
      Reservation.countDocuments({
        reservationDate: { $gte: today },
        status: { $in: activeStatuses },
      }),
      RestaurantTable.countDocuments({ isActive: true }),
      Reservation.distinct("table", {
        reservationDate: today,
        status: { $in: activeStatuses },
      }),
      Reservation.aggregate([
        { $match: { reservationDate: today, status: { $in: activeStatuses } } },
        { $group: { _id: null, total: { $sum: "$numberOfPeople" } } },
      ]),
      Reservation.countDocuments({ status: "cancelled" }),
    ]);

    const occupiedTables = occupiedTableIds.length;

    res.json({
      success: true,
      data: {
        todayReservations,
        upcomingReservations,
        availableTables: Math.max(0, totalActiveTables - occupiedTables),
        occupiedTables,
        todayGuests: guestTotals[0]?.total || 0,
        cancelledReservations,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getWeeklyReservations(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    const start = toDateKey(startDate);
    const end = toDateKey(today);

    const grouped = await Reservation.aggregate([
      {
        $match: {
          reservationDate: { $gte: start, $lte: end },
          status: { $in: ["pending", "confirmed"] },
        },
      },
      { $group: { _id: "$reservationDate", reservations: { $sum: 1 } } },
    ]);

    const counts = new Map(grouped.map((item) => [item._id, item.reservations]));
    const data = [];

    for (let index = 0; index < 7; index++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const key = toDateKey(date);
      data.push({ date: key, reservations: counts.get(key) || 0 });
    }

    res.json({ success: true, data, range: { start, end } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getPeakHours(req, res) {
  try {
    const data = await Reservation.aggregate([
      { $match: { status: { $in: ["pending", "confirmed"] } } },
      { $group: { _id: "$startTime", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getTableUtilization(req, res) {
  try {
    const data = await Reservation.aggregate([
      { $match: { status: { $in: ["pending", "confirmed"] } } },
      { $group: { _id: "$table", usage: { $sum: 1 } } },
      {
        $lookup: {
          from: "restauranttables",
          localField: "_id",
          foreignField: "_id",
          as: "table",
        },
      },
      { $unwind: "$table" },
      { $sort: { usage: -1 } },
      { $limit: 8 },
      {
        $project: {
          _id: 0,
          tableNumber: "$table.tableNumber",
          capacity: "$table.capacity",
          location: "$table.location",
          usage: 1,
        },
      },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getCustomerGrowth(req, res) {
  try {
    const data = await User.aggregate([
      { $match: { role: "user" } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          customers: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getDashboard,
  getWeeklyReservations,
  getPeakHours,
  getTableUtilization,
  getCustomerGrowth,
};
