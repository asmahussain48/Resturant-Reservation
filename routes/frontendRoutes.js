const express = require("express");

const { requirePageAuth, requireGuest } = require("../middleware/authMiddleware");

const router = express.Router();

// Login page
router.get("/login", requireGuest, (req, res) => {
  res.render("pages/login");
});

// Register page
router.get("/register", requireGuest, (req, res) => {
  res.render("pages/register");
});

// Menu page
router.get("/menu", (req, res) => {
  res.render("pages/menu");
});

// Reservation page added to the 
router.get(
  "/reservation",
  requirePageAuth,
  (req, res) => {
    res.render("pages/reservation");
  }
);
router.get("/my-reservations", requirePageAuth, (req, res) => {
  res.render("pages/myReservations");
});
module.exports = router;
