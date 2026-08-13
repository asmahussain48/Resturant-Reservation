 
const express = require("express");
const { requirePageAuth } = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", (req, res) => {
  res.render("pages/home");
});
router.get("/reservations/:id", requirePageAuth, (req, res) => {
  res.render("pages/reservationDetails");
});
module.exports = router;
