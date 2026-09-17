const Reservation = require("../models/Reservation");

async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.find()

      .populate("table", "tableNumber capacity location")

      .populate("user", "name email phone")

      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,

      reservations,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
}

async function updateReservationStatus(req, res) {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,

        message: "Reservation not found",
      });
    }

    reservation.status = status;

    await reservation.save();

    res.json({
      success: true,

      message: "Status updated",

      reservation,
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
  getAllReservations,

  updateReservationStatus,
};
