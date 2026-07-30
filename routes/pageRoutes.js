 
const express = require("express");

const router = express.Router();
router.get("/", (req, res) => {
  res.render("pages/home");
});
router.get("/my-reservations", (req, res) => {
  res.render("pages/myReservations");
});
router.get("/reservations/:id", (req, res) => {
  res.render("pages/reservationDetails");
});
module.exports = router;