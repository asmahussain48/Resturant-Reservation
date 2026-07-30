const express = require("express");

const router = express.Router();

const { getDashboard } = require("../Controllers/adminController");

const { requireAuth } = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/isAdmin");

router.get("/admin/dashboard", requireAuth, isAdmin, getDashboard);

router.get("/admin/dashboard-page", requireAuth, isAdmin, (req, res) => {
  res.render("admin/dashboard");
});

router.get("/admin/menu-page", requireAuth, isAdmin, (req, res) => {
  res.render("admin/menu");
});


module.exports = router;
