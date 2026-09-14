const express = require("express");

const {
  checkAvailability,
  createReservation,
  getMyReservations,
  cancelReservation,
  getReservationSlots,
  getReservationById,
} = require("../controllers/reservationController");

const {
  reservationValidation,
  validateRequest,
} = require("../validators/reservationValidators");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/availability", requireAuth, checkAvailability);

router.get("/reservation-slots", requireAuth, getReservationSlots);

router.post(
  "/reservations",
  requireAuth,
  reservationValidation,
  validateRequest,
  createReservation,
);

router.get("/api/my-reservations", requireAuth, getMyReservations);

router.get("/api/reservations/:id", requireAuth, getReservationById);

router.post("/api/reservations/:id/cancel", requireAuth, cancelReservation);

module.exports = router;
