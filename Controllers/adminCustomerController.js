const User = require("../models/User");
const Reservation = require("../models/Reservation");

// GET ALL CUSTOMERS

async function getCustomers(req, res) {
  try {
    const customers = await User.find({
      role: "user",
    }).select("-passwordHash");

    const data = await Promise.all(
      customers.map(async (customer) => {
        const reservations = await Reservation.find({
          user: customer._id,
        }).sort({
          createdAt: -1,
        });

        return {
          _id: customer._id,

          name: customer.name,

          phone: customer.phone,

          email: customer.email,

          totalReservations: reservations.length,

          lastVisit: reservations.length
            ? reservations[0].reservationDate
            : null,
        };
      }),
    );

    res.json({
      success: true,

      customers: data,
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
