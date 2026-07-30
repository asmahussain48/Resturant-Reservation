const express = require("express");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Login page
router.get("/login", (req, res) => {
  res.render("pages/login");
});

// Register page
router.get("/register", (req, res) => {
  res.render("pages/register");
});

// Menu page
router.get("/menu", requireAuth, (req, res) => {
  res.render("pages/menu");
});

// Reservation page added to the 
router.get(
  "/reservation",
  requireAuth,
  (req, res) => {
    res.render("pages/reservation");
  }
);
router.get("/my-reservations", (req, res) => {
  res.render("pages/myReservations");
});
module.exports = router;
