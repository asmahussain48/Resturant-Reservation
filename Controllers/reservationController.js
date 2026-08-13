  const Reservation = require("../models/Reservation");
  const RestaurantTable = require("../models/RestaurantTable");

  const {
    getAvailableTables,
    getAvailableSlots,
  } = require("../services/availabilityService");
  const { getRestaurantSettings } = require("../services/settingsService");

  async function checkAvailability(req, res) {
    try {
      const { date, startTime, people } = req.query;

      if (!date || !startTime || !people) {
        return res.status(400).json({
          success: false,
          message: "Date, time and people are required",
        });
      }

      const tables = await getAvailableTables(date, startTime, Number(people));

      res.status(200).json({
        success: true,

        availableTables: tables,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  async function createReservation(req, res) {
    try {
      const {
        tableId,
        reservationDate,
        startTime,
        numberOfPeople,
        customerName,
        phone,
      } = req.body;

      // Check required fields

      if (
        !tableId ||
        !reservationDate ||
        !startTime ||
        !numberOfPeople ||
        !customerName ||
        !phone
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Find table

      const table = await RestaurantTable.findById(tableId);

      if (!table) {
        return res.status(404).json({
          success: false,
          message: "Table not found",
        });
      }

      // Check table capacity

      if (table.capacity < numberOfPeople) {
        return res.status(400).json({
          success: false,
          message: "Table capacity is not enough",
        });
      }

      // Check if table already booked

      const existingReservation = await Reservation.findOne({
        table: tableId,

        reservationDate,

        startTime,

        status: {
          $in: ["pending", "confirmed"],
        },
      });

      if (existingReservation) {
        return res.status(409).json({
          success: false,

          message: "Table is already reserved",
        });
      }

      // Calculate end time

      const settings = await getRestaurantSettings();

      if (!settings || !settings.isOpen) {
        return res.status(400).json({
          success: false,
          message: "The restaurant is currently closed for reservations",
        });
      }

      const validSlots = await getAvailableSlots();

      if (!validSlots.includes(startTime)) {
        return res.status(400).json({
          success: false,
          message: "Please select one of the available reservation times",
        });
      }

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const endMinutes =
        startHour * 60 + startMinute + settings.slotDuration * 60;
      const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

      // Create reservation

      const reservation = await Reservation.create({
        user: req.session.user.id,

        table: tableId,

        customerName,

        phone,

        reservationDate,

        startTime,

        endTime,

        numberOfPeople,

        status: "confirmed",
      });

      res.status(201).json({
        success: true,

        message: "Reservation created successfully",

        reservation,
      });
    } catch (error) {
      // MongoDB unique index error

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,

          message: "Table already booked",
        });
      }

      console.log(error);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }

  async function getMyReservations(req, res) {
    try {
      const reservations = await Reservation.find({
        user: req.session.user.id,
      })
        .populate("table", "tableNumber capacity location")
        .sort({
          reservationDate: 1,
          startTime: 1,
        });

      res.status(200).json({
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

  async function cancelReservation(req, res) {
    try {
      const reservationId = req.params.id;

      const reservation = await Reservation.findOne({
        _id: reservationId,
        user: req.session.user.id,
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "Reservation not found",
        });
      }

      // Check if already cancelled

      if (reservation.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Reservation already cancelled",
        });
      }

      reservation.status = "cancelled";

      await reservation.save();

      res.status(200).json({
        success: true,

        message: "Reservation cancelled successfully",

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


  async function getReservationSlots(req, res) {
    try {
      const settings = await getRestaurantSettings();

      if (!settings) {
        return res.status(404).json({
          success: false,
          message: "Restaurant settings not found",
        });
      }

      const slots = await getAvailableSlots();

      res.status(200).json({
        success: true,

        slots,

        openingTime: settings.openingTime,

        closingTime: settings.closingTime,

        slotDuration: settings.slotDuration,

        isOpen: settings.isOpen,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message: "Server error",
      });
    }
  }

  async function getReservationById(req, res) {
    try {
      const reservationId = req.params.id;

      const reservation = await Reservation.findOne({
        _id: reservationId,

        user: req.session.user.id,
      }).populate("table", "tableNumber capacity location");

      if (!reservation) {
        return res.status(404).json({
          success: false,

          message: "Reservation not found",
        });
      }

      res.status(200).json({
        success: true,

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

  module.exports.createReservation = createReservation;

  module.exports = {
    checkAvailability,
    createReservation,
    getMyReservations,
    cancelReservation,
    getReservationSlots,
    getReservationById,
  };
