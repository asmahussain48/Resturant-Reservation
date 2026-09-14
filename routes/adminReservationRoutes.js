const express = require("express");

const router = express.Router();

const {
  getAllReservations,
  updateReservationStatus,
} = require("../controllers/adminReservationController");

const { requireAuth, requirePageAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

// PAGE ROUTE

router.get("/admin/reservations", requirePageAuth, isAdmin, (req, res) => {
  res.render("admin/reservations");
});

// API ROUTE

router.get("/admin/api/reservations", requireAuth, isAdmin, getAllReservations);

// UPDATE STATUS API

router.patch(
  "/admin/api/reservations/:id/status",
  requireAuth,
  isAdmin,
  updateReservationStatus,
);

module.exports = router;
