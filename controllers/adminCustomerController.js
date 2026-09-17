const User = require("../models/User");
const Reservation = require("../models/Reservation");

// GET ALL CUSTOMERS

async function getCustomers(req, res) {
  try {
    const customers = await User.aggregate([
      { $match: { role: "user" } },
      {
        $lookup: {
          from: "reservations",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: "reservations",
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          email: 1,
          totalReservations: { $size: "$reservations" },
          lastVisit: { $arrayElemAt: ["$reservations.reservationDate", 0] },
        },
      },
    ]);

    res.json({
      success: true,

      customers,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// CUSTOMER DETAILS

async function getCustomerById(req, res) {
  try {
    const customer = await User.findById(req.params.id).select("-passwordHash");

    const reservations = await Reservation.find({
      user: req.params.id,
    }).populate("table", "tableNumber location");

    res.json({
      success: true,

      customer,

      reservations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

// CUSTOMER RESERVATION HISTORY

async function getCustomerReservations(req, res) {
  try {
    const reservations = await Reservation.find({
      user: req.params.id,
    }).populate("table", "tableNumber location");

    res.json({
      success: true,

      reservations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

module.exports = {
  getCustomers,

  getCustomerById,

  getCustomerReservations,
};
